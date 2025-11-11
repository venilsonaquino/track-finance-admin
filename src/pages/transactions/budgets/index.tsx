import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import ReadOnlyBlock from "./components/ReadOnlyBlock";
import EditableBlock from "./components/EditableBlock";
import { EditableSectionState, MonthKey, SectionEditable } from "./types";
import ManageGroupsSheet from "./components/ManageGroupsSheet";
import { useBudgetGroups } from "../hooks/use-budget-group";

const MONTH_LABELS_MAP: Record<MonthKey, string> = {
  Jan: "Janeiro",
  Fev: "Fevereiro",
  Mar: "Março",
  Abr: "Abril",
  Mai: "Maio",
  Jun: "Junho",
  Jul: "Julho",
  Ago: "Agosto",
  Set: "Setembro",
  Out: "Outubro",
  Nov: "Novembro",
  Dez: "Dezembro",
};

const toValuesArray = (monthOrder: MonthKey[], values: Record<MonthKey, number>) =>
  monthOrder.map((month) => values[month] ?? 0);

export default function BudgetPage() {

  const { 
    budgetOverview, 
    budgetGroups,
    loading,
    error,
    fetchBudgetGroups
  } = useBudgetGroups();
  const [editableSections, setEditableSections] = useState<EditableSectionState[]>([]);

  const monthOrder: MonthKey[] = budgetOverview.months;
  const monthLabels = useMemo(() => monthOrder.map((key: MonthKey) => MONTH_LABELS_MAP[key]), [monthOrder]);

  const computedSection = budgetOverview.sectionsComputed;

  useEffect(() => {
    setEditableSections(
      budgetOverview.sectionsEditable.map((section: SectionEditable) => ({
        id: section.id,
        title: section.title,
        color: section.color,
        footerLabel: section.footerLabel,
        rows: section.rows.map((row: { id: string; label: string; values: Record<MonthKey, number> }) => ({
          id: row.id,
          label: row.label,
          values: toValuesArray(monthOrder, row.values),
        })),
      }))
    );
  }, [budgetOverview.sectionsEditable, monthOrder]);

  // Array reutilizável de zeros para evitar alocações repetidas
  const emptyValuesArray = useMemo(() => 
    Array.from({ length: monthOrder.length }, () => 0), 
    [monthOrder.length]
  );

  const totalsBySectionTitle = useMemo(() => {
    const length = monthOrder.length;
    return editableSections.reduce((acc, section) => {
      const totals = Array.from({ length }, (_, idx) =>
        section.rows.reduce((sum, row) => sum + (row.values[idx] || 0), 0)
      );
      acc[section.title] = totals;
      return acc;
    }, {} as Partial<Record<SectionEditable["title"], number[]>>);
  }, [editableSections, monthOrder.length]);

  // Memoização do computedRows para evitar recriação desnecessária
  const computedRows = useMemo(() => 
    (computedSection?.rows ?? []).map((row: { id: string; label: string; refSectionTitle: string }) => ({
      id: row.id,
      label: row.label,
      values: totalsBySectionTitle[row.refSectionTitle] ?? emptyValuesArray,
    })),
    [computedSection?.rows, totalsBySectionTitle, emptyValuesArray]
  );

  const saldoValues = useMemo(
    () =>
      monthOrder.map((_, monthIdx) =>
        computedRows.reduce(
          (acc: number, row: { id: string; label: string; values: number[] }, rowIndex: number) =>
            rowIndex === 0 ? row.values[monthIdx] : acc - (row.values[monthIdx] || 0),
          0
        )
      ),
    [computedRows, monthOrder]
  );

  const updateCell = useCallback((
    sectionId: string,
    rowId: string,
    monthIndex: number,
    nextValueFactory: (current: number) => number
  ) => {
    setEditableSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.map((row) => {
            if (row.id !== rowId) return row;
            const currentValue = row.values[monthIndex] || 0;
            const nextValue = nextValueFactory(currentValue);
            return {
              ...row,
              values: row.values.map((value, idx) => (idx === monthIndex ? nextValue : value)),
            };
          }),
        };
      })
    );
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Erro ao carregar orçamentos</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (  
		<>
      <div className="flex justify-between items-center">
        <PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Orçamentos", href: "/transacoes/orcamento" }]} />
        <div className="flex justify-end gap-2 mb-4">
          <ManageGroupsSheet
            labelButton="Organizar Grupos"
            budgetGroups={budgetGroups}
            onRefreshBudgetGroups={fetchBudgetGroups}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Card className="shadow-sm">
          <CardContent className="space-y-6">
            <ReadOnlyBlock
              title="SALDO"
              color={computedSection?.color}
              months={monthLabels}
              rows={computedRows}
              footer={computedSection.footerLabel ? { label: computedSection.footerLabel, values: saldoValues } : undefined}
            />
            {editableSections.map((section) => (
              <EditableBlock
                key={section.id}
                title={section.title}
                color={section.color}
                months={monthLabels}
                rows={section.rows}
                footerLabel={section.footerLabel}
                footerValues={totalsBySectionTitle[section.title] ?? emptyValuesArray}
                onUpdateCell={(rowId, monthIndex, factory) => updateCell(section.id, rowId, monthIndex, factory)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
		</>
  );
}





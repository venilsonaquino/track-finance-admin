import { useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { BUDGET_MOCK } from "./budget.mock";
import ReadOnlyBlock from "./components/ReadOnlyBlock";
import EditableBlock from "./components/EditableBlock";
import { EditableSectionState, MonthKey, SectionEditable } from "./types";
import ManageGroupsSheet from "./components/ManageGroupsSheet";

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
  const monthOrder = BUDGET_MOCK.months;
  const monthLabels = useMemo(() => monthOrder.map((key) => MONTH_LABELS_MAP[key]), [monthOrder]);
  const computedSection = BUDGET_MOCK.sectionsComputed;
  const monthCount = monthOrder.length;
  const zeroMonthValues = useMemo(() => Array.from({ length: monthCount }, () => 0), [monthCount]);

  const [editableSections, setEditableSections] = useState<EditableSectionState[]>(() =>
    BUDGET_MOCK.sectionsEditable
      .map((section) => ({
        id: section.id,
        title: section.title,
        color: section.color,
        footerLabel: section.footerLabel,
        rows: section.rows.map((row) => ({
          id: row.id,
          label: row.label,
          values: toValuesArray(monthOrder, row.values),
        })),
      }))
  );

  const totalsBySectionTitle = useMemo(() => {
    const length = monthCount;
    return editableSections.reduce((acc, section) => {
      const totals = Array.from({ length }, (_, idx) =>
        section.rows.reduce((sum, row) => sum + (row.values[idx] || 0), 0)
      );
      acc[section.title] = totals;
      return acc;
    }, {} as Partial<Record<SectionEditable["title"], number[]>>);
  }, [editableSections, monthCount]);

  const computedRows = useMemo(
    () =>
      (computedSection?.rows ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        values: totalsBySectionTitle[row.refSectionTitle] ?? zeroMonthValues,
      })),
    [computedSection, totalsBySectionTitle, zeroMonthValues]
  );

  const saldoValues = useMemo(
    () =>
      monthOrder.map((_, monthIdx) =>
        computedRows.reduce(
          (acc, row, rowIndex) => (rowIndex === 0 ? row.values[monthIdx] : acc - (row.values[monthIdx] || 0)),
          0
        )
      ),
    [computedRows, monthOrder]
  );

  const updateCell = useCallback(
    (
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
    },
    []
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Orçamentos", href: "/transacoes/orcamento" }]} />
        <div className="mb-4 flex justify-end gap-2">
          <ManageGroupsSheet labelButton="Organizar Grupos" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Card className="shadow-sm">
          <CardContent className="space-y-6">
            <ReadOnlyBlock
              title="SALDO"
              color={computedSection?.color}
              months={monthLabels}
              rows={computedRows}
              footer={
                computedSection?.footer
                  ? { label: computedSection.footer.label, values: saldoValues }
                  : undefined
              }
            />
            {editableSections.map((section) => (
              <EditableBlock
                key={section.id}
                title={section.title}
                color={section.color}
                months={monthLabels}
                rows={section.rows}
                footerLabel={section.footerLabel}
                footerValues={totalsBySectionTitle[section.title] ?? zeroMonthValues}
                onUpdateCell={(rowId, monthIndex, factory) =>
                  updateCell(section.id, rowId, monthIndex, factory)
                }
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}





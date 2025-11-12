import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import ReadOnlyBlock from "./components/ReadOnlyBlock";
import EditableBlock from "./components/EditableBlock";
import { EditableSectionState, MonthKey, SectionEditable } from "./types";
import ManageGroupsSheet from "./components/ManageGroupsSheet";
import { useBudgetOverview, useBudgetGroupsCrud } from "../hooks/use-budget-group";
import { MonthYearPicker } from "../movements/components/MonthYearPicker";

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

const BudgetSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Orçamentos", href: "/transacoes/orcamento" }]} />
      <div className="flex justify-end gap-2 mb-4">
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
    <div className="h-16 bg-gray-200/60 animate-pulse rounded-lg" />
    <Card className="shadow-sm">
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="border rounded-md">
            <div className="h-12 bg-gray-100 animate-pulse" />
            <div className="p-4 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div key={j} className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="border rounded-md">
              <div className="h-12 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex space-x-4">
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                    {Array.from({ length: 12 }).map((_, k) => (
                      <div key={k} className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

type BudgetErrorStateProps = {
  message: string;
  onRetry: () => void;
};

const BudgetErrorState = ({ message, onRetry }: BudgetErrorStateProps) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <div className="text-red-600 mb-2">Erro ao carregar orçamentos</div>
      <p className="text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tentar novamente
      </button>
    </div>
  </div>
);

export default function BudgetPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();

  const {
    budgetOverview,
    loadingBudgetOverview: loading,
    error: overviewError,
    fetchBudgetOverview,
  } = useBudgetOverview(currentYear);

  const {
    budgetGroups,
    loadingCreateGroup,
    error: crudError,
    createBudgetGroup,
    fetchBudgetGroups,
  } = useBudgetGroupsCrud();

  const blockingError = overviewError || crudError;
  const [editableSections, setEditableSections] = useState<EditableSectionState[]>([]);

  const monthOrder = useMemo<MonthKey[]>(
    () => budgetOverview?.months ?? [],
    [budgetOverview?.months]
  );

  const monthLabels = useMemo(
    () => monthOrder.map((key: MonthKey) => MONTH_LABELS_MAP[key] ?? key),
    [monthOrder]
  );

  const computedSection = budgetOverview?.sectionsComputed;

  const serverEditableSections = useMemo<EditableSectionState[]>(() => {
    if (!budgetOverview) return [];
    return budgetOverview.sectionsEditable.map((section: SectionEditable) => ({
      id: section.id,
      title: section.title,
      color: section.color,
      footerLabel: section.footerLabel,
      rows: section.rows.map((row) => ({
        id: row.id,
        label: row.label,
        values: toValuesArray(monthOrder, row.values),
      })),
    }));
  }, [budgetOverview, monthOrder]);

  useEffect(() => {
    if (!budgetOverview) return;
    setEditableSections(serverEditableSections);
  }, [budgetOverview, serverEditableSections]);

  const emptyValuesArray = useMemo(
    () => monthOrder.map(() => 0),
    [monthOrder]
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
  }, [editableSections, monthOrder]);

  const computedRows = useMemo(
    () =>
      (computedSection?.rows ?? []).map((row) => ({
        id: row.id,
        label: row.label,
        values: totalsBySectionTitle[row.refSectionTitle] ?? emptyValuesArray,
      })),
    [computedSection, totalsBySectionTitle, emptyValuesArray]
  );

  const saldoValues = useMemo(() => {
    if (!computedRows.length) {
      return emptyValuesArray;
    }

    return monthOrder.map((_, monthIdx) =>
      computedRows.reduce(
        (acc, row, rowIndex) =>
          rowIndex === 0 ? (row.values[monthIdx] ?? 0) : acc - (row.values[monthIdx] || 0),
        0
      )
    );
  }, [computedRows, monthOrder, emptyValuesArray]);

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

  const handleMonthYearChange = useCallback((nextDate: Date) => {
    setCurrentDate(nextDate);
  }, []);

  const refreshCurrentBudgetOverview = useCallback(() => {
    return fetchBudgetOverview(currentYear);
  }, [fetchBudgetOverview, currentYear]);

  if (blockingError && !loading) {
    return <BudgetErrorState message={blockingError} onRetry={() => fetchBudgetOverview(currentYear)} />;
  }

  if (loading || !budgetOverview) {
    return <BudgetSkeleton />;
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
            createBudgetGroup={createBudgetGroup}
            loadingCreateGroup={loadingCreateGroup}
            onGroupsChanged={refreshCurrentBudgetOverview}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MonthYearPicker date={currentDate} onChange={handleMonthYearChange} mode="year" />
      </div>
      <div className="flex justify-between items-center">
        <Card className="shadow-sm">
          <CardContent className="space-y-6">
            <ReadOnlyBlock
              title="SALDO"
              color={computedSection?.color}
              months={monthLabels}
              rows={computedRows}
              footer={
                computedSection?.footerLabel
                  ? { label: computedSection.footerLabel, values: saldoValues }
                  : undefined
              }
              locale={budgetOverview.locale}
              currency={budgetOverview.currency}
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
                onUpdateCell={(rowId, monthIndex, factory) =>
                  updateCell(section.id, rowId, monthIndex, factory)
                }
                locale={budgetOverview.locale}
                currency={budgetOverview.currency}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

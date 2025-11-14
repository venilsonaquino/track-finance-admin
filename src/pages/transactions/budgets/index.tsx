import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import ReadOnlyBlock from "./components/ReadOnlyBlock";
import EditableBlock from "./components/EditableBlock";
import { EditableSectionState, MonthKey, PendingDraftEntry, SectionEditable } from "./types";
import ManageGroupsSheet from "./components/ManageGroupsSheet";
import { useBudgetOverview, useBudgetGroupsCrud } from "../hooks/use-budget-group";
import { useBudgetDraftCache } from "../hooks/use-budget-draft-cache";
import { MonthYearPicker } from "../movements/components/MonthYearPicker";
import { toast } from "sonner";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateGroupDialog from "./components/CreateGroupDialog";

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

const cloneDraftSections = (sections: EditableSectionState[]): EditableSectionState[] =>
  sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      values: [...row.values],
    })),
  }));

const generatePendingEntryId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `pending-${Date.now()}-${Math.random()}`;

type PendingEntryInput = {
  sectionId: string;
  sectionTitle: string;
  rowId: string;
  rowLabel: string;
  monthIndex: number;
  monthLabel: string;
  delta: number;
};

type BaselineValuesBySection = Record<string, Record<string, number[]>>;
type PendingCellsLookup = Record<string, Record<string, Record<number, true>>>;

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
    draft,
    saveDraft,
    clearDraft,
    canRestoreDraft,
  } = useBudgetDraftCache(currentYear);

  const {
    budgetGroups,
    loadingCreateGroup,
    error: crudError,
    createBudgetGroup,
    fetchBudgetGroups,
    renameBudgetGroup,
    deleteBudgetGroup,
  } = useBudgetGroupsCrud();

  const blockingError = overviewError || crudError;
  const [editableSections, setEditableSections] = useState<EditableSectionState[]>([]);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const [pinSaldoCard, setPinSaldoCard] = useState(false);
  const [pendingEntries, setPendingEntries] = useState<PendingDraftEntry[]>([]);
  const draftAppliedRef = useRef(false);

  const registerPendingEntry = useCallback((input: PendingEntryInput) => {
    setPendingEntries((prev) => {
      const nextEntry: PendingDraftEntry = {
        id: generatePendingEntryId(),
        timestamp: Date.now(),
        ...input,
      };
      return [nextEntry, ...prev].slice(0, 50);
    });
  }, []);

  const removeLatestPendingEntryForCell = useCallback((sectionId: string, rowId: string, monthIndex: number) => {
    setPendingEntries((prev) => {
      const next = [...prev];
      const index = next.findIndex(
        (entry) =>
          entry.sectionId === sectionId &&
          entry.rowId === rowId &&
          entry.monthIndex === monthIndex
      );
      if (index === -1) return prev;
      next.splice(index, 1);
      return next;
    });
  }, []);


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
      isSystemDefault: section.isSystemDefault,
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

  useEffect(() => {
    draftAppliedRef.current = false;
  }, [currentYear, budgetOverview?.version]);

  useEffect(() => {
    if (!budgetOverview || !draft) return;
    if (!canRestoreDraft({ version: budgetOverview.version })) return;
    if (draftAppliedRef.current) return;

    setEditableSections(cloneDraftSections(draft.sections));
    setPendingEntries(draft.pendingEntries ?? []);
    draftAppliedRef.current = true;
  }, [budgetOverview, canRestoreDraft, draft]);

  const baselineValuesBySection = useMemo<BaselineValuesBySection>(() => {
    return serverEditableSections.reduce((acc, section) => {
      acc[section.id] = section.rows.reduce((rowAcc, row) => {
        rowAcc[row.id] = [...row.values];
        return rowAcc;
      }, {} as Record<string, number[]>);
      return acc;
    }, {} as BaselineValuesBySection);
  }, [serverEditableSections]);

  const pendingCellsBySection = useMemo<PendingCellsLookup>(() => {
    return editableSections.reduce((acc, section) => {
      const baselineSection = baselineValuesBySection[section.id] ?? {};
      const rowPending = section.rows.reduce((rowAcc, row) => {
        row.values.forEach((value, idx) => {
          const baselineValue = baselineSection[row.id]?.[idx] ?? 0;
          if (value !== baselineValue) {
            if (!rowAcc[row.id]) {
              rowAcc[row.id] = {};
            }
            rowAcc[row.id][idx] = true;
          }
        });
        return rowAcc;
      }, {} as Record<string, Record<number, true>>);

      if (Object.keys(rowPending).length > 0) {
        acc[section.id] = rowPending;
      }
      return acc;
    }, {} as PendingCellsLookup);
  }, [editableSections, baselineValuesBySection]);

  const hasPendingChanges = useMemo(() => Object.keys(pendingCellsBySection).length > 0, [pendingCellsBySection]);

  useEffect(() => {
    setPendingEntries((prev) => {
      const filtered = prev.filter(
        (entry) => pendingCellsBySection[entry.sectionId]?.[entry.rowId]?.[entry.monthIndex]
      );
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [pendingCellsBySection]);

  const emptyValuesArray = useMemo(
    () => monthOrder.map(() => 0),
    [monthOrder]
  );

  useEffect(() => {
    if (!budgetOverview) return;
    if (hasPendingChanges) {
      saveDraft(editableSections, {
        version: budgetOverview.version,
        pendingEntries,
      });
    } else {
      clearDraft();
      if (pendingEntries.length) {
        setPendingEntries([]);
      }
    }
  }, [budgetOverview, clearDraft, editableSections, hasPendingChanges, pendingEntries, saveDraft]);

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

  const cancelEditingSection = useCallback(() => {
    setEditingSectionId(null);
    setEditingTitleValue("");
    setSavingTitle(false);
  }, []);

  useEffect(() => {
    if (editingSectionId && !editableSections.some((section) => section.id === editingSectionId)) {
      cancelEditingSection();
    }
  }, [editableSections, editingSectionId, cancelEditingSection]);

  const handleDeleteSection = useCallback(async (section: EditableSectionState) => {
    if (section.isSystemDefault) {
      toast.error("Não é possível excluir um grupo padrão.");
      return;
    }

    if (deletingSectionId) {
      toast.info("Aguarde a exclusão em andamento.");
      return;
    }

    const shouldDelete = typeof window === "undefined"
      ? true
      : window.confirm(`Tem certeza que deseja excluir o grupo "${section.title}"? Essa ação não pode ser desfeita.`);

    if (!shouldDelete) return;

    try {
      setDeletingSectionId(section.id);
      await deleteBudgetGroup(section.id);
      setEditableSections((prev) => prev.filter(({ id }) => id !== section.id));
      toast.success("Grupo excluído com sucesso!");
      refreshCurrentBudgetOverview();
    } catch (error) {
      console.error("Erro ao excluir grupo:", error);
      toast.error("Não foi possível excluir o grupo.");
    } finally {
      setDeletingSectionId((current) => (current === section.id ? null : current));
    }
  }, [deleteBudgetGroup, refreshCurrentBudgetOverview, deletingSectionId]);

  const handleSectionAction = useCallback((section: EditableSectionState, action: "edit" | "delete" | "addCategory") => {
    if (action === "edit") {
      setEditingSectionId(section.id);
      setEditingTitleValue(section.title);
      return;
    }

    if (action === "delete") {
      handleDeleteSection(section);
      return;
    }

    const actionLabels = {
      addCategory: "Adicionar categoria",
    } as const;

    toast.info(`${actionLabels[action]}: ${section.title}`);
  }, [handleDeleteSection]);

  const saveSectionTitle = useCallback(async () => {
    if (!editingSectionId) return;
    const trimmedTitle = editingTitleValue.trim();
    if (!trimmedTitle) {
      toast.error("Informe um nome válido para o grupo.");
      return;
    }

    try {
      setSavingTitle(true);
      await renameBudgetGroup(editingSectionId, trimmedTitle);
      setEditableSections((prev) =>
        prev.map((section) =>
          section.id === editingSectionId
            ? { ...section, title: trimmedTitle }
            : section
        )
      );
      toast.success("Grupo atualizado com sucesso!");
      cancelEditingSection();
      refreshCurrentBudgetOverview();
    } catch (error) {
      console.error("Erro ao renomear grupo:", error);
      toast.error("Não foi possível renomear o grupo.");
    } finally {
      setSavingTitle(false);
    }
  }, [editingSectionId, editingTitleValue, renameBudgetGroup, cancelEditingSection, refreshCurrentBudgetOverview]);

  if (blockingError && !loading) {
    return <BudgetErrorState message={blockingError} onRetry={() => fetchBudgetOverview(currentYear)} />;
  }

  if (loading || !budgetOverview) {
    return <BudgetSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Orçamentos", href: "/transacoes/orcamento" }]} />
        <div className="flex justify-end gap-2">
            <CreateGroupDialog 
              createBudgetGroup={createBudgetGroup}
              loading={loadingCreateGroup}
            />
          <ManageGroupsSheet
            labelButton="Organizar Grupos"
            budgetGroups={budgetGroups}
            onRefreshBudgetGroups={fetchBudgetGroups}
            onGroupsChanged={refreshCurrentBudgetOverview}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MonthYearPicker date={currentDate} onChange={handleMonthYearChange} mode="year" />
      </div>
      <div className="mt-4 w-full space-y-4">
        <Card
          className={cn(
            "shadow-sm w-full overflow-hidden transition-all duration-300",
            pinSaldoCard
              ? "sticky top-20 z-30 border-primary/40 shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
              : ""
          )}
        >
          <CardContent className="space-y-4 px-3 sm:px-6">
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
              titleAction={
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={pinSaldoCard ? "Desfixar cartão do saldo" : "Fixar cartão do saldo"}
                  aria-pressed={pinSaldoCard}
                  onClick={() => setPinSaldoCard((prev) => !prev)}
                  className={cn(
                    "h-8 w-8 text-muted-foreground",
                    pinSaldoCard && "text-primary"
                  )}
                >
                  {pinSaldoCard ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
              }
            />
          </CardContent>
        </Card>
        {editableSections.map((section) => (
          <Card key={section.id} className="shadow-sm w-full overflow-hidden">
            <CardContent className="space-y-6 px-3 sm:px-6">
              <EditableBlock
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
                onEdit={() => handleSectionAction(section, "edit")}
                onDelete={() => handleSectionAction(section, "delete")}
                onAddCategory={() => handleSectionAction(section, "addCategory")}
                isSystemDefault={section.isSystemDefault}
                editingTitle={editingSectionId === section.id}
                titleInputValue={editingSectionId === section.id ? editingTitleValue : undefined}
                onTitleInputChange={(value) => setEditingTitleValue(value)}
                onTitleSave={saveSectionTitle}
                onTitleCancel={cancelEditingSection}
                savingTitle={savingTitle && editingSectionId === section.id}
                hasPendingChanges={Boolean(pendingCellsBySection[section.id])}
                isCellPending={(rowId, monthIndex) =>
                  Boolean(pendingCellsBySection[section.id]?.[rowId]?.[monthIndex])
                }
                onRegisterPendingEntry={(payload) =>
                  registerPendingEntry({
                    ...payload,
                    sectionId: section.id,
                    sectionTitle: section.title,
                  })
                }
                onUndoPendingEntry={(payload) =>
                  removeLatestPendingEntryForCell(section.id, payload.rowId, payload.monthIndex)
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

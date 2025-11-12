import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, ListTodo, X } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/pages/category/hooks/use-categories";
import { CategoryCardSheet, GroupCardSheet } from "./CardSheet";
import MoveBarSheet from "./MoveBarSheet";
import ColumnHeader from "./ColumnHeaderSheet";
import { BudgetGroupService, BudgetGroupResponse, BudgetGroupRequest } from "@/api/services/budgetGroupService";
import { CategoryIdsByGroup } from "../types";
import CreateGroupDialog from "./CreateGroupDialog";

const cloneCategoriesByGroup = (source: CategoryIdsByGroup = {}): CategoryIdsByGroup =>
  Object.fromEntries(
    Object.entries(source).map(([groupId, ids]) => [groupId, [...ids]])
  );

const buildCategoriesByGroup = (groups: BudgetGroupResponse[]): CategoryIdsByGroup =>
  groups.reduce((acc, group) => {
    acc[group.id] = group.categories?.map(cat => cat.id) ?? [];
    return acc;
  }, {} as CategoryIdsByGroup);

function removeCategoryFromAll(map: CategoryIdsByGroup, id: string): CategoryIdsByGroup {
  return Object.fromEntries(
    Object.entries(map).map(([g, ids]) => [g, ids.filter(x => x !== id)])
  ) as CategoryIdsByGroup;
}

function addCategoryToGroup(map: CategoryIdsByGroup, groupId: string, id: string): CategoryIdsByGroup {
  const next = { ...map, [groupId]: [...(map[groupId] ?? [])] };
  if (!next[groupId].includes(id)) next[groupId].push(id);
  return next;
}

type ManageGroupsSheetProps = { 
  labelButton?: string;
  budgetGroups: BudgetGroupResponse[];
  onRefreshBudgetGroups: () => void | Promise<void>;
  createBudgetGroup?: (data: BudgetGroupRequest) => Promise<void>;
  loadingCreateGroup?: boolean;
  onGroupsChanged?: () => void | Promise<void>;
}

export default function ManageGroupsSheet({ 
  labelButton, 
  budgetGroups, 
  onRefreshBudgetGroups,
  createBudgetGroup,
  loadingCreateGroup,
  onGroupsChanged,
}: ManageGroupsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
  const [pulseGroup, setPulseGroup] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoriesByGroup, setCategoriesByGroup] = useState<CategoryIdsByGroup>({});
  const [initialCategoriesByGroup, setInitialCategoriesByGroup] = useState<CategoryIdsByGroup | null>(null);
  const [targetGroup, setTargetGroup] = useState<string | undefined>(undefined);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const { categories: fetchedCategories, loading: categoriesLoading, fetchCategories } = useCategories();
  const [isSaving, setIsSaving] = useState(false);

  const budgetGroupsWithoutBalanceGroup = useMemo(
    () => budgetGroups.slice(1),
    [budgetGroups]
  );

  const assignedCategoryIds = useMemo(
    () => new Set(Object.values(categoriesByGroup).flat()),
    [categoriesByGroup]
  );

  // Categorias sem grupo - filtra baseado no estado local categoriesByGroup
  const categories = useMemo(
    () => fetchedCategories.filter(cat => !assignedCategoryIds.has(cat.id)),
    [fetchedCategories, assignedCategoryIds]
  );

  const categoriesMap = useMemo(
    () => new Map(fetchedCategories.map(cat => [cat.id, cat])),
    [fetchedCategories]
  );

  // Inicializa os grupos abertos e categoriesByGroup quando os dados carregam
  useEffect(() => {
    if (!isOpen || !budgetGroups.length) return;

    setOpenGroups(
      budgetGroups.filter(g => (g.categories?.length ?? 0) > 0).map(g => g.id)
    );
    const initialCategories = buildCategoriesByGroup(budgetGroups);
    setCategoriesByGroup(initialCategories);
    setInitialCategoriesByGroup(cloneCategoriesByGroup(initialCategories));
  }, [budgetGroups, isOpen]);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  }, []);
  
  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const toggleGroupOpen = useCallback((id: string) => {
    setOpenGroups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const resetAssignments = useCallback(() => {
    if (!initialCategoriesByGroup) return;
    setCategoriesByGroup(cloneCategoriesByGroup(initialCategoriesByGroup));
  }, [initialCategoriesByGroup]);

  const resetTransientState = useCallback(() => {
    clearSelection();
    setTargetGroup(undefined);
    setDragOverGroup(null);
    setPulseGroup(null);
  }, [clearSelection]);

  const refreshBudgetGroups = useCallback(async () => {
    await Promise.resolve(onRefreshBudgetGroups());
  }, [onRefreshBudgetGroups]);

  const notifyGroupsChanged = useCallback(async () => {
    if (onGroupsChanged) {
      await onGroupsChanged();
    }
  }, [onGroupsChanged]);

  const handleGroupCreated = useCallback(async () => {
    await refreshBudgetGroups();
    await notifyGroupsChanged();
  }, [refreshBudgetGroups, notifyGroupsChanged]);

  const openSheet = (open: boolean) => {
    if (open) {
      // Garante que os dados estejam atualizados antes de abrir
      refreshBudgetGroups();
      fetchCategories();
    } else {
      resetAssignments();
      resetTransientState();
    }
    setIsOpen(open);
  };

  const cancelChanges = () => {
    resetAssignments();
    resetTransientState();
    setIsOpen(false);
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Converte categoriesByGroup para o formato esperado pela API
      const assignments = [];
      
      // Adiciona categorias que estão em grupos
      for (const [budgetGroupId, categoryIds] of Object.entries(categoriesByGroup)) {
        for (const categoryId of categoryIds) {
          assignments.push({ categoryId, budgetGroupId });
        }
      }
      
      // Adiciona categorias sem grupo
      for (const category of categories) {
        assignments.push({ categoryId: category.id, budgetGroupId: null });
      }
      
      // Envia as atribuições de categorias para a API
      await BudgetGroupService.updateCategoryAssignments({
        assignments
      });
      
      await Promise.all([
        refreshBudgetGroups(),
        fetchCategories()
      ]);
      await notifyGroupsChanged();

      setInitialCategoriesByGroup(cloneCategoriesByGroup(categoriesByGroup));
      clearSelection();
      setTargetGroup(undefined);
      toast.success("Alterações salvas com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  const moveIdsToGroup = useCallback((ids: string[], groupId: string) => {
    if (!ids.length) return;
    setCategoriesByGroup(prev => {
      let next = cloneCategoriesByGroup(prev);
      ids.forEach(id => { next = addCategoryToGroup(removeCategoryFromAll(next, id), groupId, id); });
      return next;
    });
    clearSelection();
  }, [clearSelection]);

  const removeFromGroup = (id: string, groupId: string) =>
    setCategoriesByGroup(prev => ({ ...prev, [groupId]: prev[groupId].filter(x => x !== id) }));

  // Drag & Drop
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverGroup = (e: React.DragEvent, gid: string) => {
    e.preventDefault();
    setDragOverGroup(gid);
  };

  const onDropToGroup = (e: React.DragEvent, gid: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId) return;

    const payload = selectedIds.includes(draggedId)
      ? selectedIds
      : [draggedId];

    moveIdsToGroup(payload, gid);
    setDragOverGroup(null);
    setPulseGroup(gid);
    setTimeout(() => setPulseGroup(null), 700);
  };

  const onDragLeaveGroup = () => setDragOverGroup(null);

  const onDropToUnassigned = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId) return;

    const idsToRemove = selectedIds.includes(draggedId) ? selectedIds : [draggedId];

    setCategoriesByGroup(prev =>
      idsToRemove.reduce((next, id) => removeCategoryFromAll(next, id), prev)
    );
    toast.success(
      idsToRemove.length > 1 ? "Categorias removidas dos grupos" : "Categoria removida do grupo"
    );
    clearSelection();
    setDragOverGroup(null);
    setPulseGroup("unassigned");
    setTimeout(() => setPulseGroup(null), 700);
  };



  return (
    <Sheet open={isOpen} onOpenChange={openSheet} >
      <SheetTrigger asChild>
        <Button>
          <ListTodo className="h-4 w-4 mr-2" />
          {labelButton}
        </Button>
      </SheetTrigger>

      <SheetContent
        hideClose={true}
        side="right"
        className="w-full sm:w-[720px] md:w-[820px] sm:max-w-[820px] p-0 h-full sm:rounded-l-lg rounded-t-lg"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between w-full">
              <SheetTitle className="text-lg font-semibold flex items-center gap-2">
                Organizar Grupos & Categorias
                {isSaving && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-muted-foreground border-t-transparent" />
                    Salvando...
                  </div>
                )}
              </SheetTitle>

              <div className="flex items-center gap-2">
                <CreateGroupDialog 
                
                  onGroupCreated={handleGroupCreated}
                  createBudgetGroup={createBudgetGroup}
                  loading={loadingCreateGroup}
                />
              </div>
            </div>
          </SheetHeader>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0">
            {/* CATEGORIAS SEM GRUPO */}
            <Card className="overflow-hidden flex flex-col h-full min-h-0">
              <ColumnHeader icon={<Tag className="h-4 w-4 text-muted-foreground" />} title="Categorias sem grupo" />

              <div
                className={[
                  "p-4 pt-3 flex-1 flex flex-col min-h-0",
                  dragOverGroup === "unassigned" ? "ring-2 ring-blue-200" : ""
                ].join(" ")}
                onDragOver={(e) => { e.preventDefault(); setDragOverGroup("unassigned"); }}
                onDrop={onDropToUnassigned}
                onDragLeave={() => setDragOverGroup(null)}
              >
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {categoriesLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-10 rounded-lg bg-muted/40 animate-pulse" />
                    ))
                  ) : (
                    categories.map(category => (
                      <CategoryCardSheet
                        key={category.id}
                        category={category}
                        selected={selectedIds.includes(category.id)}
                        onToggle={() => toggleSelected(category.id)}
                        draggable
                        onDragStart={(e) => onDragStart(e, category.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              <MoveBarSheet
                groups={budgetGroupsWithoutBalanceGroup}
                selectedCount={selectedIds.length}
                selectedGroup={targetGroup}
                onChangeGroup={setTargetGroup}
                onMove={() => targetGroup && moveIdsToGroup(selectedIds, targetGroup)}
                isSaving={isSaving}
              />
            </Card>

            {/* GRUPOS */}
            <Card className="overflow-hidden flex flex-col h-full min-h-0">
              <ColumnHeader icon={<Tag className="h-4 w-4 text-muted-foreground" />} title="Grupos" />

              <div className="p-4 pt-3 flex-1 flex flex-col min-h-0">
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {budgetGroupsWithoutBalanceGroup.map(g => (
                    <GroupCardSheet
                      key={g.id}
                      group={g}
                      count={categoriesByGroup[g.id]?.length ?? 0}
                      open={openGroups.includes(g.id)}
                      onToggle={() => toggleGroupOpen(g.id)}
                      dragState={
                        dragOverGroup === g.id ? "over" : pulseGroup === g.id ? "pulse" : null
                      }
                      onDragOver={(e) => onDragOverGroup(e, g.id)}
                      onDrop={(e) => onDropToGroup(e, g.id)}
                      onDragLeave={onDragLeaveGroup}
                    >
                      {(categoriesByGroup[g.id] ?? []).map(catId => {
                        const cat = categoriesMap.get(catId);
                        if (!cat) return null;
                        return (
                          <div
                            key={cat.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, cat.id)}
                            className="w-full flex items-center justify-between rounded-lg border px-3 py-2 bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              <span className="text-sm font-medium">{cat.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromGroup(cat.id, g.id)}
                              className="h-7 w-7 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </GroupCardSheet>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-muted/20">
            <div className="flex gap-3 w-full">
              <Button variant="ghost" onClick={cancelChanges} className="flex-1 h-10" disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={saveChanges} className="flex-1 h-10" disabled={isSaving} aria-busy={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

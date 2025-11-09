import { useMemo, useState, useCallback } from "react";
import {
  Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Tag, ChevronDown, ListTodo, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/pages/category/hooks/use-categories";

type ID = string;
type Category = { id: ID; name: string; color: string };
type Group = { id: ID; name: string; color: string };
type Assignments = Record<ID, ID[]>;

const GROUPS: Group[] = [
  { id: "g1", name: "Sem Grupo", color: "#9ca3af" },
  { id: "g2", name: "Gastos Essenciais", color: "#ef4444" },
  { id: "g3", name: "Lazer", color: "#3b82f6" },
  { id: "g4", name: "Investimentos", color: "#f59e0b" },
  { id: "g5", name: "Outros", color: "#6b7280" },
  { id: "g6", name: "Diversão", color: "#22c55e" },
  { id: "g7", name: "Saúde", color: "#14b8a6" },
  { id: "g8", name: "Educação", color: "#f97316" },
  { id: "g9", name: "Transporte", color: "#0ea5e9" },
  { id: "g10", name: "Alimentação", color: "#f59e0b" },
  { id: "g11", name: "Moradia", color: "#ef4444" },
];


const cloneAssignments = (a: Assignments): Assignments => JSON.parse(JSON.stringify(a));

const removeFromAll = (a: Assignments, id: ID): Assignments => {
  const next: Assignments = {};
  for (const [g, ids] of Object.entries(a)) next[g] = ids.filter(x => x !== id);
  return next;
};

const addToGroup = (a: Assignments, groupId: ID, id: ID): Assignments => {
  const next = cloneAssignments(a);
  next[groupId] ??= [];
  if (!next[groupId].includes(id)) next[groupId].push(id);
  return next;
};

function ColumnHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <CardHeader className="flex-row items-center justify-between border-b">
      <CardTitle className="flex items-center gap-2">
        {icon} {title}
      </CardTitle>
    </CardHeader>
  );
}

function CategoryRow({
  cat, selected, onToggle, draggable, onDragStart,
}: {
  cat: Category;
  selected: boolean;
  onToggle: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <button
      key={cat.id}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onToggle}
      className={[
        "w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left transition",
        "hover:bg-muted/50",
        selected ? "border-blue-200 bg-blue-50/50" : "border-border",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
        <span className="text-sm font-medium">{cat.name}</span>
      </div>
      {selected && <Check className="h-4 w-4 text-blue-600" />}
    </button>
  );
}

function GroupCard({
  group,
  count,
  open,
  onToggle,
  children,
  dragState,
  onDragOver,
  onDrop,
  onDragLeave,
}: {
  group: Group;
  count: number;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  dragState?: "over" | "pulse" | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}) {
  const ring = dragState === "over" ? "ring-2 ring-blue-200" : "";

  return (
    <div
      className={`rounded-xl border bg-background ${ring}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-t-xl"
        style={{ borderLeft: `4px solid ${group.color}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{group.name}</span>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t px-3 py-2 text-sm text-muted-foreground rounded-b-xl">
          {count === 0 ? (
            <div className="px-3 py-6 text-center border-dashed">
              Solte categorias aqui ou use “Mover”.
            </div>
          ) : (
            <div className="space-y-2">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}

function MoveBar({
  groups, selectedCount, selectedGroup, onChangeGroup, onMove,
}: {
  groups: Group[];
  selectedCount: number;
  selectedGroup?: ID;
  onChangeGroup: (id: ID) => void;
  onMove: () => void;
}) {
  return (
    <CardFooter className="border-t bg-background/95 py-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span className="text-xs text-muted-foreground">
        {selectedCount} selecionada{selectedCount !== 1 ? "s" : ""}
      </span>
      <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Select value={selectedGroup} onValueChange={onChangeGroup}>
          <SelectTrigger className="h-9 w-full sm:w-40">
            <SelectValue placeholder="Mover para..." />
          </SelectTrigger>
          <SelectContent>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" className="w-full sm:w-auto" disabled={!selectedCount || !selectedGroup} onClick={onMove}>
          Mover
        </Button>
      </div>
    </CardFooter>
  );
}


type ManageGroupsSheetProps = { 
  labelButton?: string; 
}

export default function ManageGroupsSheet({ labelButton }: ManageGroupsSheetProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>(GROUPS);
  const [openGroups, setOpenGroups] = useState<ID[]>(GROUPS.map(g => g.id));
  const [dragOverGroup, setDragOverGroup] = useState<ID | null>(null);
  const [pulseGroup, setPulseGroup] = useState<ID | null>(null);

  const [selectedIds, setSelectedIds] = useState<ID[]>([]);

  const toggleSelected = (id: ID) =>
    setSelectedIds(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  
  const clearSelection = () => setSelectedIds([]);

  const [assignments, setAssignments] = useState<Assignments>(
    Object.fromEntries(GROUPS.map(g => [g.id, []]))
  );

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("#3b82f6");

  const createGroup = () => {
    const name = newGroupName.trim();
    if (!name) {
      toast.error("Informe um nome para o grupo");
      return;
    }
    const id = `g${Date.now()}`;
    const g: Group = { id, name, color: newGroupColor };
    setGroups(prev => [...prev, g]);
    setAssignments(prev => ({ ...prev, [id]: [] }));
    setOpenGroups(prev => [...prev, id]);
    setNewGroupName("");
    setNewGroupColor("#3b82f6");
    toast.success(`Grupo "${name}" criado`);
  };

  const [initialAssignments, setInitialAssignments] = useState<Assignments | null>(null);

  const { categories: fetchedCategories, loading: categoriesLoading } = useCategories();

  const categories = useMemo<Category[]>(
    () => (fetchedCategories ?? []).map(category => ({ id: category.id, name: category.name, color: (category as any).color ?? "#6b7280" })),
    [fetchedCategories]
  );

  const assignedSet = useMemo(
    () => new Set(Object.values(assignments).flat()),
    [assignments]
  );

  const unassigned = useMemo(
    () => categories.filter(c => !assignedSet.has(c.id)),
    [assignedSet, categories]
  );

  const openSheet = (open: boolean) => {
    if (open) setInitialAssignments(cloneAssignments(assignments));
    setIsOpen(open);
  };

  const cancelChanges = () => {
    if (initialAssignments) setAssignments(cloneAssignments(initialAssignments));
    clearSelection();
    setIsOpen(false);
  };

  const saveChanges = () => {
    setInitialAssignments(cloneAssignments(assignments));
    clearSelection();
    setIsOpen(false);
    toast.success("Alterações salvas");
  };

  const moveIdsToGroup = useCallback((ids: ID[], groupId: ID) => {
    if (!ids.length) return;
    setAssignments(prev => {
      let next = cloneAssignments(prev);
      ids.forEach(id => { next = addToGroup(removeFromAll(next, id), groupId, id); });
      return next;
    });
  const gname = groups.find(g => g.id === groupId)?.name ?? "grupo";
    toast.success(`${ids.length} categoria${ids.length > 1 ? "s" : ""} movida${ids.length > 1 ? "s" : ""} para ${gname}`);
    clearSelection();
  }, []);

  const removeFromGroup = (id: ID, groupId: ID) =>
    setAssignments(prev => ({ ...prev, [groupId]: prev[groupId].filter(x => x !== id) }));

  // Drag & Drop
  const onDragStart = (e: React.DragEvent, id: ID) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOverGroup = (e: React.DragEvent, gid: ID) => {
    e.preventDefault();
    setDragOverGroup(gid);
  };
  const onDropToGroup = (e: React.DragEvent, gid: ID) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    moveIdsToGroup([id], gid);
    setDragOverGroup(null);
    setPulseGroup(gid);
    setTimeout(() => setPulseGroup(null), 700);
  };
  const onDragLeaveGroup = () => setDragOverGroup(null);

  const onDropToUnassigned = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    setAssignments(prev => removeFromAll(prev, id));
    toast.success("Categoria removida do grupo");
    setPulseGroup("unassigned");
    setTimeout(() => setPulseGroup(null), 700);
  };

  const [targetGroup, setTargetGroup] = useState<ID | undefined>(undefined);

  const toggleGroupOpen = (gid: ID) =>
    setOpenGroups(list => (list.includes(gid) ? list.filter(x => x !== gid) : [...list, gid]));

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
              <SheetTitle className="text-lg font-semibold">Organizar Grupos & Categorias</SheetTitle>

              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Novo grupo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar novo grupo</DialogTitle>
                      <DialogDescription>Informe um nome e escolha uma cor para o grupo.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2 py-4">
                      <Label htmlFor="group-name">Nome</Label>
                      <Input id="group-name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />

                      <Label htmlFor="group-color">Cor</Label>
                      <div className="flex items-center gap-2">
                        <input id="group-color" type="color" value={newGroupColor} onChange={(e) => setNewGroupColor(e.target.value)} className="h-8 w-10 p-0 rounded-md border" />
                        <Input value={newGroupColor} onChange={(e) => setNewGroupColor(e.target.value)} />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancelar</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={createGroup}>Criar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    unassigned.map(cat => (
                      <CategoryRow
                        key={cat.id}
                        cat={cat}
                        selected={selectedIds.includes(cat.id)}
                        onToggle={() => toggleSelected(cat.id)}
                        draggable
                        onDragStart={(e) => onDragStart(e, cat.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              <MoveBar
                groups={groups}
                selectedCount={selectedIds.length}
                selectedGroup={targetGroup}
                onChangeGroup={setTargetGroup}
                onMove={() => targetGroup && moveIdsToGroup(selectedIds, targetGroup)}
              />
            </Card>

            {/* GRUPOS */}
            <Card className="overflow-hidden flex flex-col h-full min-h-0">
              <ColumnHeader icon={<Tag className="h-4 w-4 text-muted-foreground" />} title="Grupos" />

              <div className="p-4 pt-3 flex-1 flex flex-col min-h-0">
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {groups.map(g => (
                    <GroupCard
                      key={g.id}
                      group={g}
                      count={assignments[g.id]?.length ?? 0}
                      open={openGroups.includes(g.id)}
                      onToggle={() => toggleGroupOpen(g.id)}
                      dragState={
                        dragOverGroup === g.id ? "over" : pulseGroup === g.id ? "pulse" : null
                      }
                      onDragOver={(e) => onDragOverGroup(e, g.id)}
                      onDrop={(e) => onDropToGroup(e, g.id)}
                      onDragLeave={onDragLeaveGroup}
                    >
                      {(assignments[g.id] ?? []).map(catId => {
                        const cat = categories.find(c => c.id === catId)!;
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
                    </GroupCard>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-muted/20">
            <div className="flex gap-3 w-full">
              <Button variant="ghost" onClick={cancelChanges} className="flex-1 h-10">
                Cancelar
              </Button>
              <Button onClick={saveChanges} className="flex-1 h-10">
                Salvar
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

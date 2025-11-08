import { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// removed Input import (not used in this layout)
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
// using native overflow for scroll areas
import { Check, Tag, ChevronDown, ListTodo, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const mockCategories = [
  { id: "1", name: "Viagem", color: "#3b82f6" },
  { id: "2", name: "Vestuário", color: "#ef4444" },
  { id: "3", name: "Transporte", color: "#0ea5e9" },
  { id: "4", name: "Supermercado", color: "#f59e0b" },
  { id: "5", name: "Streaming", color: "#8b5cf6" },
  { id: "6", name: "Restaurantes", color: "#10b981" },
  { id: "7", name: "Educação", color: "#f97316" },
  { id: "8", name: "Saúde", color: "#14b8a6" },
  { id: "9", name: "Academia", color: "#6366f1" },
  { id: "10", name: "Pets", color: "#ec4899" },
  { id: "11", name: "Hobbies", color: "#22c55e" },
  { id: "12", name: "Doações", color: "#f43f5e" },
  { id: "13", name: "Impostos", color: "#eab308" },
  { id: "14", name: "Cuidados Pessoais", color: "#3b82f6" },
  { id: "15", name: "Presentes", color: "#f97316" },
  { id: "16", name: "Eventos", color: "#8b5cf6" },
  { id: "17", name: "Transações Bancárias", color: "#0ea5e9" },
  { id: "18", name: "Assinaturas", color: "#10b981" },
  { id: "19", name: "Combustível", color: "#f59e0b" },
  { id: "20", name: "Outros", color: "#6b7280" },
  { id: "g1", name: "Sem Grupo", color: "#9ca3af" },
  { id: "g2", name: "Gastos Essenciais", color: "#ef4444" },
  { id: "g3", name: "Lazer", color: "#3b82f6" },
  { id: "g4", name: "Investimentos", color: "#f59e0b" },

];

const mockGroups = [
  { id: "g1", name: "Sem Grupo", color: "#9ca3af" },
  { id: "g2", name: "Gastos Essenciais", color: "#ef4444" },
  { id: "g3", name: "Lazer", color: "#3b82f6" },
  { id: "g4", name: "Investimentos", color: "#f59e0b" },
  { id: "g5", name: "Outros", color: "#6b7280" },
  { id: "g6", name: "Gastos Essenciais", color: "#ef4444" },
  { id: "g7", name: "Lazer", color: "#3b82f6" },
  { id: "g8", name: "Investimentos", color: "#f59e0b" },
  { id: "g9", name: "Outros", color: "#6b7280" },
  { id: "g10", name: "Diversão", color: "#22c55e" },
  { id: "g11", name: "Saúde", color: "#14b8a6" },
  { id: "g12", name: "Educação", color: "#f97316" },
  { id: "g13", name: "Transporte", color: "#0ea5e9" },
  { id: "g14", name: "Alimentação", color: "#f59e0b" },
  { id: "g15", name: "Moradia", color: "#ef4444" },
];

export interface ManageGroupsSheetProps {
  labelButton?: string;
}

export const ManageGroupsSheet: React.FC<ManageGroupsSheetProps> = ({ labelButton = "Organizar" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [openGroups, setOpenGroups] = useState<string[]>(mockGroups.map((g) => g.id));
  const [assignments, setAssignments] = useState<Record<string, string[]>>(Object.fromEntries(
    mockGroups.map((g) => [g.id, [] as string[]])
  ));
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const unassignedCategories = mockCategories.filter(
    (c) => /^[0-9]+$/.test(c.id) && !Object.values(assignments).flat().includes(c.id)
  );

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    e.dataTransfer.setData("text/plain", categoryId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(groupId);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (_e: React.DragEvent) => setDragOverGroup(null);

  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    const categoryId = e.dataTransfer.getData("text/plain");
    if (!categoryId) return;

    setAssignments((prev) => {
      // remove from any other group
      const cleaned = Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, v.filter((id) => id !== categoryId)])
      ) as Record<string, string[]>;

      if (!cleaned[groupId].includes(categoryId)) {
        cleaned[groupId] = [...cleaned[groupId], categoryId];
      }
      return cleaned;
    });

    setSelected((prev) => prev.filter((id) => id !== categoryId));
    setDragOverGroup(null);
    // short visual feedback
    setLastDroppedGroup(groupId);
    window.setTimeout(() => setLastDroppedGroup(null), 700);

    const cat = mockCategories.find((m) => m.id === categoryId);
    const group = mockGroups.find((g) => g.id === groupId);
    const catName = cat?.name ?? "Categoria";
    const groupName = group?.name ?? "grupo";
    toast.success(`${catName} adicionada a ${groupName}`);
  };

  const [lastDroppedGroup, setLastDroppedGroup] = useState<string | null>(null);

  const handleDropToUnassigned = (e: React.DragEvent) => {
    e.preventDefault();
    const categoryId = e.dataTransfer.getData("text/plain");
    if (!categoryId) return;

    setAssignments((prev) => {
      const cleaned = Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, v.filter((id) => id !== categoryId)])
      ) as Record<string, string[]>;
      return cleaned;
    });

    setSelected((prev) => prev.filter((id) => id !== categoryId));
    setDragOverGroup(null);
    // visual feedback when returned to unassigned
    setLastDroppedGroup("unassigned");
    window.setTimeout(() => setLastDroppedGroup(null), 700);

    const cat = mockCategories.find((m) => m.id === categoryId);
    const catName = cat?.name ?? "Categoria";
    toast.success(`${catName} removida do grupo`);
  };

  const handleRemoveFromGroup = (categoryId: string, groupId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [groupId]: prev[groupId].filter((id) => id !== categoryId),
    }));
    toast.success("Categoria removida do grupo");
  };

  const handleMoveSelected = () => {
    if (!selectedGroup) return;
    const toMove = selected;
    if (!toMove.length) return;

    setAssignments((prev) => {
      const cleaned = Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, v.filter((id) => !toMove.includes(id))])
      ) as Record<string, string[]>;
      cleaned[selectedGroup] = [...(cleaned[selectedGroup] || []), ...toMove.filter((id) => !cleaned[selectedGroup].includes(id))];
      return cleaned;
    });

    const groupName = mockGroups.find((g) => g.id === selectedGroup)?.name || "grupo";
    toast.success(`${toMove.length} categoria${toMove.length > 1 ? "s" : ""} movida${toMove.length > 1 ? "s" : ""} para ${groupName}`);
    setSelected([]);
    setSelectedGroup(undefined);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <ListTodo className="h-4 w-4 mr-2" />
          {labelButton}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[720px] sm:w-[820px] sm:max-w-[820px] p-0 h-full">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-lg font-semibold">Organizar Grupos & Categorias</SheetTitle>
          </SheetHeader>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Coluna de categorias */}
            <Card className="overflow-hidden flex flex-col h-full min-h-0">
              <CardHeader className="flex-row items-center justify-between border-b">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Categorias sem grupo
                </CardTitle>
              </CardHeader>

              {/* Lista de categorias ocupa toda a altura entre header e footer */}
              <div
                className={`p-4 pt-3 flex-1 flex flex-col min-h-0 ${dragOverGroup === "unassigned" ? "ring-2 ring-blue-200" : ""} ${lastDroppedGroup === "unassigned" ? "bg-green-50" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverGroup("unassigned");
                }}
                onDrop={handleDropToUnassigned}
                onDragLeave={() => setDragOverGroup(null)}
              >
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {unassignedCategories.map((c) => {
                    const isSelected = selected.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                        onClick={() =>
                          setSelected((prev) =>
                            prev.includes(c.id)
                              ? prev.filter((id) => id !== c.id)
                              : [...prev, c.id]
                          )
                        }
                        className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left transition hover:bg-muted/50 ${isSelected ? "border-blue-200 bg-blue-50/50" : "border-border"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                      </button>
                    );
                  })}
                  </div>
                </div>

              <CardFooter className="border-t bg-background/95 py-3 flex items-center justify-between px-4">
                <span className="text-xs text-muted-foreground">
                  {selected.length} selecionada{selected.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="h-9 w-40">
                      <SelectValue placeholder="Mover para..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGroups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                            {g.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" disabled={!selected.length || !selectedGroup} onClick={handleMoveSelected}>Mover</Button>
                </div>
              </CardFooter>
            </Card>

            {/* Coluna de grupos */}
            <Card className="overflow-hidden flex flex-col h-full min-h-0">
              <CardHeader className="flex-row items-center justify-between border-b">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Grupos
                </CardTitle>
              </CardHeader>
              <div className="p-4 pt-3 flex-1 flex flex-col min-h-0">
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {mockGroups.map((g) => (
                    <div
                      key={g.id}
                      className={`rounded-xl border bg-background ${dragOverGroup === g.id ? "ring-2 ring-blue-200" : ""} ${lastDroppedGroup === g.id ? "bg-green-50" : ""}`}
                      onDragOver={(e) => handleDragOver(e, g.id)}
                      onDrop={(e) => handleDrop(e, g.id)}
                      onDragLeave={handleDragLeave}
                    >
                      <button
                        onClick={() => toggleGroup(g.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-t-xl"
                        style={{ borderLeft: `4px solid ${g.color}` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{g.name}</span>
                          <Badge variant="secondary">{assignments[g.id]?.length ?? 0}</Badge>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.includes(g.id) ? "rotate-180" : ""}`} />
                      </button>
                      {openGroups.includes(g.id) && (
                        <div className="border-t px-3 py-2 text-sm text-muted-foreground rounded-b-xl">
                          {assignments[g.id] && assignments[g.id].length > 0 ? (
                            <div className="space-y-2">
                              {assignments[g.id].map((catId) => {
                                const cat = mockCategories.find((m) => m.id === catId);
                                if (!cat) return null;
                                return (
                                  <div
                                    key={cat.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, cat.id)}
                                    className="w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left bg-white"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                      <span className="text-sm font-medium">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFromGroup(cat.id, g.id)}
                                        className="h-7 w-7 p-0"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="px-3 py-6 text-center text-sm text-muted-foreground border-dashed">
                              Solte categorias aqui ou use “Mover”.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ManageGroupsSheet;
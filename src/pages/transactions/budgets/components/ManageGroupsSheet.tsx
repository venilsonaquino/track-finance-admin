"use client";
import { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check, Search, Tag, ChevronDown, ListTodo } from "lucide-react";
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
  { id: "g2", name: "Gastos Essenciais", color: "#ef4444" },
  { id: "g3", name: "Lazer", color: "#3b82f6" },
  { id: "g4", name: "Investimentos", color: "#f59e0b" },
];

export interface ManageGroupsSheetProps {
  labelButton?: string;
}

export const ManageGroupsSheet: React.FC<ManageGroupsSheetProps> = ({ labelButton = "Organizar" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [openGroups, setOpenGroups] = useState<string[]>(mockGroups.map((g) => g.id));
  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

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
              <div className="relative w-56">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar categoria..." className="h-9 pl-8" />
              </div>
            </CardHeader>

            {/* Lista de categorias ocupa toda a altura entre header e footer */}
            <div className="p-4 pt-3 flex-1 flex flex-col min-h-0">
              <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                {mockCategories.map((c) => {
                  const isSelected = selected.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() =>
                        setSelected((prev) =>
                          prev.includes(c.id)
                            ? prev.filter((id) => id !== c.id)
                            : [...prev, c.id]
                        )
                      }
                      className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left transition hover:bg-muted/50 ${
                        isSelected ? "border-blue-200 bg-blue-50/50" : "border-border"
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
                <Button size="sm" disabled={!selected.length || !selectedGroup}>Mover</Button>
              </div>
            </CardFooter>
          </Card>

          {/* Coluna de grupos */}
          <Card className="overflow-hidden flex flex-col h-full min-h-0">
            <CardHeader className="border-b">
              <CardTitle className="text-sm">Grupos</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {mockGroups.map((g) => (
                  <div key={g.id} className="rounded-xl border bg-background">
                    <button
                      onClick={() => toggleGroup(g.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-t-xl"
                      style={{ borderLeft: `4px solid ${g.color}` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{g.name}</span>
                        <Badge variant="secondary">0</Badge>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.includes(g.id) ? "rotate-180" : ""}`} />
                    </button>
                    {openGroups.includes(g.id) && (
                      <div className="border-t px-3 py-4 text-sm text-muted-foreground flex items-center justify-center h-16 rounded-b-xl border-dashed">
                        Solte categorias aqui ou use “Mover”.
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ManageGroupsSheet;
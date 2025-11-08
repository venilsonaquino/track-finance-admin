import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListTodo, X, Tag, Check, Plus, Search } from "lucide-react";
import { useCategories } from "../../hooks/use-categories";
import { DateUtils } from "@/utils/date-utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ManageGroupsSheet {
    labelButton: string;
}

export const ManageGroupsSheet: React.FC<ManageGroupsSheet> = ({ labelButton }: ManageGroupsSheet) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  
  // Definir datas padrão do mês atual
  const defaultDates = DateUtils.getMonthStartAndEnd(new Date());
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#3b82f6");
  const [categorySearch, setCategorySearch] = useState("");
  const [groups, setGroups] = useState<Array<{ id: string; name: string; color?: string }>>([
    { id: "grp-1", name: "Receitas", color: "#22c55e" },
    { id: "grp-2", name: "Gastos Essenciais", color: "#ef4444" },
    { id: "grp-3", name: "Lazer", color: "#3b82f6" },
    { id: "grp-4", name: "Investimentos", color: "#f59e0b" },
    { id: "grp-5", name: "Outros", color: "#8b5cf6" },
  ]);

  const [assignments, setAssignments] = useState<Record<string,string[]>>({});
  const [selectedGroupForMove, setSelectedGroupForMove] = useState<string | undefined>(undefined);

  const handleAssignCategoriesToGroup = (groupId: string) => {
    if (selectedCategories.length === 0) return;
    setAssignments(prev => {
      const current = new Set(prev[groupId] ?? []);
      selectedCategories.forEach(id => current.add(id));
      return { ...prev, [groupId]: Array.from(current) };
    });
    const groupNameMsg = groups.find(g => g.id === groupId)?.name ?? 'grupo';
    toast.success(`✅ ${selectedCategories.length} categoria${selectedCategories.length>1?'s':''} adicionada${selectedCategories.length>1?'s':''} ao grupo ${groupNameMsg}`);
    setSelectedCategories([]);
    setSelectedGroupForMove(groupId);
  };

  const handleClearFilters = () => {
    setStartDate(defaultDates.startDate);
    setEndDate(defaultDates.endDate);
    setSelectedCategories([]);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const hasActiveFilters = startDate || endDate || selectedCategories.length > 0;
  const assignedSet = new Set(Object.values(assignments).flat());
  const ungroupedCategories = categories.filter(c => !assignedSet.has(c.id));

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      // TODO: Implementar lógica para criar grupo no backend
      const newGroup = { id: String(Date.now()), name: groupName.trim(), color: groupColor };
      setGroups((prev) => [...prev, newGroup]);
      console.log("Criando grupo:", newGroup);
      setGroupName("");
      setGroupColor("#3b82f6");
      setIsPopoverOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <ListTodo className="h-4 w-4 mr-2" />
          {labelButton}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[720px] sm:w-[820px] sm:max-w-[820px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
<SheetHeader className="px-6 py-4 border-b">
  <div className="flex items-center justify-between">
    <div>
      <SheetTitle className="text-base font-semibold tracking-tight">
        Organizar Grupos & Categorias
      </SheetTitle>
      <p className="text-sm text-muted-foreground">
        Crie grupos e atribua categorias para organizar seu orçamento.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => setIsPopoverOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Novo grupo
      </Button>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
        Fechar
      </Button>
    </div>
  </div>
</SheetHeader>

          {/* Content: two columns layout */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna: Categorias sem grupo */}
              <Card>
                <CardHeader className="flex-row items-center justify-between border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Categorias sem grupo
                    {selectedCategories.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-2">{selectedCategories.length} selecionada{selectedCategories.length>1?'s':''}</span>
                    )}
                  </CardTitle>
                  <div className="w-56 relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Buscar categoria..."
                      className="h-9 pl-8"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">Carregando categorias...</div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {ungroupedCategories
                        .filter(c => c.name.toLowerCase().includes(categorySearch.trim().toLowerCase()))
                        .map(c => {
                          const isSelected = selectedCategories.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              onClick={() => handleCategoryToggle(c.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition hover:bg-muted/50 ${isSelected ? 'border-blue-200 bg-blue-50/50' : 'border-border hover:border-border/60'}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`h-3 w-3 rounded-full ${isSelected?'ring-2 ring-blue-500 ring-offset-2':''}`} style={{backgroundColor:c.color}} />
                                <span className={`text-sm font-medium ${isSelected?'text-blue-700':'text-foreground'}`}>{c.name}</span>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
<CardFooter className="border-t mt-4 pt-3 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
  <div className="flex items-center justify-between w-full gap-2">
    <span className="text-xs text-muted-foreground">
      {selectedCategories.length} selecionada{selectedCategories.length !== 1 ? "s" : ""}
    </span>

    <div className="flex items-center gap-2">
      <Select value={selectedGroupForMove} onValueChange={setSelectedGroupForMove}>
        <SelectTrigger className="h-9 w-44">
          <SelectValue placeholder="Mover para..." />
        </SelectTrigger>
        <SelectContent>
          {groups.map(g => (
            <SelectItem key={g.id} value={g.id}>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                {g.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        disabled={!selectedCategories.length || !selectedGroupForMove}
        onClick={() => selectedGroupForMove && handleAssignCategoriesToGroup(selectedGroupForMove)}
      >
        Mover
      </Button>
    </div>
  </div>
</CardFooter>
              </Card>

              {/* Coluna: Grupos */}
              <div className="space-y-4">
                {groups.map(g => {
                  const ids = assignments[g.id] ?? [];
                  const cats = categories.filter(c => ids.includes(c.id));
                  return (
<Card key={g.id} className="overflow-hidden">
  <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2"
       style={{ borderLeft: `4px solid ${g.color}` }}>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{g.name}</span>
      <Badge
        variant="secondary"
        className={ids.length ? "animate-[pulse_0.8s_ease-out]" : ""}
      >
        {ids.length}
      </Badge>
    </div>
    {/* menu ... aqui depois para renomear/excluir */}
  </div>

  <CardContent className="pt-3">
    {cats.length === 0 ? (
      <div className="flex items-center justify-center text-sm text-muted-foreground h-16 rounded-md border border-dashed">
        Solte categorias aqui ou use “Mover”.
      </div>
    ) : (
      <ul className="space-y-2">
        {cats.map(cat => (
          <li key={cat.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm">{cat.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setAssignments(prev => ({ ...prev, [g.id]: prev[g.id].filter(id => id !== cat.id) }))
              }
            >
              Remover
            </Button>
          </li>
        ))}
      </ul>
    )}
  </CardContent>
</Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="px-6 py-4 border-t bg-muted/20">
            <div className="flex gap-3 w-full">
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="flex-1 h-10"
                disabled={!hasActiveFilters}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => setIsOpen(false)} 
                className="flex-1 h-10"
                disabled={!hasActiveFilters}
              >
                Salvar
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
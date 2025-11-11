import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useBudgetGroups } from "../../hooks/use-budget-group";
import { BudgetGroupRequest } from "@/api/services/budgetGroupService";

type CreateGroupDialogProps = {
  onGroupCreated?: () => void;
  createBudgetGroup?: (data: BudgetGroupRequest) => Promise<void>;
  loading?: boolean;
};

export default function CreateGroupDialog({ onGroupCreated, createBudgetGroup: propCreateBudgetGroup, loading: propLoading }: CreateGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("#ffffff");
  
  const { createBudgetGroup: hookCreateBudgetGroup, loading: hookLoading } = useBudgetGroups();
  const createBudgetGroup = propCreateBudgetGroup || hookCreateBudgetGroup;
  const loading = propLoading !== undefined ? propLoading : hookLoading;

  const handleCreateGroup = async () => {
    const name = groupName.trim();
    if (!name) {
      toast.error("Informe um nome para o grupo");
      return;
    }

    try {
      await createBudgetGroup({
        title: name,
        color: groupColor,
        kind: "editable",
        footerLabel: "Total"
      });

      toast.success(`Grupo "${name}" criado com sucesso!`);
      setGroupName("");
      setGroupColor("#3b82f6");
      setIsOpen(false);
      
      // Callback para atualizar a lista de grupos
      onGroupCreated?.();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      toast.error("Erro ao criar grupo");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">Nome</Label>
            <Input 
              id="group-name" 
              value={groupName} 
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Despesas fixas"
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="group-color">Cor</Label>
            <div className="flex items-center gap-2">
              <input 
                id="group-color" 
                type="color" 
                value={groupColor} 
                onChange={(e) => setGroupColor(e.target.value)} 
                className="h-10 w-14 p-1 rounded-md border cursor-pointer"
                disabled={loading}
              />
              <Input 
                value={groupColor} 
                onChange={(e) => setGroupColor(e.target.value)}
                placeholder="#3b82f6"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleCreateGroup} disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

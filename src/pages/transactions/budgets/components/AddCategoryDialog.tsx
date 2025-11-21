import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BudgetGroupService } from "@/api/services/budgetGroupService";
import { useCategories } from "@/pages/category/hooks/use-categories";

type AddCategoryDialogProps = {
  open: boolean;
  targetSection: { id: string; title: string } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void | Promise<void>;
};

export default function AddCategoryDialog({
  open,
  targetSection,
  onOpenChange,
  onSuccess,
}: AddCategoryDialogProps) {
  const { categories, loading: loadingCategories, fetchCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
      setSelectedCategoryId("");
    }
  }, [open, fetchCategories]);

  const availableCategories = useMemo(
    () => categories.filter((category) => !category.budgetGroupId),
    [categories]
  );

  const handleAddCategory = async () => {
    if (!targetSection?.id) {
      toast.error("Selecione um grupo válido.");
      return;
    }

    if (!selectedCategoryId) {
      toast.error("Escolha uma categoria para adicionar.");
      return;
    }

    try {
      setSaving(true);

      const assignments = categories.map((category) => ({
        categoryId: category.id,
        budgetGroupId: category.id === selectedCategoryId
          ? targetSection.id
          : (category.budgetGroupId ?? null),
      }));

      await BudgetGroupService.updateCategoryAssignments({ assignments });
      toast.success("Categoria adicionada ao grupo.");
      await fetchCategories();
      await onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao adicionar categoria ao grupo:", error);
      toast.error("Não foi possível adicionar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar categoria</DialogTitle>
          <DialogDescription>
            Selecione uma categoria sem grupo para adicionar em &quot;{targetSection?.title ?? "Grupo"}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              disabled={saving || loadingCategories || !availableCategories.length}
            >
              <SelectTrigger className="w-full justify-between" aria-label="Selecionar categoria">
                <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione uma categoria"} />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loadingCategories && !availableCategories.length && (
              <p className="text-sm text-muted-foreground">
                Todas as categorias já estão em grupos. Crie uma nova categoria ou libere alguma em &quot;Organizar Grupos&quot;.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleAddCategory} disabled={saving || !availableCategories.length}>
            {saving ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

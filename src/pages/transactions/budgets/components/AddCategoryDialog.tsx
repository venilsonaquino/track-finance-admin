import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BudgetGroupService } from "@/api/services/budgetGroupService";
import { useCategories } from "@/pages/category/hooks/use-categories";

type AddCategoryDialogProps = {
  open: boolean;
  targetSection: { id: string; title: string } | null;
  onOpenChange: (next: boolean) => void;
  onSuccess?: () => void | Promise<void>;
};

export default function AddCategoryDialog({
  open,
  targetSection,
  onOpenChange,
  onSuccess,
}: AddCategoryDialogProps) {
  const hasWindow = typeof window !== "undefined";
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

  const dialogContent = useMemo(() => {
    if (!open || !hasWindow) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm
               data-[state=open]:animate-in data-[state=closed]:animate-out
               data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          onClick={() => onOpenChange(false)}
          data-state="open"
        />

        <div
          className="fixed z-50 grid w-[min(92vw,440px)] gap-4 rounded-lg border bg-background p-6 shadow-lg
               data-[state=open]:animate-in data-[state=closed]:animate-out
               data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
               data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          role="dialog"
          aria-modal="true"
          data-state="open"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Adicionar categoria
            </h2>

            <button
              type="button"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground
                   hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2
                   focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            Selecione uma categoria sem grupo para adicionar em &quot;{targetSection?.title ?? "Grupo"}&quot;.
          </p>

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

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleAddCategory} disabled={saving || !availableCategories.length}>
              {saving ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [open, hasWindow, onOpenChange, saving, availableCategories, loadingCategories, selectedCategoryId, categories, targetSection?.title, fetchCategories, onSuccess, handleAddCategory]);

  return dialogContent;
}

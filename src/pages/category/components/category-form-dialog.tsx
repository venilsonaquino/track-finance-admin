import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";
import { CategoryRequest } from "@/api/dtos/category/category-request";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CategoryRequest;
  onSubmit: (data: CategoryRequest) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>
        <CategoryForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
} 
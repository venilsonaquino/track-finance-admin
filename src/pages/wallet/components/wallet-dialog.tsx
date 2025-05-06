import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletRequest } from "@/api/dtos/wallet/wallet-request";
import { WalletForm } from "./wallet-form";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<WalletResponse>;
  onSubmit: (data: WalletRequest) => void;
  onInputChange: (field: string | number | symbol, value: string | number) => void;
  isEditing: boolean;
}

export function WalletDialog({
  open,
  onOpenChange,
  formData,
  onSubmit,
  onInputChange,
  isEditing,
}: WalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Carteira" : "Nova Carteira"}</DialogTitle>
        </DialogHeader>
        <WalletForm
          initialData={formData as WalletRequest}
          onSubmit={onSubmit}
          onInputChange={onInputChange}
        />
      </DialogContent>
    </Dialog>
  );
} 
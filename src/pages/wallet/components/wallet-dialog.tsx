import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletForm } from "./wallet-form";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
interface WalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<WalletResponse>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (field: keyof WalletResponse, value: string | number) => void;
  isEditing: boolean;
}

export const WalletDialog = ({
  isOpen,
  onOpenChange,
  formData,
  onSubmit,
  onInputChange,
  isEditing,
}: WalletDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Nova Carteira</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Carteira" : "Nova Carteira"}
          </DialogTitle>
        </DialogHeader>
        <WalletForm
          formData={formData}
          onSubmit={onSubmit}
          onInputChange={onInputChange}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}; 
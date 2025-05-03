import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletForm } from "./wallet-form";
import { Wallet } from "@/types/wallet";

interface WalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Wallet>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (field: keyof Wallet, value: string | number) => void;
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
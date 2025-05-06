import { Button } from "@/components/ui/button";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface ReviewHeaderProps {
  onCancel: () => void;
  onSaveAll: () => void;
  wallets: WalletResponse[];
  onApplyWalletToAll: (walletId: string) => void;
  onRemoveProcessed: () => void;
}

export const ReviewHeader = ({ 
  onCancel, 
  onSaveAll, 
  wallets, 
  onApplyWalletToAll,
  onRemoveProcessed 
}: ReviewHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <PageBreadcrumbNav title="Revisar Transações" />
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center gap-4">
          <p className="text-muted-foreground">
            Revise e configure suas transações importadas
          </p>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(true)}
              className="shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={onSaveAll}>
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opções de Importação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Carteira para novas transações
              </label>
              <Select onValueChange={(value) => {
                onApplyWalletToAll(value);
                setIsFilterOpen(false);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id as string}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                A carteira será aplicada apenas às transações novas não processadas
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => {
                  onRemoveProcessed();
                  setIsFilterOpen(false);
                }}
                className="w-full justify-start h-auto py-2"
              >
                <div>
                  <p className="font-medium">Remover transações processadas</p>
                  <p className="text-sm text-muted-foreground text-left">
                    Remove da lista as transações que já foram importadas anteriormente
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 
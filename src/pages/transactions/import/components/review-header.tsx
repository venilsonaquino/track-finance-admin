import { Button } from "@/components/ui/button";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { Wallet } from "lucide-react";

interface ReviewHeaderProps {
  onCancel: () => void;
  onSaveAll: () => void;
  wallets: WalletResponse[];
  onApplyWalletToAll: (walletId: string) => void;
}

export const ReviewHeader = ({ onCancel, onSaveAll, wallets, onApplyWalletToAll }: ReviewHeaderProps) => {
  return (
    <>
      <PageBreadcrumbNav title="Revisar Transações" />
      <div className="container mx-auto py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Revisar Transações</h1>
            <p className="text-muted-foreground mt-1">
              Revise e configure suas transações importadas
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial w-[280px]">
              <Select onValueChange={onApplyWalletToAll}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 shrink-0" />
                    <SelectValue placeholder="Aplicar carteira às novas transações" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id as string}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={onSaveAll}>
                Salvar Todas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 
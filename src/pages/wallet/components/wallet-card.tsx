import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Wallet } from "lucide-react";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { getBankById } from "@/utils/banks";
import { BankLogo } from "@/components/bank-logo";

interface WalletCardProps {
  wallet: WalletResponse;
  onEdit: (wallet: WalletResponse) => void;
  onDelete: (id: string) => void;
}

export const WalletCard = ({ wallet, onEdit, onDelete }: WalletCardProps) => {
  const balanceValue = Number(wallet.balance ?? 0);
  const formattedBalance = balanceValue.toFixed(2);
  const bank = wallet.bankId ? getBankById(wallet.bankId) : null;

  return (
    <Card style={{ backgroundColor: wallet.color + "20" }}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BankLogo 
              bankId={wallet.bankId} 
              size="lg" 
              fallbackIcon={<Wallet className="w-8 h-8" />}
            />
            <CardTitle>{wallet.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(wallet)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(wallet.id || '')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{wallet.description}</p>
        <div className="flex justify-between text-sm">
          <span>Tipo: {wallet.walletType}</span>
          <span>Saldo: R$ {formattedBalance}</span>
        </div>
        {bank && (
          <div className="mt-2 text-xs text-gray-500">
            Banco: {bank.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
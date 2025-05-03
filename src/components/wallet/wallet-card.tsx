import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Wallet } from "@/types/wallet";

interface WalletCardProps {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: string) => void;
}

export const WalletCard = ({ wallet, onEdit, onDelete }: WalletCardProps) => {
  return (
    <Card style={{ backgroundColor: wallet.color + "20" }}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{wallet.name}</CardTitle>
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
              onClick={() => onDelete(wallet.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{wallet.description}</p>
        <div className="flex justify-between text-sm">
          <span>Tipo: {wallet.type}</span>
          <span>Saldo: R$ {wallet.initialBalance.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}; 
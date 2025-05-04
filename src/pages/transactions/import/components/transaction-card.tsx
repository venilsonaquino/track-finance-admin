import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Save } from "lucide-react";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { formatCurrency } from "@/utils/currency-utils";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { CategoryResponse } from "@/api/dtos/category/category-response";
import { Button } from "@/components/ui/button";

interface TransactionCardProps {
  transaction: TransactionResponse;
  wallets: WalletResponse[];
  categories: CategoryResponse[];
}

export const TransactionCard = ({
  transaction,
  wallets,
  categories,
}: TransactionCardProps) => {

  const isNegative = Number(transaction.amount) < 0;
  const isDuplicate = transaction.isFitIdAlreadyExists;

  const amountTextColor = isNegative
  ? isDuplicate
    ? "text-destructive/70"
    : "text-destructive"
  : isDuplicate
  ? "text-emerald-500/70"
  : "text-emerald-500";


  return (
    <Card
      className={`p-4 transition-all ${
        transaction.isFitIdAlreadyExists
          ? "bg-muted border-muted-foreground/20"
          : "hover:shadow-md"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 group w-full">
              <Input
                type="text"
                value={transaction.description}
                disabled={transaction.isFitIdAlreadyExists}
                className={`font-medium ${
                  transaction.isFitIdAlreadyExists ? "bg-transparent border-none p-0 text-muted-foreground" : ""
                }`}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{new Date(transaction.depositedDate).toLocaleDateString("pt-BR")}</span>
            <span>•</span>
            <span>{transaction.bankName}</span>
            {transaction.isRecurring && (
              <>
                <span>•</span>
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                  Fixo
                </span>
              </>
            )}
            {transaction.isInstallment && (
              <>
                <span>•</span>
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                  Parcelado
                </span>
              </>
            )}
          </div>
        </div>
        <p className={`text-lg font-semibold whitespace-nowrap ${amountTextColor}`}>
          {formatCurrency(Number(transaction.amount))}
        </p>
      </div>

      <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] items-end gap-4">
        {/* Wallet Select */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Carteira
          </label>
          <Select defaultValue={transaction.wallet?.id ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id!}>
                  {wallet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Categoria
          </label>
          <Select defaultValue={transaction.category?.id ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão de salvar ou outro campo pode vir aqui */}
        <Button variant="outline">
          <Save className="w-4 h-4" />
          Salvar
        </Button>
      </div>

      </div>

      {transaction.isFitIdAlreadyExists && (
        <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-md text-sm font-medium w-full">
          <CheckCircle2 className="h-4 w-4" />
          Transação já processada
        </div>
      )}
    </Card>
  );
}; 
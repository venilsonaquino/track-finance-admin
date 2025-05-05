import React, { useCallback } from "react";
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
import { useTransactions } from "@/pages/transactions/hooks/use-transactions";
import { TransactionRequest } from "@/api/dtos/transaction/transactionRequest";
import { toast } from "sonner";
import { IntervalType } from "@/types/Interval-type ";

interface TransactionCardProps {
  transaction: TransactionResponse;
  wallets: WalletResponse[];
  categories: CategoryResponse[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;
  handleSelectChange: (name: string, value: string, index: number) => void;
  index: number;
}

const TransactionCard = React.memo(({ 
  transaction, 
  handleInputChange, 
  handleSelectChange,
  index, 
  wallets, 
  categories 
}: TransactionCardProps) => {
  const { createTransaction } = useTransactions();

  const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, index);
  }, [handleInputChange, index]);

  const handleSave = (transaction: TransactionResponse) => {
    try {
      const transactionRequest: TransactionRequest = {
        depositedDate: transaction.depositedDate,
        description: transaction.description,
        walletId: transaction.wallet?.id!,
        categoryId: transaction.category?.id!,
        amount: Number(transaction.amount),
        isInstallment: transaction.isInstallment,
        installmentNumber: transaction.installmentNumber,
        installmentInterval: transaction.installmentInterval as IntervalType,
        isRecurring: transaction.isRecurring,
        fitId: transaction.fitId,
        bankName: transaction.bankName,
        bankId: transaction.bankId,
        accountId: transaction.accountId,
        accountType: transaction.accountType,
        currency: transaction.currency,
        transactionDate: transaction.transactionDate,
        transactionSource: transaction.transactionSource,
      };

      createTransaction(transactionRequest);
      toast.success("Transação salva com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar transação");
    }
  }

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
                name="description"
                value={transaction.description}
                onChange={onChangeHandler}
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
          <Select 
            value={transaction.wallet?.id || undefined}
            onValueChange={(value) => handleSelectChange('wallet', value, index)}
            disabled={transaction.isFitIdAlreadyExists}
          >
            <SelectTrigger className={transaction.isFitIdAlreadyExists ? "bg-transparent border-none" : ""}>
              <SelectValue>
                {transaction.wallet?.name || "Selecione uma carteira"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {wallets.filter(wallet => wallet.id).map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id as string}>
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
          <Select 
            value={transaction.category?.id || undefined}
            onValueChange={(value) => handleSelectChange('category', value, index)}
            disabled={transaction.isFitIdAlreadyExists}
          >
            <SelectTrigger className={transaction.isFitIdAlreadyExists ? "bg-transparent border-none" : ""}>
              <SelectValue>
                {transaction.category?.name || "Selecione uma categoria"}
              </SelectValue>
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

        {/* Botão de salvar */}
        <Button 
          variant="outline" 
          onClick={() => handleSave(transaction)}
          disabled={transaction.isFitIdAlreadyExists}
        >
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
});

export default TransactionCard;
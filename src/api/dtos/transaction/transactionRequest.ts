export interface TransactionRequest {
  id?: string;
  depositedDate: string;
  description: string;
  walletId: string;
  categoryId: string;
  amount: number;
  transferType: "DEBIT" | "CREDIT";
  isInstallment: boolean | null;
  installmentNumber: number | null;
  installmentInterval: "MONTHLY" | "YEARLY" | "WEEKLY" | "DAILY" | null;
  isRecurring: boolean | null;
}
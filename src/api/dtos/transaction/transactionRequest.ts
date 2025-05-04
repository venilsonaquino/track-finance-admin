export interface TransactionRequest {
  depositedDate: string;
  description: string;
  walletId: string;
  categoryId: string;
  amount: number;
  transferType: "DEBIT" | "CREDIT";
}
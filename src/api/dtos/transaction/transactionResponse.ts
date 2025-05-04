import { CategoryResponse } from "../category/category-response";
import { WalletResponse } from "../wallet/wallet-response";

export interface TransactionResponse {
  transferType: string;
  depositedDate: string;
  description: string;
  amount: string;
  fitId: string;
  category: CategoryResponse | string | null;
  wallet: WalletResponse | string | null;
  isRecurring: boolean | null;
  recurrenceType: string | null;
  recurringInterval: string | null;
  recurringEndDate: string | null;
  isInstallment: boolean | null;
  installmentTotal: number | null;
  installmentNumber: number | null;
  installmentEndDate: string | null;
  isFitIdAlreadyExists: boolean;
  bankName: string;
  bankId: string;
  accountId: string;
  accountType: string;
  currency: string;
  transactionDate: string;
  transactionSource: string;
  balance: string;
  balanceDate: string;
}
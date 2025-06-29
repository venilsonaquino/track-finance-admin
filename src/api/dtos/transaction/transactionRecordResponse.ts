import { TransactionResponse } from "./transactionResponse";

interface TransactionRecord {
  date: string;
  endOfDayBalance: number | null;
  transactions: TransactionResponse[];
}

interface Summary {
  current_balance: number;
  monthly_income: number;
  monthly_expense: number;
  monthly_balance: number;
}

export default interface TransactionsRecordResponse {
  records: TransactionRecord[];
  summary: Summary;
}
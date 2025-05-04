import HttpClient from '@/api/httpClient';
import { TransactionRequest } from '../dtos/transaction/transactionRequest';

export const TransactionService = {
  createTransaction: (transaction: TransactionRequest) => HttpClient.post('/transactions', transaction),
  batchCreateTransactions: (transactions: TransactionRequest[]) => HttpClient.post('/transactions/create-batch', transactions),
  getTransactions: (startDate: string, endDate: string, categoryIds: string[]) => HttpClient.get(`/transactions?start_date=${startDate}&end_date=${endDate}&category_ids=${categoryIds}`),
  getTransactionById: (id: string) => HttpClient.get(`/transactions/${id}`),
  updateTransaction: (id: string, transaction: TransactionRequest) => HttpClient.put(`/transactions/${id}`, transaction),
  deleteTransaction: (id: string) => HttpClient.delete(`/transactions/${id}`),
};
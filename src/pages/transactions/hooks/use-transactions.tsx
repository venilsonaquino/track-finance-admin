import { TransactionRequest } from "@/api/dtos/transaction/transactionRequest";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { TransactionService } from "@/api/services/transactionService";
import { useState } from "react";

export const useTransactions = () => {
	const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBatchTransactions = async (transactions: TransactionRequest[]) => {
    try {
      setLoading(true);
      const response = await TransactionService.batchCreateTransactions(transactions);
      setTransactions(response.data);
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const createTransaction = async (transaction: TransactionRequest) => {
    try {
      setLoading(true);
      const response = await TransactionService.createTransaction(transaction);
      setTransactions(response.data);
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const clearTransactions = () => {
    setTransactions([]);
  };

  const updateTransaction = async (transaction: TransactionRequest) => {
    try {
      setLoading(true);
      const response = await TransactionService.updateTransaction(transaction.id!, transaction);
      setTransactions(response.data);
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      await TransactionService.deleteTransaction(id);
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const getTransactions = async (startDate: string, endDate: string, categoryIds: string[]) => {
    try {
      setLoading(true);
      const response = await TransactionService.getTransactions(startDate, endDate, categoryIds);
      setTransactions(response.data);
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const getTransactionById = async (id: string) => {
    try {
      setLoading(true);
      const response = await TransactionService.getTransactionById(id);
      return response.data;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { 
    transactions, 
    loading, 
    error, 
    createBatchTransactions, 
    createTransaction, 
    clearTransactions, 
    updateTransaction, 
    deleteTransaction, 
    getTransactions,
    getTransactionById 
  };
};

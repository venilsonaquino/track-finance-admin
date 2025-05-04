import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { FileService } from "@/api/services/fileService";
import { useState } from "react";

export const useFiles = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadFile = async (file: File) => {
    try {
      setLoading(true);
      const response = await FileService.uploadFile(file);
      setTransactions(prev => [...prev, response.data]);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }
  return { transactions, loading, error, uploadFile };
}
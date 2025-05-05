import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { FileService } from "@/api/services/fileService";
import { useState } from "react";

export const useFiles = () => {
  const [importedTransactions, setImportedTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadFile = async (file: File) => {
    try {
      setLoading(true);
      const response = await FileService.uploadFile(file);
      const newTransactions = [...importedTransactions, response.data];
      setImportedTransactions(newTransactions);
      return response;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { importedTransactions, loading, error, uploadFile };
}
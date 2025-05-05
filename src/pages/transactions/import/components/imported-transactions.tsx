import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { FileUpload } from "./file-upload";

interface ImportedTransactionsProps {
  file: File | null;
  setFile: (file: File | null) => void;
  importedTransactions: TransactionResponse[];
  setImportedTransactions: (transactions: TransactionResponse[]) => void;
}

export const ImportedTransactions = ({
  file,
  setFile,
  importedTransactions,
  setImportedTransactions
}: ImportedTransactionsProps) => {
  return (
    <FileUpload 
      file={file} 
      setFile={setFile}
      importedTransactions={importedTransactions}
      setImportedTransactions={setImportedTransactions}
    />
  );
}; 
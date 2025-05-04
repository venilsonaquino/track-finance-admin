import { useState, useCallback } from "react";
import { FileUpload } from "./components/file-upload";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { ReviewTransaction } from "./components/review-transaction";

const ImportTransactionPage = () => {
	const [file, setFile] = useState<File | null>(null);
	const [importedTransactions, setImportedTransactions] = useState<TransactionResponse[]>([]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
		const { value } = e.target;
		setImportedTransactions(prev => {
			const transaction = prev[index];
			if (transaction.description === value) return prev;
			
			const updated = [...prev];
			updated[index] = { ...transaction, description: value };
			return updated;
		});
	}, []);

	return (
		<>
			{importedTransactions.length === 0 ? (
				<FileUpload 
					file={file} 
					setFile={setFile}
					importedTransactions={importedTransactions}
					setImportedTransactions={setImportedTransactions}
				/>
			) : (
				<>
					<ReviewTransaction 
						transactions={importedTransactions}
						onCancel={() => setImportedTransactions([])}
						handleInputChange={handleInputChange}
					/>
				</>
			) 
			}
		</>
	);
};

export default ImportTransactionPage; 
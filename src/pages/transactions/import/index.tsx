import { useState } from "react";
import { FileUpload } from "./components/file-upload";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { ReviewTransaction } from "./components/review-transaction";

const ImportTransactionPage = () => {
	const [file, setFile] = useState<File | null>(null);
	const [importedTransactions, setImportedTransactions] = useState<TransactionResponse[]>([]);

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
						setImportedTransactions={setImportedTransactions}
					/>
				</>
			) 
			}
		</>
	);
};

export default ImportTransactionPage; 
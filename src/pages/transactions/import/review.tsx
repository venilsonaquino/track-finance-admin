import { useState } from "react";
import * as yup from "yup";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { useWallets } from "@/pages/transactions/hooks/use-wallets";
import { useCategories } from "@/pages/transactions/hooks/use-categories";
import { ReviewHeader } from "./components/ReviewHeader";
import { TransactionCard } from "./components/TransactionCard";

type ValidationErrors = {
	[key: string]: { [key: string]: string };
};

interface ReviewTransactionsProps {
	transactions: TransactionResponse[];
	onCancel: () => void;
	onSave: (transactions: TransactionResponse[]) => void;
}

const transactionSchema = yup.object().shape({
	installmentTotal: yup.number()
		.nullable()
		.when('isInstallment', {
			is: true,
			then: (schema) => schema
				.required('Total de parcelas é obrigatório')
				.min(2, 'Mínimo de 2 parcelas')
				.max(48, 'Máximo de 48 parcelas'),
		}),
	recurringInterval: yup.string()
		.nullable()
		.when('isInstallment', {
			is: true,
			then: (schema) => schema
				.required('Intervalo é obrigatório')
				.oneOf(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'], 'Intervalo inválido'),
		}),
});

const ReviewTransactionsPage = ({ transactions: importedTransactions, onCancel, onSave }: ReviewTransactionsProps) => {
	const { wallets } = useWallets();
	const { categories } = useCategories();
	const [transactions, setTransactions] = useState<TransactionResponse[]>(() => {
		return importedTransactions.map(transaction => ({
			...transaction,
			wallet: transaction.wallet || wallets[0] || null,
			category: transaction.category || categories[0] || null
		}));
	});
	const [errors, setErrors] = useState<ValidationErrors>({});

	const handleWalletChange = (fitId: string, walletId: string) => {
		const selectedWallet = wallets.find(w => w.id === walletId);
		if (!selectedWallet) return;

		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? { ...transaction, wallet: selectedWallet }
					: transaction
			)
		);
	};

	const handleCategoryChange = (fitId: string, categoryId: string) => {
		const selectedCategory = categories.find(c => c.id === categoryId);
		if (!selectedCategory) return;

		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? { ...transaction, category: selectedCategory }
					: transaction
			)
		);
	};

	const handleRecurringChange = (fitId: string, isRecurring: boolean) => {
		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? {
							...transaction,
							isRecurring,
							recurrenceType: isRecurring ? "INDEFINITE" : null,
							recurringInterval: isRecurring ? "MONTHLY" : null,
							recurringEndDate: null,
					  }
					: transaction
			)
		);
	};

	const handleInstallmentChange = async (fitId: string, isInstallment: boolean) => {
		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? {
							...transaction,
							isInstallment,
							installmentTotal: isInstallment ? 2 : null,
							installmentNumber: isInstallment ? 1 : null,
							installmentEndDate: null,
					  }
					: transaction
			)
		);
	};

	const handleInstallmentTotalChange = async (fitId: string, total: string) => {
		const totalNumber = parseInt(total);
		if (isNaN(totalNumber)) return;

		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? { ...transaction, installmentTotal: totalNumber }
					: transaction
			)
		);
	};

	const handleRecurringIntervalChange = async (
		fitId: string,
		interval: "DAILY" | "MONTHLY" | "WEEKLY" | "YEARLY" | null
	) => {
		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? { ...transaction, recurringInterval: interval }
					: transaction
			)
		);
	};

	const handleDescriptionChange = (fitId: string, description: string) => {
		setTransactions(prev =>
			prev.map(transaction =>
				transaction.fitId === fitId
					? { ...transaction, description }
					: transaction
			)
		);
	};

	const validateTransaction = async (transaction: TransactionResponse) => {
		try {
			await transactionSchema.validate(transaction, { abortEarly: false });
			setErrors(prev => ({ ...prev, [transaction.fitId]: {} }));
			return true;
		} catch (err) {
			if (err instanceof yup.ValidationError) {
				const fieldErrors: { [key: string]: string } = {};
				err.inner.forEach((error) => {
					if (error.path) {
						fieldErrors[error.path] = error.message;
					}
				});
				setErrors(prev => ({ ...prev, [transaction.fitId]: fieldErrors }));
			}
			return false;
		}
	};

	const handleSaveAll = async () => {
		const validations = await Promise.all(
			transactions
				.filter(t => !t.isFitIdAlreadyExists)
				.map(validateTransaction)
		);

		if (validations.every(isValid => isValid)) {
			onSave(transactions);
		}
	};

	return (
		<>
			<ReviewHeader onCancel={onCancel} onSaveAll={handleSaveAll} />
			
			<div className="container mx-auto py-8">
				<div className="grid gap-3">
					{transactions.map((transaction) => (
						<TransactionCard
							key={transaction.fitId}
							transaction={transaction}
							wallets={wallets}
							categories={categories}
							errors={errors[transaction.fitId] || {}}
							onWalletChange={handleWalletChange}
							onCategoryChange={handleCategoryChange}
							onDescriptionChange={handleDescriptionChange}
							onRecurringChange={handleRecurringChange}
							onInstallmentChange={handleInstallmentChange}
							onInstallmentTotalChange={handleInstallmentTotalChange}
							onRecurringIntervalChange={handleRecurringIntervalChange}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default ReviewTransactionsPage; 
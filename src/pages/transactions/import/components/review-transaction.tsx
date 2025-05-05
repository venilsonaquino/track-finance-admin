import React, { useCallback, useMemo } from "react";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { ReviewHeader } from "./review-header";
import { useWallets } from "@/pages/wallet/hooks/use-wallets";
import { useCategories } from "@/pages/category/hooks/use-categories";
import TransactionCard from "./transaction-card";
import { useTransactions } from "@/pages/transactions/hooks/use-transactions";
import { TransactionRequest } from "@/api/dtos/transaction/transactionRequest";
import { toast } from "sonner";
import { IntervalType } from "@/types/Interval-type ";

interface ReviewTransactionProps {
	transactions: TransactionResponse[];
	onCancel: () => void;
	setImportedTransactions: React.Dispatch<React.SetStateAction<TransactionResponse[]>>;
}

export const ReviewTransaction = ({ transactions, onCancel, setImportedTransactions  }: ReviewTransactionProps) => {
	const { wallets } = useWallets();
	const { categories } = useCategories();
	const { createBatchTransactions } = useTransactions();

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
		const { value } = e.target;
		setImportedTransactions((prev: TransactionResponse[]) => {
			const transaction = prev[index];
			if (transaction.description === value) return prev;
			
			const updated = [...prev];
			updated[index] = { ...transaction, description: value };
			return updated;
		});
	}, []);

	const handleSelectChange = useCallback((name: string, value: string, index: number) => {
		setImportedTransactions((prev: TransactionResponse[]) => {
			const updated = [...prev];
			const transaction = updated[index];

			if (name === 'wallet') {
				const selectedWallet = wallets.find(w => w.id === value);
				updated[index] = { ...transaction, wallet: selectedWallet || null };
			} else if (name === 'category') {
				const selectedCategory = categories.find(c => c.id === value);
				updated[index] = { ...transaction, category: selectedCategory || null };
			}

			return updated;
		});
	}, [wallets, categories]);

	const handleSaveAll = () => {
		const hasIncompleteTransactions = transactions.some(
			(transaction) => !transaction.wallet?.id || !transaction.category?.id
		);
	
		if (hasIncompleteTransactions) {
			toast.error("Preencha todas as carteiras e categorias antes de salvar.");
			return;
		}
	
		const transactionsToSave: TransactionRequest[] = transactions.map((transaction) => ({
			depositedDate: transaction.depositedDate,
			description: transaction.description,
			walletId: transaction.wallet?.id!,
			categoryId: transaction.category?.id!,
			amount: Number(transaction.amount),
			isInstallment: transaction.isInstallment,
			installmentNumber: transaction.installmentNumber,
			installmentInterval: transaction.installmentInterval as IntervalType,
			isRecurring: transaction.isRecurring,
			bankName: transaction.bankName,
			bankId: transaction.bankId,
			accountId: transaction.accountId,
			accountType: transaction.accountType,
			currency: transaction.currency,
			transactionDate: transaction.transactionDate,
			transactionSource: transaction.transactionSource,
		}));
	
		createBatchTransactions(transactionsToSave);
		toast.success("Transações salvas com sucesso");
	};

	const handleTransactionSaved = useCallback((fitId: string) => {
		setImportedTransactions(prev => prev.filter(transaction => transaction.fitId !== fitId));
	}, []);

	const transactionsList = useMemo(() => (
		transactions.map((transaction, index) => (
			<TransactionCard
				key={transaction.fitId}
				transaction={transaction}
				wallets={wallets}
				categories={categories}
				handleInputChange={handleInputChange}
				handleSelectChange={handleSelectChange}
				index={index}
				onTransactionSaved={handleTransactionSaved}
			/>
		))
	), [transactions, wallets, categories, handleInputChange, handleSelectChange, handleTransactionSaved]);

	return (
		<>
			<ReviewHeader onCancel={onCancel} onSaveAll={handleSaveAll} />
			<div className="container mx-auto py-8">
				<div className="grid gap-3">
					{transactionsList}
				</div>
			</div>
		</>
	);
};
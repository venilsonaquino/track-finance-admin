import React, { useMemo } from "react";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { ReviewHeader } from "./review-header";
import { useWallets } from "@/pages/wallet/hooks/use-wallets";
import { useCategories } from "@/pages/category/hooks/use-categories";
import TransactionCard from "./transaction-card";
import { useTransactions } from "@/pages/transactions/hooks/use-transactions";
import { TransactionRequest } from "@/api/dtos/transaction/transactionRequest";
import { toast } from "sonner";

type IntervalType = "DAILY" | "MONTHLY" | "WEEKLY" | "YEARLY" | null;

interface ReviewTransactionProps {
	transactions: TransactionResponse[];
	onCancel: () => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;
}

export const ReviewTransaction = ({ transactions, onCancel, handleInputChange }: ReviewTransactionProps) => {
	const { wallets } = useWallets();
	const { categories } = useCategories();
	const { createBatchTransactions } = useTransactions();

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
			transferType: transaction.transferType as "DEBIT" | "CREDIT",
			isInstallment: transaction.isInstallment,
			installmentNumber: transaction.installmentNumber,
			installmentInterval: transaction.installmentInterval as IntervalType,
			isRecurring: transaction.isRecurring,
		}));
	
		createBatchTransactions(transactionsToSave);
	};

	const transactionsList = useMemo(() => (
		transactions.map((transaction, index) => (
			<TransactionCard
				key={transaction.fitId}
				transaction={transaction}
				wallets={wallets}
				categories={categories}
				handleInputChange={handleInputChange}
				index={index}
			/>
		))
	), [transactions, wallets, categories, handleInputChange]);

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
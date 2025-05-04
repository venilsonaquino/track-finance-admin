import React, { useMemo } from "react";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { ReviewHeader } from "./review-header";
import { useWallets } from "@/pages/wallet/hooks/use-wallets";
import { useCategories } from "@/pages/category/hooks/use-categories";
import TransactionCard from "./transaction-card";

interface ReviewTransactionProps {
	transactions: TransactionResponse[];
	onCancel: () => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;
}

export const ReviewTransaction = ({ transactions, onCancel, handleInputChange }: ReviewTransactionProps) => {
	const { wallets } = useWallets();
	const { categories } = useCategories();

	const handleSaveAll = () => {
		console.log("Salvar todas as transações");
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
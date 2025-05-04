import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { ReviewHeader } from "./review-header";
import { TransactionCard } from "./transaction-card";
import { useWallets } from "@/pages/wallet/hooks/use-wallets";
import { useCategories } from "@/pages/category/hooks/use-categories";

interface ReviewTransactionProps {
	transactions: TransactionResponse[];
	onCancel: () => void;
}

export const ReviewTransaction = ({ transactions, onCancel } : ReviewTransactionProps) => {

  const { wallets } = useWallets();
  const { categories } = useCategories();

  const handleSaveAll = () => {
    console.log("Salvar todas as transações");
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
            />
          ))}
        </div>
      </div>
		</>
	);
};
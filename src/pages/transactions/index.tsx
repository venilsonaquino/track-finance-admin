import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
// import { formatCurrency } from "@/utils/currency-utils";
import { useTransactions } from "./hooks/use-transactions";
import { useEffect, useState } from "react";
import TransactionsRecordResponse from "@/api/dtos/transaction/transactionRecordResponse";

const TransactionsPage = () => {
	const navigate = useNavigate();
	const { getTransactions } = useTransactions();
	const [transactionsData, setTransactionsData] = useState<TransactionsRecordResponse | null>(null);

	useEffect(() => {
		const loadTransactions = async () => {
			try {
				const response = await getTransactions("2024-01-01", "2024-12-31", []);
				setTransactionsData(response.data);
			} catch (error) {
				console.error("Erro ao carregar transações:", error);
			}
		};
		loadTransactions();
	}, []);

	return (
		<>
			<PageBreadcrumbNav title="Transações" />
			
			<div className="container mx-auto py-8">

				<div className="grid gap-4">
					{transactionsData?.records.map(record => (
						<Card key={record.date} className="p-4">
							{/* Renderização do card com base no tipo de registro */}
						</Card>
					))}
				</div>
			</div>
		</>
	);
};

export default TransactionsPage; 
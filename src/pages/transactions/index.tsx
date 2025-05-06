import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { formatCurrency } from "@/utils/currency-utils";

interface Transaction {
	id: string;
	date: string;
	description: string;
	amount: number;
	wallet: string;
	category: string;
}

const TransactionsPage = () => {
	const navigate = useNavigate();
	const [transactions] = useState<Transaction[]>([
		{
			id: "1",
			date: "2024-03-20",
			description: "SUPERMERCADO ABC",
			amount: -156.78,
			wallet: "Nubank",
			category: "Alimentação"
		},
		{
			id: "2",
			date: "2024-03-19",
			description: "NETFLIX",
			amount: -39.90,
			wallet: "Inter",
			category: "Entretenimento"
		},
		{
			id: "3",
			date: "2024-03-18",
			description: "SALÁRIO",
			amount: 5000.00,
			wallet: "Nubank",
			category: "Receita"
		},
	]);

	return (
		<>
			<PageBreadcrumbNav title="Transações" />
			
			<div className="container mx-auto py-8">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h2 className="text-2xl font-bold">Minhas Transações</h2>
						<p className="text-gray-500 mt-1">
							Gerencie suas entradas e saídas
						</p>
					</div>
					<Button onClick={() => navigate("/transacoes/importar")}>
						<Plus className="w-4 h-4 mr-2" />
						Importar OFX
					</Button>
				</div>

				<div className="grid gap-4">
					{transactions.map((transaction) => (
						<Card key={transaction.id} className="p-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="font-medium">{transaction.description}</p>
									<div className="flex items-center space-x-2 text-sm text-gray-500">
										<span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
										<span>•</span>
										<span>{transaction.wallet}</span>
										<span>•</span>
										<span>{transaction.category}</span>
									</div>
								</div>
								<p className={`text-lg font-semibold ${
									transaction.amount < 0 ? "text-red-600" : "text-green-600"
								}`}>
									{formatCurrency(transaction.amount)}
								</p>
							</div>
						</Card>
					))}
				</div>
			</div>
		</>
	);
};

export default TransactionsPage; 
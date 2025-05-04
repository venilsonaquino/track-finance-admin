import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Calendar, Repeat, CreditCard, ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/currency-utils";

type Transaction = {
	transferType: string;
	depositedDate: string;
	description: string;
	amount: string;
	fitId: string;
	category: string | null;
	
	// Recorrência
	isRecurring: boolean | null;
	recurrenceType: "INDEFINITE" | "FIXED" | null;
	recurringInterval: "MONTHLY" | "WEEKLY" | "YEARLY" | null;
	recurringEndDate: string | null;

	// Parcelamento
	isInstallment: boolean | null;
	installmentTotal: number | null;
	installmentNumber: number | null;
	installmentEndDate: string | null;

	// Outros campos
	wallet: string | null;
	isFitIdAlreadyExists: boolean;
	bankName: string;
	bankId: string;
	accountId: string;
	accountType: string;
	currency: string;
	transactionDate: string;
	transactionSource: string;
	balance: string;
	balanceDate: string;
};


const ReviewTransactionsPage = () => {
	const navigate = useNavigate();
	const [transactions, setTransactions] = useState<Transaction[]>([
		{
			transferType: "DEBIT",
			depositedDate: "2025-01-09",
			description: "Sesc Consolacao",
			amount: "-5.00",
			fitId: "677ea047-fd31-4178-9bbe-a29dabab0638",
			category: null,
			isRecurring: null,
			recurrenceType: null,
			recurringInterval: null,
			recurringEndDate: null,
			isInstallment: null,
			installmentTotal: null,
			installmentNumber: null,
			installmentEndDate: null,
			wallet: null,
			isFitIdAlreadyExists: false,
			bankName: "NU PAGAMENTOS S.A.",
			bankId: "260",
			accountId: "5fd5616c-9400-4669-ab6c-a257f0020592",
			accountType: "CREDIT_CARD",
			currency: "BRL",
			transactionDate: "2025-01-09",
			transactionSource: "CREDIT_CARD",
			balance: "-2193.33",
			balanceDate: "2025-01-11"
		},
		{
			transferType: "CREDIT",
			depositedDate: "2025-01-10",
			description: "Transferência Recebida",
			amount: "1500.00",
			fitId: "a12bcdef-1234-5678-abcd-1234567890ab",
			category: null,
			isRecurring: null,
			recurrenceType: null,
			recurringInterval: null,
			recurringEndDate: null,
			isInstallment: null,
			installmentTotal: null,
			installmentNumber: null,
			installmentEndDate: null,
			wallet: null,
			isFitIdAlreadyExists: false,
			bankName: "ITAÚ UNIBANCO S.A.",
			bankId: "341",
			accountId: "abcd1234-5678-9101-1121-a1b2c3d4e5f6",
			accountType: "CHECKING",
			currency: "BRL",
			transactionDate: "2025-01-10",
			transactionSource: "BANK_TRANSFER",
			balance: "306.67",
			balanceDate: "2025-01-11"
		},
		{
			transferType: "DEBIT",
			depositedDate: "2025-01-08",
			description: "IFood",
			amount: "-42.50",
			fitId: "f334c555-f98a-4c7e-8111-ae05cf00d111",
			category: null,
			isRecurring: null,
			recurrenceType: null,
			recurringInterval: null,
			recurringEndDate: null,
			isInstallment: null,
			installmentTotal: null,
			installmentNumber: null,
			installmentEndDate: null,
			wallet: null,
			isFitIdAlreadyExists: false,
			bankName: "BANCO INTER",
			bankId: "077",
			accountId: "98ab7654-3210-4321-bbbb-9876a1b2c3d4",
			accountType: "CREDIT_CARD",
			currency: "BRL",
			transactionDate: "2025-01-08",
			transactionSource: "CREDIT_CARD",
			balance: "-2235.83",
			balanceDate: "2025-01-09"
		},
		{
			transferType: "DEBIT",
			depositedDate: "2025-01-07",
			description: "Assinatura Spotify",
			amount: "-19.90",
			fitId: "8ee1f222-93de-4ef7-9ad5-22a123456789",
			category: null,
			isRecurring: null,
			recurrenceType: null,
			recurringInterval: null,
			recurringEndDate: null,
			isInstallment: null,
			installmentTotal: null,
			installmentNumber: null,
			installmentEndDate: null,
			wallet: null,
			isFitIdAlreadyExists: false,
			bankName: "CAIXA ECONÔMICA FEDERAL",
			bankId: "104",
			accountId: "caixa1234-4321-5678-9999-abcdefabcdef",
			accountType: "CHECKING",
			currency: "BRL",
			transactionDate: "2025-01-07",
			transactionSource: "DEBIT_CARD",
			balance: "-2255.73",
			balanceDate: "2025-01-08"
		}
	]);

	const wallets = [
		{ id: "1", name: "Nubank" },
		{ id: "2", name: "Inter" },
		{ id: "3", name: "Carteira" },
	];

	const categories = [
		{ id: "1", name: "Alimentação" },
		{ id: "2", name: "Entretenimento" },
		{ id: "3", name: "Transporte" },
		{ id: "4", name: "Saúde" },
	];

	const handleWalletChange = (fitId: string, walletId: string) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, wallet: walletId }
				: transaction
		));
	};

	const handleCategoryChange = (fitId: string, categoryId: string) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, category: categoryId }
				: transaction
		));
	};

	const handleRecurringChange = (fitId: string, isRecurring: boolean) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { 
					...transaction, 
					isRecurring,
					isInstallment: isRecurring ? false : transaction.isInstallment,
					installmentTotal: isRecurring ? null : transaction.installmentTotal,
					installmentNumber: isRecurring ? null : transaction.installmentNumber,
					installmentEndDate: isRecurring ? null : transaction.installmentEndDate
				}
				: transaction
		));
	};

	const handleRecurrenceTypeChange = (fitId: string, type: "INDEFINITE" | "FIXED" | null) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { 
					...transaction, 
					recurrenceType: type,
					recurringEndDate: type === "INDEFINITE" ? null : transaction.recurringEndDate
				}
				: transaction
		));
	};

	const handleRecurringIntervalChange = (fitId: string, interval: "MONTHLY" | "WEEKLY" | "YEARLY" | null) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, recurringInterval: interval }
				: transaction
		));
	};

	const handleRecurringEndDateChange = (fitId: string, date: string) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, recurringEndDate: date }
				: transaction
		));
	};

	const handleInstallmentChange = (fitId: string, isInstallment: boolean) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { 
					...transaction, 
					isInstallment,
					isRecurring: isInstallment ? false : transaction.isRecurring,
					recurringEndDate: isInstallment ? null : transaction.recurringEndDate
				}
				: transaction
		));
	};

	const handleInstallmentTotalChange = (fitId: string, total: string) => {
		const totalNumber = parseInt(total);
		if (isNaN(totalNumber) || totalNumber < 2) return;

		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, installmentTotal: totalNumber }
				: transaction
		));
	};

	const handleInstallmentNumberChange = (fitId: string, number: string) => {
		const numberValue = parseInt(number);
		if (isNaN(numberValue) || numberValue < 1) return;

		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, installmentNumber: numberValue }
				: transaction
		));
	};

	const handleDescriptionChange = (fitId: string, description: string) => {
		setTransactions(transactions.map(transaction => 
			transaction.fitId === fitId 
				? { ...transaction, description }
				: transaction
		));
	};

	const handleSaveAll = () => {
		// Implementar a lógica para salvar todas as transações
		console.log("Transações a serem salvas:", transactions);
		// Após salvar, redirecionar para a listagem de transações
		navigate("/transacoes/lancamentos");
	};

	// Conta quantas transações já existem
	const existingTransactionsCount = useMemo(() => {
		return transactions.filter(t => t.isFitIdAlreadyExists).length;
	}, [transactions]);

	return (
		<>
			<PageBreadcrumbNav title="Revisar Transações" />
			
			<div className="container mx-auto py-8">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h2 className="text-2xl font-bold">Transações Importadas</h2>
						<p className="text-sm text-gray-500 mt-1">
							Revise e categorize suas transações antes de salvar
						</p>
						{existingTransactionsCount > 0 && (
							<div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 flex-shrink-0" />
								<p className="text-sm">
									{existingTransactionsCount} {existingTransactionsCount === 1 ? 'transação já foi processada' : 'transações já foram processadas'} e {existingTransactionsCount === 1 ? 'está' : 'estão'} registrada{existingTransactionsCount === 1 ? '' : 's'} no sistema.
								</p>
							</div>
						)}
					</div>
					<div className="space-x-3">
						<Button variant="outline" onClick={() => navigate("/transacoes/lancamentos")}>
							Cancelar
						</Button>
						<Button onClick={handleSaveAll}>
							Salvar Novas
						</Button>
					</div>
				</div>

				<div className="grid gap-3">
					{transactions.map((transaction) => (
						<Card 
							key={transaction.fitId} 
							className={`p-4 transition-all ${
								transaction.isFitIdAlreadyExists 
									? 'bg-gray-50 border-blue-100' 
									: 'hover:shadow-md'
							}`}
						>
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="space-y-2 flex-1">
									<div className="flex items-center gap-2">
										{transaction.isFitIdAlreadyExists && (
											<div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium">
												<CheckCircle2 className="h-4 w-4" />
												Transação já processada
											</div>
										)}
										<div className="flex items-center gap-2 group w-full">
											<Input
												type="text"
												value={transaction.description}
												onChange={(e) => handleDescriptionChange(transaction.fitId, e.target.value)}
												disabled={transaction.isFitIdAlreadyExists}
												className={`font-medium ${transaction.isFitIdAlreadyExists ? 'text-gray-500 bg-transparent border-none p-0' : ''}`}
											/>
										</div>
									</div>
									<div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
										<span>{new Date(transaction.depositedDate).toLocaleDateString("pt-BR")}</span>
										<span>•</span>
										<span>{transaction.bankName}</span>
										{transaction.isRecurring && (
											<>
												<span>•</span>
												<span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full text-xs">
													Recorrente
												</span>
											</>
										)}
									</div>
								</div>
								<p className={`text-lg font-semibold whitespace-nowrap ${
									Number(transaction.amount) < 0 
										? transaction.isFitIdAlreadyExists ? 'text-red-400' : 'text-red-600'
										: transaction.isFitIdAlreadyExists ? 'text-green-400' : 'text-green-600'
								}`}>
									{formatCurrency(Number(transaction.amount))}
								</p>
							</div>

							<div className="mt-4 space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<Select
										value={transaction.wallet || undefined}
										onValueChange={(value) => handleWalletChange(transaction.fitId, value)}
										disabled={transaction.isFitIdAlreadyExists}
									>
										<SelectTrigger className={transaction.isFitIdAlreadyExists ? 'opacity-50' : ''}>
											<SelectValue placeholder="Selecionar carteira" />
										</SelectTrigger>
										<SelectContent>
											{wallets.map((wallet) => (
												<SelectItem key={wallet.id} value={wallet.id}>
													{wallet.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select
										value={transaction.category || undefined}
										onValueChange={(value) => handleCategoryChange(transaction.fitId, value)}
										disabled={transaction.isFitIdAlreadyExists}
									>
										<SelectTrigger className={transaction.isFitIdAlreadyExists ? 'opacity-50' : ''}>
											<SelectValue placeholder="Selecionar categoria" />
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{!transaction.isFitIdAlreadyExists && (
									<div className="border-t pt-3">
										<Collapsible>
											<div className="flex justify-end items-center gap-2">
												<span className="text-sm font-medium text-gray-600">Configurações Avançadas</span>
												<CollapsibleTrigger asChild>
													<Button variant="ghost" size="sm" className="p-0 h-6 w-6">
														<ChevronDown className="h-4 w-4" />
													</Button>
												</CollapsibleTrigger>
											</div>

											<CollapsibleContent className="space-y-4 mt-4">
												{/* Controles de Transação Fixa */}
												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<Repeat className="h-4 w-4 text-gray-500" />
															<span className="text-sm font-medium">Transação Fixa</span>
														</div>
														<Switch
															checked={!!transaction.isRecurring}
															onCheckedChange={(checked) => handleRecurringChange(transaction.fitId, checked)}
															disabled={!!transaction.isInstallment}
														/>
													</div>
												</div>

												{/* Controles de Parcelamento */}
												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<CreditCard className="h-4 w-4 text-gray-500" />
															<span className="text-sm font-medium">Transação Parcelada</span>
														</div>
														<Switch
															checked={!!transaction.isInstallment}
															onCheckedChange={(checked) => handleInstallmentChange(transaction.fitId, checked)}
															disabled={!!transaction.isRecurring}
														/>
													</div>

													{transaction.isInstallment && (
														<div className="space-y-2 pl-6">
															<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
																<div>
																	<label className="text-sm text-gray-600 mb-1 block">Total de Parcelas</label>
																	<Input
																		type="number"
																		min="2"
																		max="48"
																		placeholder="Ex: 12"
																		value={transaction.installmentTotal || ""}
																		onChange={(e) => handleInstallmentTotalChange(transaction.fitId, e.target.value)}
																	/>
																</div>
																<div>
																	<label className="text-sm text-gray-600 mb-1 block">Parcela Atual</label>
																	<Input
																		type="number"
																		min="1"
																		max={transaction.installmentTotal || 48}
																		placeholder="Ex: 1"
																		value={transaction.installmentNumber || ""}
																		onChange={(e) => handleInstallmentNumberChange(transaction.fitId, e.target.value)}
																	/>
																</div>
															</div>
														</div>
													)}
												</div>
											</CollapsibleContent>
										</Collapsible>
									</div>
								)}
							</div>
						</Card>
					))}
				</div>
			</div>
		</>
	);
};

export default ReviewTransactionsPage; 
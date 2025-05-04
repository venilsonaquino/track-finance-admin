import { useState } from "react";
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
import { CheckCircle2, Repeat, CreditCard, ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { formatCurrency } from "@/utils/currency-utils";
import * as yup from "yup";
import { TransactionResponse } from "@/api/dtos/transaction/transactionResponse";
import { useWallets } from "@/pages/transactions/hooks/use-wallets";
import { useCategories } from "@/pages/transactions/hooks/use-categories";

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
		// Inicializa as transações com a primeira carteira e categoria por padrão
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
		// Validar todas as transações antes de salvar
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
			<PageBreadcrumbNav title="Revisar Transações" />
			
			<div className="container mx-auto py-8">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h2 className="text-2xl font-bold">Transações Importadas</h2>
						<p className="text-sm text-gray-500 mt-1">
							Revise e categorize suas transações antes de salvar
						</p>
					</div>
					<div className="space-x-3">
						<Button variant="outline" onClick={onCancel}>
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
									? 'bg-muted border-muted-foreground/20' 
									: 'hover:shadow-md'
							}`}
						>
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="space-y-2 flex-1">
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-2 group w-full">
											<Input
												type="text"
												value={transaction.description}
												onChange={(e) => handleDescriptionChange(transaction.fitId, e.target.value)}
												disabled={transaction.isFitIdAlreadyExists}
												className={`font-medium ${
													transaction.isFitIdAlreadyExists 
														? 'bg-transparent border-none p-0 text-muted-foreground' 
														: ''
												}`}
											/>
										</div>
									</div>
									<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
										<span>{new Date(transaction.depositedDate).toLocaleDateString("pt-BR")}</span>
										<span>•</span>
										<span>{transaction.bankName}</span>
										{transaction.isRecurring && (
											<>
												<span>•</span>
												<span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs">
													Fixo
												</span>
											</>
										)}
										{transaction.isInstallment && (
											<>
												<span>•</span>
												<span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full text-xs">
													Parcelado
												</span>
											</>
										)}
									</div>
								</div>
								<p className={`text-lg font-semibold whitespace-nowrap ${
									Number(transaction.amount) < 0 
										? transaction.isFitIdAlreadyExists ? 'text-destructive/70' : 'text-destructive'
										: transaction.isFitIdAlreadyExists ? 'text-emerald-500/70' : 'text-emerald-500'
								}`}>
									{formatCurrency(Number(transaction.amount))}
								</p>
							</div>

							<div className="mt-4 space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium">Carteira</label>
										<Select
											value={typeof transaction.wallet === 'object' && transaction.wallet ? transaction.wallet.id : wallets[0]?.id || ''}
											onValueChange={(value) => handleWalletChange(transaction.fitId, value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Selecione uma carteira" />
											</SelectTrigger>
											<SelectContent>
												{wallets.map((wallet) => (
													<SelectItem key={wallet.id} value={wallet.id}>
														{wallet.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<label className="text-sm font-medium">Categoria</label>
										<Select
											value={typeof transaction.category === 'object' && transaction.category ? transaction.category.id : categories[0]?.id || ''}
											onValueChange={(value) => handleCategoryChange(transaction.fitId, value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Selecione uma categoria" />
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
																		className={errors[transaction.fitId]?.installmentTotal ? 'border-destructive' : ''}
																	/>
																	{errors[transaction.fitId]?.installmentTotal && (
																		<span className="text-xs text-destructive mt-1">
																			{errors[transaction.fitId].installmentTotal}
																		</span>
																	)}
																</div>
																<div>
																	<label className="text-sm text-gray-600 mb-1 block">Intervalo</label>
																	<Select
																		value={transaction.recurringInterval || ""}
																		onValueChange={(value: "DAILY" | "MONTHLY" | "WEEKLY" | "YEARLY") => 
																			handleRecurringIntervalChange(transaction.fitId, value)
																		}
																	>
																		<SelectTrigger className={errors[transaction.fitId]?.recurringInterval ? 'border-destructive' : ''}>
																			<SelectValue placeholder="Selecione o intervalo" />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="DAILY">Diário</SelectItem>
																			<SelectItem value="WEEKLY">Semanal</SelectItem>
																			<SelectItem value="MONTHLY">Mensal</SelectItem>
																			<SelectItem value="YEARLY">Anual</SelectItem>
																		</SelectContent>
																	</Select>
																	{errors[transaction.fitId]?.recurringInterval && (
																		<span className="text-xs text-destructive mt-1">
																			{errors[transaction.fitId].recurringInterval}
																		</span>
																	)}
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
							{transaction.isFitIdAlreadyExists && (
								<div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-md text-sm font-medium w-full">
									<CheckCircle2 className="h-4 w-4" />
									Transação já processada
								</div>
							)}
						</Card>
					))}
				</div>
			</div>
		</>
	);
};

export default ReviewTransactionsPage; 
import React, { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X, Calendar, Tag, Check } from "lucide-react";
import { useCategories } from "../../hooks/use-categories";
import { DateUtils } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FilterSheetProps {
	onApplyFilters: (filters: {
		startDate: string;
		endDate: string;
		categoryIds: string[];
	}) => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ onApplyFilters }) => {
	const { categories, loading: categoriesLoading } = useCategories();
	const [isOpen, setIsOpen] = useState(false);
	
	// Definir datas padrão do mês atual
	const defaultDates = DateUtils.getMonthStartAndEnd(new Date());
	const [startDate, setStartDate] = useState(defaultDates.startDate);
	const [endDate, setEndDate] = useState(defaultDates.endDate);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

	const handleApplyFilters = () => {
		onApplyFilters({
			startDate: startDate || defaultDates.startDate,
			endDate: endDate || defaultDates.endDate,
			categoryIds: selectedCategories,
		});
		setIsOpen(false);
		setActiveFiltersCount(selectedCategories.length);
	};

	const handleClearFilters = () => {
		setStartDate(defaultDates.startDate);
		setEndDate(defaultDates.endDate);
		setSelectedCategories([]);
		setActiveFiltersCount(0);
		setIsOpen(false);
	};

	const handleCategoryToggle = (categoryId: string) => {
		setSelectedCategories(prev => 
			prev.includes(categoryId)
				? prev.filter(id => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	const hasActiveFilters = startDate || endDate || selectedCategories.length > 0;
	// const activeFiltersCount = [startDate, endDate].filter(Boolean).length + selectedCategories.length;

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="outline">
					<Filter className="h-4 w-4 mr-2" />
					Filtros
					{hasActiveFilters && (
						<Badge 
							variant="secondary" 
							className="ml-2 h-5 w-5 rounded-full p-0 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-100"
						>
							{activeFiltersCount}
						</Badge>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-[400px] sm:w-[480px] p-0">
				<div className="flex flex-col h-full">
					{/* Header */}
					<SheetHeader className="px-6 py-4 border-b">
						<SheetTitle className="text-lg font-semibold">Filtros</SheetTitle>
						<p className="text-sm text-muted-foreground">
							Personalize sua visualização de transações
						</p>
					</SheetHeader>

					{/* Content */}
					<div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
						{/* Date Range Section */}
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<h3 className="text-sm font-medium">Período</h3>
							</div>
							
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="start-date" className="text-xs font-medium text-muted-foreground">
										Data inicial
									</Label>
									<Input
										id="start-date"
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="h-9 text-sm"
									/>
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="end-date" className="text-xs font-medium text-muted-foreground">
										Data final
									</Label>
									<Input
										id="end-date"
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="h-9 text-sm"
									/>
								</div>
							</div>
						</div>

						<Separator />

						{/* Categories Section */}
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Tag className="h-4 w-4 text-muted-foreground" />
								<h3 className="text-sm font-medium">Categorias</h3>
								{selectedCategories.length > 0 && (
									<Badge variant="secondary" className="text-xs">
										{selectedCategories.length} selecionada{selectedCategories.length > 1 ? 's' : ''}
									</Badge>
								)}
							</div>
							
							{categoriesLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="text-sm text-muted-foreground">
										Carregando categorias...
									</div>
								</div>
							) : (
								<div className="space-y-2 max-h-48 overflow-y-auto pr-2">
									{categories.map((category) => {
										const isSelected = selectedCategories.includes(category.id);
										return (
											<button
												key={category.id}
												onClick={() => handleCategoryToggle(category.id)}
												className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:bg-muted/50 ${
													isSelected 
														? 'border-blue-200 bg-blue-50/50' 
														: 'border-border hover:border-border/60'
												}`}
											>
												<div className="flex items-center space-x-3">
													<div
														className={`w-3 h-3 rounded-full transition-all duration-200 ${
															isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
														}`}
														style={{ backgroundColor: category.color }}
													/>
													<span className={`text-sm font-medium transition-colors ${
														isSelected ? 'text-blue-700' : 'text-foreground'
													}`}>
														{category.name}
													</span>
												</div>
												{isSelected && (
													<Check className="h-4 w-4 text-blue-600" />
												)}
											</button>
										);
									})}
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<SheetFooter className="px-6 py-4 border-t bg-muted/20">
						<div className="flex gap-3 w-full">
							<Button
								variant="ghost"
								onClick={handleClearFilters}
								className="flex-1 h-10"
								disabled={!hasActiveFilters}
							>
								<X className="h-4 w-4 mr-2" />
								Limpar
							</Button>
							<Button 
								onClick={handleApplyFilters} 
								className="flex-1 h-10"
								disabled={!hasActiveFilters}
							>
								Aplicar Filtros
							</Button>
						</div>
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
};
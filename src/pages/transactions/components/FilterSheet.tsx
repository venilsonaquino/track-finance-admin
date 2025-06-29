import React, { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { useCategories } from "../hooks/use-categories";
import { DateUtils } from "@/utils/date-utils";

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
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const handleApplyFilters = () => {
		onApplyFilters({
			startDate: startDate || DateUtils.getMonthStartAndEnd(new Date()).startDate,
			endDate: endDate || DateUtils.getMonthStartAndEnd(new Date()).endDate,
			categoryIds: selectedCategories,
		});
		setIsOpen(false);
	};

	const handleClearFilters = () => {
		setStartDate("");
		setEndDate("");
		setSelectedCategories([]);
	};

	const handleCategoryToggle = (categoryId: string) => {
		setSelectedCategories(prev => 
			prev.includes(categoryId)
				? prev.filter(id => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	const hasActiveFilters = startDate || endDate || selectedCategories.length > 0;

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button>
					<Filter className="h-4 w-4 mr-2" />
					Filtros
					{hasActiveFilters && (
						<div className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Filtros de Transações</SheetTitle>
					<SheetDescription>
						Configure os filtros para visualizar as transações desejadas.
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-6 py-4">
					{/* Filtro por Data */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium">Período</h3>
						
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="start-date">Data de Início</Label>
								<Input
									id="start-date"
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									placeholder="Selecione a data inicial"
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="end-date">Data de Fim</Label>
								<Input
									id="end-date"
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									placeholder="Selecione a data final"
								/>
							</div>
						</div>
					</div>

					{/* Filtro por Categoria */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium">Categorias</h3>
						
						{categoriesLoading ? (
							<div className="text-sm text-muted-foreground">
								Carregando categorias...
							</div>
						) : (
							<div className="space-y-2 max-h-60 overflow-y-auto">
								{categories.map((category) => (
									<div
										key={category.id}
										className="flex items-center space-x-2"
									>
										<input
											type="checkbox"
											id={`category-${category.id}`}
											checked={selectedCategories.includes(category.id)}
											onChange={() => handleCategoryToggle(category.id)}
											className="rounded border-gray-300"
										/>
										<Label
											htmlFor={`category-${category.id}`}
											className="text-sm cursor-pointer flex items-center"
										>
											<div
												className="w-4 h-4 rounded-full mr-2"
												style={{ backgroundColor: category.color }}
											/>
											{category.name}
										</Label>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<SheetFooter className="flex gap-2">
					<Button
						variant="outline"
						onClick={handleClearFilters}
						className="flex-1"
					>
						<X className="h-4 w-4 mr-2" />
						Limpar
					</Button>
					<Button onClick={handleApplyFilters} className="flex-1">
						Aplicar Filtros
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
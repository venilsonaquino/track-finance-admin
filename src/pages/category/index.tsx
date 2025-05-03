import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { useCategories } from "./hooks/use-categories";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, MoreVertical } from "lucide-react";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	ColumnDef,
	flexRender,
	SortingState,
	ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CategoryForm } from "./components/category-form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryResponse } from "@/api/dtos/category/category-response";
import { CategoryRequest } from "@/api/dtos/category/category-request";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "lucide-react/dynamic";
import { ConfirmDelete } from "@/components/confirm-delete";
import { toast } from "sonner";

const Category = () => {
	const { categories, loading, error, deleteCategory, createCategory, updateCategory } = useCategories();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);

	const columns: ColumnDef<CategoryResponse>[] = [
		{
			accessorKey: "name",
			header: "Nome",
		},
		{
			accessorKey: "icon",
			header: "Ícone",
			cell: ({ row }) => {
				const category = row.original;
				return <DynamicIcon name={category.icon as any} size={24} />;
			},
		},
		{
			accessorKey: "color",
			header: "Cor",
			cell: ({ row }) => {
				const category = row.original;
				return <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />;
			},
		},
		{
			accessorKey: "description",
			header: "Descrição",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const category = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									setSelectedCategory(category);
									setIsDialogOpen(true);
								}}
							>
								<Pencil className="h-4 w-4 mr-2" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleDelete(category.id)}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: categories,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		state: {
			sorting,
			columnFilters,
		},
	});

	const handleSubmit = (data: CategoryRequest) => {
		if (selectedCategory) {
			updateCategory(selectedCategory.id, data);
		} else {
			createCategory(data);
		}
		setIsDialogOpen(false);
		setSelectedCategory(null);
	};

	const handleDelete = async (id: string) => {
		setCategoryToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!categoryToDelete) return;
		
		try {
			await deleteCategory(categoryToDelete);
			toast.success("Categoria excluída com sucesso!");
		} catch (error) {
			toast.error("Erro ao excluir categoria");
		} finally {
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);
		}
	};

	if (loading) return <div>Carregando...</div>;
	if (error) return <div>Erro: {error}</div>;

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<PageBreadcrumbNav title="Categorias" />
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setSelectedCategory(null)}>
							<Plus className="h-4 w-4 mr-2" />
							Nova Categoria
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{selectedCategory ? "Editar Categoria" : "Nova Categoria"}
							</DialogTitle>
						</DialogHeader>
						<CategoryForm
							initialData={selectedCategory ? {
								name: selectedCategory.name,
								description: selectedCategory.description,
								color: selectedCategory.color,
								icon: selectedCategory.icon,
							} : undefined}
							onSubmit={handleSubmit}
							onCancel={() => {
								setIsDialogOpen(false);
								setSelectedCategory(null);
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			<div className="flex items-center py-4">
				<Input
					placeholder="Filtrar por nome..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum resultado encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Anterior
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Próxima
				</Button>
			</div>

			<ConfirmDelete
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				confirmDelete={confirmDelete}
			/>
		</div>
	);
};

export default Category;

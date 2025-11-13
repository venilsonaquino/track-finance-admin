import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { useCategories } from "./hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryResponse } from "@/api/dtos/category/category-response";
import { CategoryRequest } from "@/api/dtos/category/category-request";
import { ConfirmDelete } from "@/components/confirm-delete";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryFormDialog } from "./components/category-form-dialog";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "lucide-react/dynamic";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const Category = () => {
	const { categories, loading, error, deleteCategory, createCategory, updateCategory } = useCategories();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);

	const columns: ColumnDef<CategoryResponse>[] = [
		{
			accessorKey: "name",
			header: (props) => (
				<DataTableColumnHeader<CategoryResponse, unknown> column={props.column} title="Nome" />
			),
			cell: ({ row }) => {
				const category = row.original;
				return (
					<div className="w-full truncate text-sm sm:text-base">
						{category.name}
					</div>
				);
			},
		},
		{
			accessorKey: "icon",
			cell: ({ row }) => {
				const category = row.original;
				return (
					<div className="w-full h-full min-h-[48px]">
						<div
							className="w-8 h-8 rounded-full flex items-center justify-center"
							style={{ backgroundColor: category.color }}
						>
							<DynamicIcon
								name={category.icon as any}
								size={16}
								className="text-white"
							/>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "description",
			cell: ({ row }) => {
				const category = row.original;
				return (
					<div className="w-full truncate text-sm sm:text-base">{category.description}</div>
				);
			},
		},
		{
			id: "actions",
			header: "",
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
							<DropdownMenuItem onClick={() => {
								setSelectedCategory(category);
								setIsDialogOpen(true);
							}}>
								<Pencil className="h-4 w-4 mr-2" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDelete(category.id)}>
								<Trash2 className="h-4 w-4 mr-2" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

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
		<>
			<div className="flex justify-between items-center">
				<PageBreadcrumbNav items={[{ label: "Categorias" }]} />
				<Button onClick={() => {
					setSelectedCategory(null);
					setIsDialogOpen(true);
				}}>
					<Plus className="h-4 w-4 mr-2" />
					Nova Categoria
				</Button>
			</div>

			<DataTable columns={columns} data={categories} />

			<CategoryFormDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
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
				isEdit={!!selectedCategory}
			/>

			<ConfirmDelete
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				confirmDelete={confirmDelete}
			/>
		</>
	);
};

export default Category;

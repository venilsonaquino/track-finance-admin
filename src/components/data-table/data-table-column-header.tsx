import { Column } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

import { ArrowUp } from "lucide-react";

import { ArrowDown } from "lucide-react";

export function DataTableColumnHeader<TData, TValue>({ column, title }: { column: Column<TData, TValue>; title: string }) {
	return (
		<div
			className="flex items-center gap-1 cursor-pointer select-none"
			onClick={column.getToggleSortingHandler()}
			role="button"
			tabIndex={0}
		>
			<span>{title}</span>
			{column.getIsSorted() === "desc" ? (
				<ArrowDown className="w-4 h-4" />
			) : column.getIsSorted() === "asc" ? (
				<ArrowUp className="w-4 h-4" />
			) : (
				<ChevronsUpDown className="w-4 h-4 opacity-50" />
			)}
		</div>
	);
}
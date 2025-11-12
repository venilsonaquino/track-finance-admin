import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CellSumOnlyPopover from "./CellSumOnlyPopover";
import ColGroup from "./ColGroup";
import SectionTitle from "./SectionTitle";
import { Row } from "../types";
import { formatCurrency } from "@/utils/currency-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListPlus, Pencil, Trash2 } from "lucide-react";

type EditableBlockProps = {
  title: string;
  months: string[];
  rows: Row[];
  color?: string;
  footerLabel: string;
  footerValues: number[];
  onUpdateCell: (rowId: string, monthIndex: number, nextValueFactory: (current: number) => number) => void;
  compact?: boolean;
  locale?: string;
  currency?: string;
  isSystemDefault?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddCategory?: () => void;
  editingTitle?: boolean;
  titleInputValue?: string;
  onTitleInputChange?: (value: string) => void;
  onTitleSave?: () => void;
  onTitleCancel?: () => void;
  savingTitle?: boolean;
};

export default function EditableBlock({
  title,
  months,
  rows,
  color,
  footerLabel,
  footerValues,
  onUpdateCell,
  compact = false,
  locale,
  currency,
  onEdit,
  onDelete,
  onAddCategory,
  isSystemDefault,
  editingTitle = false,
  titleInputValue,
  onTitleInputChange,
  onTitleSave,
  onTitleCancel,
  savingTitle = false,
}: EditableBlockProps) {

  const hasActions = Boolean(onEdit || onDelete || onAddCategory);
  const canSaveTitle = (titleInputValue ?? "").trim().length > 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {editingTitle ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="border-l-8 h-6 rounded-sm" style={{ borderColor: color }} />
              <Input
                value={titleInputValue}
                onChange={(event) => onTitleInputChange?.(event.target.value)}
                placeholder="Nome do grupo"
                className="h-8 sm:w-72"
                autoFocus
                disabled={savingTitle}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={onTitleSave}
                disabled={!canSaveTitle || savingTitle}
              >
                {savingTitle ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onTitleCancel}
                disabled={savingTitle}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <SectionTitle label={title} color={color} />
        )}
        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-lg leading-none text-muted-foreground"
                aria-label={`Ações para ${title}`}
              >
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!isSystemDefault && (
                <>
                  <DropdownMenuItem disabled={!onEdit} onSelect={() => onEdit?.()}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!onDelete} onSelect={() => onDelete?.()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem disabled={!onAddCategory} onSelect={() => onAddCategory?.()}>
                <ListPlus className="h-4 mr-2" />
                Adicionar categoria
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="overflow-x-auto border rounded-md">
        <Table className="table-fixed w-full">
          <ColGroup months={months} />
          <TableHeader>
            <TableRow className="bg-zinc-900/90 text-white hover:bg-zinc-900/90">
              <TableHead className="w-[240px] text-white">Meses</TableHead>
              {months.map((m) => (
                <TableHead key={m} className="w-[120px] text-center text-white">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-transparent">
                <TableCell className="font-medium">{row.label.toLowerCase()}</TableCell>
                {months.map((_, mi) => (
                  <TableCell key={mi} className="text-right align-middle">
                    <CellSumOnlyPopover
                      value={row.values[mi] || 0}
                      onAdd={(delta) =>
                        onUpdateCell(row.id, mi, (current) => (current || 0) + delta)
                      }
                      onUndo={(delta) =>
                        onUpdateCell(row.id, mi, (current) => Math.max(0, (current || 0) - delta))
                      }
                      compact={compact}
                      locale={locale}
                      currency={currency}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-zinc-100 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-800">
              <TableCell className="font-semibold text-zinc-800 dark:text-zinc-200">{footerLabel}</TableCell>
              {footerValues.map((value, i) => (
                <TableCell
                  key={i}
                  className="text-center font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  {formatCurrency(value, locale, currency)}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CellSumOnlyPopover from "./CellSumOnlyPopover";
import { BUDGET_MOCK } from "../budget.mock";
import ColGroup from "./ColGroup";
import SectionTitle from "./SectionTitle";
import { Row } from "../types";
import { formatCurrency } from "@/utils/currency-utils";

export default function EditableBlock({
  title,
  months,
  rows,
  color,
  footerLabel,
  footerValues,
  onUpdateCell,
  compact = false,
}: {
  title: string;
  months: string[];
  rows: Row[];
  color?: string;
  footerLabel: string;
  footerValues: number[];
  onUpdateCell: (rowId: string, monthIndex: number, nextValueFactory: (current: number) => number) => void;
  compact?: boolean;
}) {

  return (
    <div>
      <SectionTitle label={title} color={color} />
      <div className="overflow-x-auto border rounded-md">
        <Table className="table-fixed w-full">
          <ColGroup months={months} />
          <TableHeader>
            <TableRow className="bg-zinc-900/90 text-white hover:bg-zinc-900/90">
              <TableHead className="w-[240px] text-white">Meses</TableHead>
              {months.map((m) => (
                <TableHead key={m} className="w-[120px] text-right text-white">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-transparent">
                <TableCell className="font-medium">{row.label}</TableCell>
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
                  className="text-right font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  {formatCurrency(value, BUDGET_MOCK.locale, BUDGET_MOCK.currency)}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import ColGroup from "./ColGroup";
import { Row } from "../types";
import { formatCurrency } from "@/utils/currency-utils";
import SectionTitle from "./SectionTitle";

type ReadOnlyBlockProps = {
  title: string;
  months: string[];
  rows: Row[];
  footer?: { label: string; values: number[] };
  color?: string;
  locale?: string;
  currency?: string;
  titleAction?: ReactNode;
};

export default function ReadOnlyBlock({
  title,
  months,
  rows,
  footer,
  color,
  locale,
  currency,
  titleAction,
}: ReadOnlyBlockProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full border border-border text-muted-foreground pointer-events-none"
          aria-hidden="true"
          tabIndex={-1}
        >
          <PiggyBank className="h-4 w-4" />
        </Button>
        <SectionTitle label={title} color={color} />
        {titleAction ? <div className="ml-auto flex items-center">{titleAction}</div> : null}
      </div>
      <div className="overflow-x-auto border rounded-md">
        <Table className="table-fixed w-full">
          <ColGroup months={months} />
          <TableHeader>
            <TableRow className="bg-zinc-900/90 text-white hover:bg-zinc-900/90">
              <TableHead className="text-white">Meses</TableHead>
              {months.map((m) => (
                <TableHead key={m} className="text-center text-white">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="hover:bg-transparent">
                <TableCell className="font-medium">{r.label.toLowerCase()}</TableCell>
                {r.values.map((value, i) => (
                  <TableCell
                    key={i}
                    className="text-center align-middle whitespace-nowrap cursor-not-allowed select-none"
                  >
                    {formatCurrency(value, locale, currency)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {footer && (
            <TableFooter>
              <TableRow className="bg-amber-50 hover:bg-amber-50 dark:bg-amber-900/30 dark:hover:bg-amber-900/30">
                <TableCell className="font-semibold text-zinc-800 dark:text-amber-200">{footer.label}</TableCell>
                {footer.values.map((value, i) => (
                  <TableCell
                    key={i}
                    className="text-center font-semibold whitespace-nowrap text-zinc-800 dark:text-amber-200 cursor-not-allowed select-none"
                  >
                    {formatCurrency(value, locale, currency)}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}

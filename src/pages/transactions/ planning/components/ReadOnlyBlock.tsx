import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SectionTitle from "./SectionTitle";
import ColGroup from "./ColGroup";
import { Row } from "../types";
import { BUDGET_MOCK } from "../budget.mock";

export default function ReadOnlyBlock({ title, months, rows, footer, color }: { title: string; months: string[]; rows: Row[]; footer?: { label: string; values: number[] }; color?: string }) {
  

  function BRL(n: number) {
    return new Intl.NumberFormat(BUDGET_MOCK.locale, { style: "currency", currency: BUDGET_MOCK.currency }).format(n || 0);
  }
  
  return (
    <div>
      <SectionTitle label={title} color={color} />
      <div className="overflow-x-auto border rounded-md">
        <Table className="table-fixed w-full">
          <ColGroup months={months} />
          <TableHeader>
            <TableRow className="bg-zinc-900/90 text-white hover:bg-zinc-900/90">
              <TableHead className="text-white">Meses</TableHead>
              {months.map((m) => (
                <TableHead key={m} className="text-right text-white">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="hover:bg-transparent">
                <TableCell className="font-medium">{r.label}</TableCell>
                {r.values.map((v, i) => (
                  <TableCell key={i} className="text-right align-middle whitespace-nowrap">{BRL(v)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {footer && (
            <TableFooter>
              <TableRow className="bg-amber-50 hover:bg-amber-50 dark:bg-amber-900/30 dark:hover:bg-amber-900/30">
                <TableCell className="font-semibold text-zinc-800 dark:text-amber-200">{footer.label}</TableCell>
                {footer.values.map((v, i) => (
                  <TableCell
                    key={i}
                    className="text-right font-semibold whitespace-nowrap text-zinc-800 dark:text-amber-200"
                  >
                    {BRL(v)}
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
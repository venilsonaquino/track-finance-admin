import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { History } from "lucide-react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { BUDGET_MOCK, MonthKey, SectionEditable } from "./budget.mock";

const MONTH_LABELS_MAP: Record<MonthKey, string> = {
  Jan: "Janeiro",
  Fev: "Fevereiro",
  Mar: "Março",
  Abr: "Abril",
  Mai: "Maio",
  Jun: "Junho",
  Jul: "Julho",
  Ago: "Agosto",
  Set: "Setembro",
  Out: "Outubro",
  Nov: "Novembro",
  Dez: "Dezembro",
};

const LABEL_COL_W = 240; // px
const MONTH_COL_W = 120; // px

function ColGroup({ months }: { months: string[] }) {
  return (
    <colgroup>
      <col style={{ width: `${LABEL_COL_W}px` }} />
      {months.map((_, i) => (
        <col key={i} style={{ width: `${MONTH_COL_W}px` }} />
      ))}
    </colgroup>
  );
}


type Row = {
  id: string;
  label: string;
  values: number[]; // 12 meses
};

function BRL(n: number) {
  return new Intl.NumberFormat(BUDGET_MOCK.locale, { style: "currency", currency: BUDGET_MOCK.currency }).format(n || 0);
}

function parseBRDecimal(v: string) {
  const norm = v.replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
  const n = Number(norm);
  return Number.isFinite(n) ? n : 0;
}

const toValuesArray = (monthOrder: MonthKey[], values: Record<MonthKey, number>) =>
  monthOrder.map((month) => values[month] ?? 0);

type EditableSectionState = {
  id: string;
  title: SectionEditable["title"];
  footerLabel: string;
  rows: Row[];
};

export default function PlanningPage() {
  const monthOrder = BUDGET_MOCK.months;
  const monthLabels = useMemo(() => monthOrder.map((key) => MONTH_LABELS_MAP[key]), [monthOrder]);

  const [editableSections, setEditableSections] = useState<EditableSectionState[]>(() =>
    BUDGET_MOCK.sectionsEditable
      .filter((section): section is SectionEditable => section.kind === "editable")
      .map((section) => ({
        id: section.id,
        title: section.title,
        footerLabel: section.footerLabel,
        rows: section.rows.map((row) => ({
          id: row.id,
          label: row.label,
          values: toValuesArray(monthOrder, row.values),
        })),
      }))
  );

  const computedSection = BUDGET_MOCK.sectionsComputed;

  const totalsBySectionTitle = useMemo(() => {
    const length = monthOrder.length;
    return editableSections.reduce((acc, section) => {
      const totals = Array.from({ length }, (_, idx) =>
        section.rows.reduce((sum, row) => sum + (row.values[idx] || 0), 0)
      );
      acc[section.title] = totals;
      return acc;
    }, {} as Partial<Record<SectionEditable["title"], number[]>>);
  }, [editableSections, monthOrder]);

  const computedRows = (computedSection?.rows ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    values: totalsBySectionTitle[row.refSectionTitle] ?? monthOrder.map(() => 0),
  }));

  const saldoValues = useMemo(
    () =>
      monthOrder.map((_, monthIdx) =>
        computedRows.reduce((acc, row, rowIndex) =>
          rowIndex === 0 ? row.values[monthIdx] : acc - (row.values[monthIdx] || 0),
        0)
      ),
    [computedRows, monthOrder]
  );

  const updateCell = (
    sectionId: string,
    rowId: string,
    monthIndex: number,
    nextValueFactory: (current: number) => number
  ) => {
    setEditableSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          rows: section.rows.map((row) => {
            if (row.id !== rowId) return row;
            const currentValue = row.values[monthIndex] || 0;
            const nextValue = nextValueFactory(currentValue);
            return {
              ...row,
              values: row.values.map((value, idx) => (idx === monthIndex ? nextValue : value)),
            };
          }),
        };
      })
    );
  };

  return (
		<>
		<PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Planejamento", href: "/transacoes/planejamento" }]} />
		<div className="flex justify-between items-center">
      <Card className="shadow-sm">
        <CardContent className="space-y-6">
          <ReadOnlyBlock
            title="SALDO"
            months={monthLabels}
            rows={computedRows}
            footer={computedSection?.footer ? { label: computedSection.footer.label, values: saldoValues } : undefined}
          />
          {editableSections.map((section) => (
            <EditableBlock
              key={section.id}
              title={section.title}
              months={monthLabels}
              rows={section.rows}
              footerLabel={section.footerLabel}
              footerValues={totalsBySectionTitle[section.title] ?? monthOrder.map(() => 0)}
              onUpdateCell={(rowId, monthIndex, factory) => updateCell(section.id, rowId, monthIndex, factory)}
            />
          ))}
        </CardContent>
      </Card>
		</div>
		</>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="border-l-8 border-zinc-700 h-6 rounded-sm" />
      <div className="tracking-wide text-sm font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

function ReadOnlyBlock({ title, months, rows, footer }: { title: string; months: string[]; rows: Row[]; footer?: { label: string; values: number[] } }) {
  return (
    <div>
      <SectionTitle label={title} />
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

function EditableBlock({
  title,
  months,
  rows,
  footerLabel,
  footerValues,
  onUpdateCell,
  compact = false,
}: {
  title: string;
  months: string[];
  rows: Row[];
  footerLabel: string;
  footerValues: number[];
  onUpdateCell: (rowId: string, monthIndex: number, nextValueFactory: (current: number) => number) => void;
  compact?: boolean;
}) {
  return (
    <div>
      <SectionTitle label={title} />
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
              {footerValues.map((v, i) => (
                <TableCell
                  key={i}
                  className="text-right font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  {BRL(v)}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

// Célula que SEMPRE soma: mostra o valor atual e usa Popover para inserir incrementos
function CellSumOnlyPopover({ value, onAdd, onUndo, compact = false }: { value: number; onAdd: (delta: number) => void; onUndo: (delta: number) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]); // histórico local por célula

  const commit = () => {
    const delta = parseBRDecimal(temp);
    if (delta > 0) {
      onAdd(delta);
      setHistory((h) => [delta, ...h].slice(0, 5));
      setFlash(`+ ${BRL(delta)}`);
      setTimeout(() => setFlash(null), 900);
      setTemp("");
    }
  };

  const undoLast = () => {
    if (!history.length) return;
    const [last, ...rest] = history;
    onUndo(last);
    setHistory(rest);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            readOnly
            className={`text-right ${compact ? "h-8" : "h-9"} w-full`}
            value={BRL(value)}
            placeholder="0,00"
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end" sideOffset={6}>
          <div className="text-xs text-muted-foreground mb-2">Somar nesta célula</div>
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              inputMode="decimal"
              className={`text-right ${compact ? "h-8" : "h-9"}`}
              placeholder="0,00"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setOpen(false);
              }}
            />
            <Button size="sm" className={`${compact ? "h-8" : "h-9"}`} onClick={commit}>Adicionar</Button>
          </div>
          {/* Histórico local resumido e Undo do último */}
          <div className="mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <History className="w-3.5 h-3.5" /> últimos lançamentos
            </div>
            {history.length === 0 ? (
              <div className="text-xs text-muted-foreground mt-1">Nenhum lançamento ainda.</div>
            ) : (
              <ul className="mt-1 max-h-24 overflow-auto pr-1 space-y-1">
                {history.map((h, i) => (
                  <li key={i} className="text-xs flex items-center justify-between bg-muted/40 rounded px-2 py-1">
                    <span>{BRL(h)}</span>
                    {i === 0 && (
                      <button onClick={undoLast} className="text-[11px] underline">desfazer</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Feedback visual de soma sem mexer no layout da célula */}
      {flash && (
        <span className="pointer-events-none absolute -top-5 right-2 text-xs font-medium text-emerald-500 opacity-0 animate-[fadeUp_0.9s_ease-out_forwards]">
          {flash}
        </span>
      )}

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(6px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

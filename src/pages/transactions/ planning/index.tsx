import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Plus, History } from "lucide-react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";

// =============================================
// Planilha estilo imagem com "Somar" rápido para mobile (com Popover)
// - Célula exibe o total atual (readOnly)
// - Botão "Adicionar" abre um Popover compacto para digitar acréscimos
// - Popover mostra histórico recente (local) e Undo do último
// - Sempre SOMA (não subtrai)
// =============================================

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

// Larguras fixas para alinhar todas as tabelas
const LABEL_COL_W = 240; // px
const MONTH_COL_W = 120; // px

function ColGroup() {
  return (
    <colgroup>
      <col style={{ width: `${LABEL_COL_W}px` }} />
      {MONTHS.map((_, i) => (
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

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

function BRL(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
}

function parseBRDecimal(v: string) {
  // aceita 1.234,56 ou 1234.56
  const norm = v.replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
  const n = Number(norm);
  return Number.isFinite(n) ? n : 0;
}

export default function BudgetSheetQuickAddPopover() {
  const [incomes, setIncomes] = useState<Row[]>([
    { id: uuid(), label: "Salário", values: Array(12).fill(0) },
    { id: uuid(), label: "Fonte 2", values: Array(12).fill(0) },
    { id: uuid(), label: "Fonte 3", values: Array(12).fill(0) },
    { id: uuid(), label: "Fonte 4", values: Array(12).fill(0) },
  ]);

  const [essentials, setEssentials] = useState<Row[]>([
    { id: uuid(), label: "Aluguel/Financiamento", values: Array(12).fill(0) },
    { id: uuid(), label: "Condomínio", values: Array(12).fill(0) },
    { id: uuid(), label: "IPTU", values: Array(12).fill(0) },
    { id: uuid(), label: "Alimentação", values: Array(12).fill(0) },
    { id: uuid(), label: "Conta de luz", values: Array(12).fill(0) },
    { id: uuid(), label: "Conta de Internet", values: Array(12).fill(0) },
    { id: uuid(), label: "Assinatura de TV", values: Array(12).fill(0) },
    { id: uuid(), label: "Conta de água", values: Array(12).fill(0) },
    { id: uuid(), label: "Gás", values: Array(12).fill(0) },
    { id: uuid(), label: "Água potável", values: Array(12).fill(0) },
    { id: uuid(), label: "Inglês", values: Array(12).fill(0) },
    { id: uuid(), label: "Consertos e manutenção", values: Array(12).fill(0) },
    { id: uuid(), label: "Transporte", values: Array(12).fill(0) },
  ]);

  const [debts, setDebts] = useState<Row[]>([
    { id: uuid(), label: "Dívidas/Poupar", values: Array(12).fill(0) },
  ]);
  const [others, setOthers] = useState<Row[]>([
    { id: uuid(), label: "Outros Gastos", values: Array(12).fill(0) },
  ]);

  const totals = useMemo(() => {
    const sumCols = (rows: Row[]) => MONTHS.map((_, m) => rows.reduce((acc, r) => acc + (r.values[m] || 0), 0));
    const tIncomes = sumCols(incomes);
    const tEssentials = sumCols(essentials);
    const tDebts = sumCols(debts);
    const tOthers = sumCols(others);
    const saldo = MONTHS.map((_, m) => tIncomes[m] - tEssentials[m] - tDebts[m] - tOthers[m]);
    return { tIncomes, tEssentials, tDebts, tOthers, saldo };
  }, [incomes, essentials, debts, others]);

  return (
		<>
		<PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Movimentações", href: "/transacoes/movimentacoes" }]} />
		<div className="flex justify-between items-center">
      <Card className="shadow-sm">
        <CardContent className="space-y-6">
          <ReadOnlyBlock
            title="SALDO"
            rows={[
              { id: "r-Receitas", label: "Receitas", values: totals.tIncomes },
              { id: "r-Essenciais", label: "Gastos Essenciais", values: totals.tEssentials },
              { id: "r-Dividas", label: "Dívidas/Poupar", values: totals.tDebts },
              { id: "r-Outros", label: "Outros Gastos", values: totals.tOthers },
            ]}
            footer={{ label: "Saldo", values: totals.saldo }}
          />

          <EditableBlock title="RECEITAS" rows={incomes} setRows={setIncomes} footerLabel="Total receitas" footerValues={totals.tIncomes} />
          <EditableBlock title="GASTOS ESSENCIAIS" rows={essentials} setRows={setEssentials} footerLabel="Total essenciais" footerValues={totals.tEssentials} />

          <div className="grid md:grid-cols-2 gap-6">
            <EditableBlock title="DÍVIDAS / POUPAR" rows={debts} setRows={setDebts} footerLabel="Total dívidas/poupar" footerValues={totals.tDebts} compact />
            <EditableBlock title="OUTROS GASTOS" rows={others} setRows={setOthers} footerLabel="Total outros" footerValues={totals.tOthers} compact />
          </div>
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

function ReadOnlyBlock({ title, rows, footer }: { title: string; rows: Row[]; footer?: { label: string; values: number[] } }) {
  return (
    <div>
      <SectionTitle label={title} />
      <div className="overflow-x-auto border rounded-md">
        <Table className="table-fixed w-full">
          <ColGroup />
          <TableHeader>
            <TableRow className="bg-zinc-900/90 text-white">
              <TableHead className="text-white">Meses</TableHead>
              {MONTHS.map((m) => (
                <TableHead key={m} className="text-right text-white">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.label}</TableCell>
                {r.values.map((v, i) => (
                  <TableCell key={i} className="text-right align-middle whitespace-nowrap">{BRL(v)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {footer && (
            <TableFooter>
              <TableRow className="bg-amber-50">
                <TableCell className="font-semibold">{footer.label}</TableCell>
                {footer.values.map((v, i) => (
                  <TableCell key={i} className="text-right font-semibold whitespace-nowrap">{BRL(v)}</TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}

function EditableBlock({ title, rows, setRows, footerLabel, footerValues, compact = false }: { title: string; rows: Row[]; setRows: React.Dispatch<React.SetStateAction<Row[]>>; footerLabel: string; footerValues: number[]; compact?: boolean }) {
  const updateCell = (rowId: string, monthIndex: number, nextValue: number) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, values: r.values.map((v, i) => (i === monthIndex ? nextValue : v)) } : r)));
  };

  return (
    <div>
      <SectionTitle label={title} />
      <div className="overflow-x-auto border rounded-md">
        <Table className="table-fixed w-full">
          <ColGroup />
          <TableHeader>
            <TableRow className="bg-zinc-900/90 text-white">
              <TableHead className="w-[240px] text-white">Meses</TableHead>
              {MONTHS.map((m) => (
                <TableHead key={m} className="w-[120px] text-right text-white">{m}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.label}</TableCell>
                {MONTHS.map((_, mi) => (
                  <TableCell key={mi} className="text-right align-middle">
                    <CellSumOnlyPopover
                      value={row.values[mi] || 0}
                      onAdd={(delta) => updateCell(row.id, mi, (row.values[mi] || 0) + delta)}
                      onUndo={(delta) => updateCell(row.id, mi, Math.max(0, (row.values[mi] || 0) - delta))}
                      compact={compact}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-zinc-100">
              <TableCell className="font-semibold">{footerLabel}</TableCell>
              {footerValues.map((v, i) => (
                <TableCell key={i} className="text-right font-semibold">{BRL(v)}</TableCell>
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
        {/* O INPUT age como TRIGGER: nada aparece até clicar (estilo Excel) */}
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
              placeholder="31,20"
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

// budget.mock.ts
// Mock "backend-like" para a tela de Planilha Rápida

export type MonthKey =
  | "Jan" | "Fev" | "Mar" | "Abr" | "Mai" | "Jun"
  | "Jul" | "Ago" | "Set" | "Out" | "Nov" | "Dez";

export type ValuesByMonth = Record<MonthKey, number>; // ótimo para gráficos

export type RowItem = {
  id: string;           // ULID
  label: string;
  values: ValuesByMonth; // 12 meses, número absoluto (sempre soma)
};

export type SectionEditable = {
  id: string;           // ULID
  title: string;
  kind: "editable";
  color?: string;      // opcional: cor de fundo suave
  rows: RowItem[];
  footerLabel: string;
};

export type SectionComputed = {
  id: string;           // ULID
  title: string;
  kind: "computed";
  color: string;       
  rows: Array<{
    id: string;         // ULID
    label: string;
    refSectionTitle: SectionEditable["title"];
    agg: string;
  }>;
  footer: {
    label: string;
    formula: string;
  };
};

export type BudgetPayload = {
  version: number;
  year: number;
  currency: string;
  locale: string;
  months: MonthKey[];

  sectionsEditable: SectionEditable[];
  sectionsComputed: SectionComputed;
};

// Helper para criar um “vetor de meses” zerado
const zeroYear = (): ValuesByMonth => ({
  Jan: 0, Fev: 0, Mar: 0, Abr: 0, Mai: 0, Jun: 0,
  Jul: 0, Ago: 0, Set: 0, Out: 0, Nov: 0, Dez: 0,
});

export const BUDGET_MOCK: BudgetPayload = {
  version: 1,
  year: 2025,
  locale: "pt-BR",
  currency: "BRL",
  months: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  sectionsComputed: {
    id: "01JB9QF7D0SALDO0000001",
    title: "SALDO",
    kind: "computed",
    color: "zinc-900",
    rows: [
      { id: "01JB9QF7D0RECEITAS001", label: "Receitas",           refSectionTitle: "RECEITAS",          agg: "sum" },
      { id: "01JB9QF7D0ESSENC001", label: "Gastos Essenciais",  refSectionTitle: "GASTOS ESSENCIAIS", agg: "sum" },
      { id: "01JB9QF7D0DIVPOUP01",  label: "Dívidas/Poupar",     refSectionTitle: "DÍVIDAS/POUPAR",    agg: "sum" },
      { id: "01JB9QF7D0OUTROS001",  label: "Outros Gastos",      refSectionTitle: "OUTROS GASTOS",     agg: "sum" },
    ],
    footer: {
      label: "Saldo",
      formula: "Receitas - Gastos Essenciais - Dívidas/Poupar - Outros Gastos",
    },
  },
  sectionsEditable: [
    {
      id: "01JB9QF7D0RECEITAS001",
      title: "RECEITAS",
      kind: "editable",
      color: "emerald-50",
      footerLabel: "Total receitas",
      rows: [
        { id: "01JB9QF7D0REC001SAL", label: "Salário", values: zeroYear() }
      ],
    },
    {
      id: "01JB9QF7D0ESSENC001",
      title: "GASTOS ESSENCIAIS",
      kind: "editable",
      color: "red-50",
      footerLabel: "Total essenciais",
      rows: [
        // { id: "01JB9QF7D0ESS001", label: "Aluguel/Financiamento", values: zeroYear() },
        // { id: "01JB9QF7D0ESS002", label: "Condomínio",            values: zeroYear() },
        { id: "01JB9QF7D0ESS003", label: "IPTU",                  values: zeroYear() },
        { id: "01JB9QF7D0ESS004", label: "Alimentação",           values: zeroYear() },
        // { id: "01JB9QF7D0ESS005", label: "Conta de luz",          values: zeroYear() },
        // { id: "01JB9QF7D0ESS006", label: "Conta de Internet",     values: zeroYear() },
        // { id: "01JB9QF7D0ESS007", label: "Assinatura de TV",      values: zeroYear() },
        // { id: "01JB9QF7D0ESS008", label: "Conta de água",         values: zeroYear() },
        // { id: "01JB9QF7D0ESS009", label: "Gás",                   values: zeroYear() },
        // { id: "01JB9QF7D0ESS010", label: "Água potável",          values: zeroYear() },
        // { id: "01JB9QF7D0ESS011", label: "Inglês",                values: zeroYear() },
        // { id: "01JB9QF7D0ESS012", label: "Consertos e manutenção",values: zeroYear() },
        { id: "01JB9QF7D0ESS013", label: "Transporte",            values: zeroYear() },
      ],
    },
    {
      id: "01JB9QF7D0DIVPOUP01",
      title: "DÍVIDAS/POUPAR",
      kind: "editable",
      color: "zinc-900",
      footerLabel: "Total dívidas/poupar",
      rows: [
        { id: "01JB9QF7D0DIV001", label: "Dívidas/Poupar", values: zeroYear() },
      ],
    },
    {
      id: "01JB9QF7D0OUTROS001",
      title: "OUTROS GASTOS",
      kind: "editable",
      color: "blue-50",
      footerLabel: "Total outros",
      rows: [
        { id: "01JB9QF7D0OUT001", label: "Outros Gastos", values: zeroYear() },
      ],
    },
  ],
};
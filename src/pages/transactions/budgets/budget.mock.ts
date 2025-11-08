import { BudgetPayload, ValuesByMonth } from "./types";

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
    color: "border-zinc-900",
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
      color: "border-emerald-500",
      footerLabel: "Total receitas",
      rows: [
        { id: "01JB9QF7D0REC001SAL", label: "Salário", values: { Jan: 300, Fev: 250, Mar: 350, Abr: 280, Mai: 320, Jun: 260, Jul: 380, Ago: 290, Set: 310, Out: 330, Nov: 270, Dez: 400 } }
      ],
    },
    {
      id: "01JB9QF7D0ESSENC001",
      title: "GASTOS ESSENCIAIS",
      kind: "editable",
      color: "border-red-500",
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
      color: "border-yellow-500",
      footerLabel: "Total dívidas/poupar",
      rows: [
        { id: "01JB9QF7D0DIV001", label: "Dívidas/Poupar", values: zeroYear() },
      ],
    },
    {
      id: "01JB9QF7D0OUTROS001",
      title: "OUTROS GASTOS",
      kind: "editable",
      color: "border-blue-500",
      footerLabel: "Total outros",
      rows: [
        { id: "01JB9QF7D0OUT001", label: "Outros Gastos", values: zeroYear() },
      ],
    },
  ],
};
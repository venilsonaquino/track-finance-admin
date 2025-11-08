// finance-sections.mock.ts
// Mock estruturado para UI de finanças
// inclui o campo "kind" para semântica de cada linha

export const FINANCE_SECTIONS = [
  {
    id: "01JAFSALDO0000000001",
    title: "SALDO",
    color: "#000000",
    rows: [
      { id: "01JAFSALDORECEITAS01", label: "Receitas", kind: "link" },
      { id: "01JAFSALDOGASTOS01", label: "Gastos Essenciais", kind: "link" },
      { id: "01JAFSALDODIVPOUP01", label: "Dívidas/Poupar", kind: "link" },
      { id: "01JAFSALDOOUTROS01", label: "Outros Gastos", kind: "link" },
      { id: "01JAFSALDOTOTAL001", label: "Saldo", kind: "total" },
    ]
  },
  {
    id: "01JAFRECEITAS00000001",
    title: "RECEITAS",
    color: "#39aa2aff",
    rows: [
      { id: "01JAFSALARIO0000001", label: "Salário", kind: "income" },
      { id: "01JAFFONTE20000001", label: "Fonte 2", kind: "income" },
      { id: "01JAFFONTE30000001", label: "Fonte 3", kind: "income" },
      { id: "01JAFFONTE40000001", label: "Fonte 4", kind: "income" },
      { id: "01JAFTOTALRECEITA01", label: "Total receitas", kind: "total" },
      { id: "01JAFPCTRECEITA01", label: "% sobre Receita", kind: "metric" }
    ]
  },
  {
    id: "01JAFESSENCIAIS000001",
    title: "GASTOS ESSENCIAIS",
    color: "#ff6347ff",
    rows: [
      { id: "01JAFALUGUEL0000001", label: "Aluguel/Financiamento", kind: "expense" },
      { id: "01JAFCONDOMINIO00001", label: "Condomínio", kind: "expense" },
      { id: "01JAFIPTU0000000001", label: "IPTU", kind: "expense" },
      { id: "01JAFALIMENTACAO0001", label: "Alimentação", kind: "expense" },
      { id: "01JAFLUZ0000000001", label: "Conta de luz", kind: "expense" },
      { id: "01JAFINTERNET000001", label: "Conta de Internet", kind: "expense" },
      { id: "01JAFTV00000000001", label: "Assinatura de TV", kind: "expense" },
      { id: "01JAFAGUA000000001", label: "Conta de água", kind: "expense" },
      { id: "01JAFGAS0000000001", label: "Gás", kind: "expense" },
      { id: "01JAFAPOTAVEL00001", label: "Água potável", kind: "expense" },
      { id: "01JAFINGLES00000001", label: "Inglês", kind: "expense" },
      { id: "01JAFCONSERTO000001", label: "Consertos e manutenção", kind: "expense" },
      { id: "01JAFTRANSP0000001", label: "Transporte", kind: "expense" },
      { id: "01JAFTOTALGASTOS01", label: "Total gastos essenciais", kind: "total" },
      { id: "01JAFPCTGASTOS01", label: "% sobre Receita", kind: "metric" }
    ]
  },
  {
    id: "01JAFDIVPOUPAR000001",
    title: "DÍVIDAS/POUPAR",
    color: "#ff1e3cff",
    rows: [
      { id: "01JAFDIVIDA00000001", label: "Dívidas", kind: "expense" },
      { id: "01JAFINVEST0000001", label: "Investimento", kind: "expense" },
      { id: "01JAFTOTALDIVPOUP01", label: "Total Dívidas/Poupar", kind: "total" },
      { id: "01JAFPCTDIVPOUP01", label: "% sobre Receita", kind: "metric" }
    ]
  },
  {
    id: "01JAFOUTROS00000001",
    title: "OUTROS GASTOS",
    color: "#ffa500ff",
    rows: [
      { id: "01JAFRESTLANCHE0001", label: "Restaurantes/Lanches", kind: "expense" },
      { id: "01JAFVIAGEM00000001", label: "Viagens/Passeio", kind: "expense" },
      { id: "01JAFCOMPRINHA00001", label: "Comprinhas", kind: "expense" },
      { id: "01JAFPRESENTE00001", label: "Presentes", kind: "expense" },
      { id: "01JAFAJUDAFAM00001", label: "Ajuda na família", kind: "expense" },
      { id: "01JAFTOTALLAZER0001", label: "Total Lazer", kind: "total" },
      { id: "01JAFPCTLAZER0001", label: "% sobre Receita", kind: "metric" }
    ]
  }
] as const;
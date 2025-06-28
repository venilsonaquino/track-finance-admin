export interface Bank {
  id: string;
  name: string;
  logo: string;
  code?: string;
  color?: string;
}

export const BANKS: Bank[] = [
  {
    id: "abc-brasil",
    name: "ABC Brasil",
    logo: "/images/bancos/ABC Brasil/logoabc.svg",
    code: "ABC",
    color: "#00529B"
  },
  {
    id: "ailos",
    name: "Ailos",
    logo: "/images/bancos/Ailos/logo-ailos.svg",
    code: "AILOS",
    color: "#007D3D"
  },
  {
    id: "asaas",
    name: "Asaas IP S.A",
    logo: "/images/bancos/Asaas IP S.A/header-logo-azul.svg",
    code: "ASAAS",
    color: "#0057FF"
  },
  {
    id: "bs2",
    name: "Banco BS2 S.A",
    logo: "/images/bancos/Banco BS2 S.A/Banco_BS2.svg",
    code: "BS2",
    color: "#0033A0"
  },
  {
    id: "btg-pactual",
    name: "Banco BTG Pactual",
    logo: "/images/bancos/Banco BTG Pacutal/btg-pactual.svg",
    code: "BTG",
    color: "#003366"
  },
  {
    id: "c6",
    name: "Banco C6 S.A",
    logo: "/images/bancos/Banco C6 S.A/c6 bank.svg",
    code: "C6",
    color: "#222222"
  },
  {
    id: "banco-amazonia",
    name: "Banco da Amazônia S.A",
    logo: "/images/bancos/Banco da Amazônia S.A/banco-da-amazonia.svg",
    code: "BASA",
    color: "#009739"
  },
  {
    id: "daycoval",
    name: "Banco Daycoval",
    logo: "/images/bancos/Banco Daycoval/logo-Daycoval- maior.svg",
    code: "DAYCOVAL",
    color: "#003366"
  },
  {
    id: "banco-brasil",
    name: "Banco do Brasil S.A",
    logo: "/images/bancos/Banco do Brasil S.A/banco-do-brasil-sem-fundo.svg",
    code: "BB",
    color: "#FFCC29"
  },
  {
    id: "banestes",
    name: "Banco do Estado do Espírito Santo",
    logo: "/images/bancos/Banco do Estado do Espirito Santo/banestes.svg",
    code: "BANESTES",
    color: "#0072BC"
  },
  {
    id: "banpara",
    name: "Banco do Estado do Pará",
    logo: "/images/bancos/Banco do Estado do Para/Logo_do_Banpará.svg",
    code: "BANPARA",
    color: "#E30613"
  },
  {
    id: "banese",
    name: "Banco do Estado do Sergipe",
    logo: "/images/bancos/Banco do Estado do Sergipe/logo banese.svg",
    code: "BANESE",
    color: "#00995D"
  },
  {
    id: "bnb",
    name: "Banco do Nordeste do Brasil S.A",
    logo: "/images/bancos/Banco do Nordeste do Brasil S.A/Logo_BNB.svg",
    code: "BNB",
    color: "#7C2B1B"
  },
  {
    id: "bib",
    name: "Banco Industrial do Brasil S.A",
    logo: "/images/bancos/Banco Industrial do Brasil S.A/BIB-logo-azul.svg",
    code: "BIB",
    color: "#0033A0"
  },
  {
    id: "banco-inter",
    name: "Banco Inter S.A",
    logo: "/images/bancos/Banco Inter S.A/inter.svg",
    code: "INTER",
    color: "#FF6600"
  },
  {
    id: "mercantil",
    name: "Banco Mercantil do Brasil S.A",
    logo: "/images/bancos/Banco Mercantil do Brasil S.A/banco-mercantil-novo-azul.svg",
    code: "MERCANTIL",
    color: "#003366"
  },
  {
    id: "original",
    name: "Banco Original S.A",
    logo: "/images/bancos/Banco Original S.A/banco-original-logo-verde.svg",
    code: "ORIGINAL",
    color: "#00B488"
  },
  {
    id: "pine",
    name: "Banco Pine",
    logo: "/images/bancos/Banco Pine/banco-pine.svg",
    code: "PINE",
    color: "#005B4F"
  },
  {
    id: "rendimento",
    name: "Banco Rendimento",
    logo: "/images/bancos/Banco Rendimento/banco rendimento logo nova .svg",
    code: "RENDIMENTO",
    color: "#003366"
  },
  {
    id: "safra",
    name: "Banco Safra S.A",
    logo: "/images/bancos/Banco Safra S.A/logo-safra.svg",
    code: "SAFRA",
    color: "#2C2955"
  },
  {
    id: "santander",
    name: "Banco Santander Brasil S.A",
    logo: "/images/bancos/Banco Santander Brasil S.A/banco-santander-logo.svg",
    code: "SANTANDER",
    color: "#EC0000"
  },
  {
    id: "sofisa",
    name: "Banco Sofisa",
    logo: "/images/bancos/Banco Sofisa/logo-sofisa.svg",
    code: "SOFISA",
    color: "#F58220"
  },
  {
    id: "topazio",
    name: "Banco Topazio",
    logo: "/images/bancos/Banco Topazio/logo-banco-topazio.svg",
    code: "TOPAZIO",
    color: "#0072BC"
  },
  {
    id: "tribanco",
    name: "Banco Triângulo - Tribanco",
    logo: "/images/bancos/Banco Triângulo - Tribanco/logotribanco.svg",
    code: "TRIBANCO",
    color: "#7C2B1B"
  },
  {
    id: "bank-of-america",
    name: "Bank of America",
    logo: "/images/bancos/Bank of America/bankofamerica-logo.svg",
    code: "BOA",
    color: "#012169"
  },
  {
    id: "banrisul",
    name: "Banrisul",
    logo: "/images/bancos/Banrisul/banrisul-logo-2023.svg",
    code: "BANRISUL",
    color: "#009DDC"
  },
  {
    id: "bradesco",
    name: "Bradesco S.A",
    logo: "/images/bancos/Bradesco S.A/bradesco.svg",
    code: "BRADESCO",
    color: "#B22234"
  },
  {
    id: "brb",
    name: "BRB - Banco de Brasília",
    logo: "/images/bancos/BRB - Banco de Brasilia/brb-logo-abreviado.svg",
    code: "BRB",
    color: "#0033A0"
  },
  {
    id: "caixa",
    name: "Caixa Econômica Federal",
    logo: "/images/bancos/Caixa Econômica Federal/caixa-economica-federal-X.svg",
    code: "CAIXA",
    color: "#005CA9"
  },
  {
    id: "capitual",
    name: "Capitual",
    logo: "/images/bancos/Capitual/logo capitual.svg",
    code: "CAPITUAL",
    color: "#F9B233"
  },
  {
    id: "conta-simples",
    name: "Conta Simples Soluções em Pagamentos",
    logo: "/images/bancos/Conta Simples Soluções em Pagamentos/conta-simples_logo.svg",
    code: "CONTA_SIMPLES",
    color: "#2D9CDB"
  },
  {
    id: "cora",
    name: "Cora Sociedade Crédito Direto S.A",
    logo: "/images/bancos/Cora Sociedade Credito Direto S.A/icone-cora-rosa-2500px.svg",
    code: "CORA",
    color: "#FF4A8A"
  },
  {
    id: "credisis",
    name: "Credisis",
    logo: "/images/bancos/Credisis/credisis.svg",
    code: "CREDISIS",
    color: "#00995D"
  },
  {
    id: "cresol",
    name: "Cresol",
    logo: "/images/bancos/Cresol/Icone-original.svg",
    code: "CRESOL",
    color: "#F7931E"
  },
  {
    id: "efi",
    name: "Efí - Gerencianet",
    logo: "/images/bancos/Efí - Gerencianet/logo-efi-bank-laranja-nome.svg",
    code: "EFI",
    color: "#FF6B00"
  },
  {
    id: "grafeno",
    name: "Grafeno",
    logo: "/images/bancos/Grafeno/grafeno.svg",
    code: "GRAFENO",
    color: "#1A1A1A"
  },
  {
    id: "itau",
    name: "Itaú Unibanco S.A",
    logo: "/images/bancos/Itaú Unibanco S.A/itau-fundo-azul.svg",
    code: "ITAU",
    color: "#FF6600"
  },
  {
    id: "lets-bank",
    name: "Lets Bank S.A",
    logo: "/images/bancos/Lets Bank S.A/Logo Letsbank.svg",
    code: "LETSBANK",
    color: "#0057FF"
  },
  {
    id: "mercado-pago",
    name: "Mercado Pago",
    logo: "/images/bancos/Mercado Pago/mercado-pago.svg",
    code: "MERCADO_PAGO",
    color: "#009EE3"
  },
  {
    id: "nubank",
    name: "Nu Pagamentos S.A",
    logo: "/images/bancos/Nu Pagamentos S.A/nubank-logo-2021.svg",
    code: "NUBANK",
    color: "#8A05BE"
  },
  {
    id: "omie",
    name: "Omie.Cash",
    logo: "/images/bancos/Omie.Cash/omie.svg",
    code: "OMIE",
    color: "#00B5E2"
  },
  {
    id: "pagseguro",
    name: "PagSeguro Internet S.A",
    logo: "/images/bancos/PagSeguro Internet S.A/logo.svg",
    code: "PAGSEGURO",
    color: "#FFC800"
  },
  {
    id: "quality",
    name: "Quality Digital Bank",
    logo: "/images/bancos/Quality Digital Bank/quality-logo-branco.svg",
    code: "QUALITY",
    color: "#1A1A1A"
  },
  {
    id: "sicoob",
    name: "Sicoob",
    logo: "/images/bancos/Sicoob/sicoob-vector-logo.svg",
    code: "SICOOB",
    color: "#006633"
  },
  {
    id: "sicredi",
    name: "Sicredi",
    logo: "/images/bancos/Sicredi/logo-svg2.svg",
    code: "SICREDI",
    color: "#8DC63F"
  },
  {
    id: "stone",
    name: "Stone Pagamentos S.A",
    logo: "/images/bancos/Stone Pagamentos S.A/stone.svg",
    code: "STONE",
    color: "#16B455"
  },
  {
    id: "unicred",
    name: "Unicred",
    logo: "/images/bancos/Unicred/unicred-centralizada.svg",
    code: "UNICRED",
    color: "#B59A3A"
  },
  {
    id: "uniprime",
    name: "Uniprime",
    logo: "/images/bancos/Uniprime/uniprime.svg",
    code: "UNIPRIME",
    color: "#003366"
  }
];

export const getBankById = (id: string): Bank | undefined => {
  return BANKS.find(bank => bank.id === id);
};

export const getBankByName = (name: string): Bank | undefined => {
  return BANKS.find(bank => 
    bank.name.toLowerCase().includes(name.toLowerCase()) ||
    bank.code?.toLowerCase().includes(name.toLowerCase())
  );
}; 
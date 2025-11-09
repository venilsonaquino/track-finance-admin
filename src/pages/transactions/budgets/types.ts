export type Row = {
  id: string;
  label: string;
  values: number[]; // 12 meses
};

export type EditableSectionState = {
  id: string;
  color?: string;
  title: SectionEditable["title"];
  footerLabel: string;
  rows: Row[];
};

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

export type Category = { id: string; name: string; color: string };
export type Group = { id: string; name: string; color: string };
export type CategoryIdsByGroup = Record<string, string[]>;
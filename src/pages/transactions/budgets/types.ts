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

export type ValuesByMonth = Record<MonthKey, number>; 

export type RowItem = {
  id: string;
  label: string;
  values: ValuesByMonth;
};

export type SectionEditable = {
  id: string;
  title: string;
  kind: "editable";
  color?: string;
  rows: RowItem[];
  footerLabel: string;
};

export type SectionComputed = {
  id: string;
  title: string;
  kind: "computed";
  color: string;       
  rows: Array<{
    id: string;
    label: string;
    refSectionTitle: SectionEditable["title"];
  }>;
  footerLabel: string;
};

export type BudgetPayloadResponse = {
  version: number;
  year: number;
  currency: string;
  locale: string;
  months: MonthKey[];

  sectionsEditable: SectionEditable[];
  sectionsComputed: SectionComputed;
};


export type Category = { id: string; name: string; color: string };
export type Group = { id: string; title: string; color: string; kind: string; footerLabel: string; categories: Category[] };
type AssignmentItem = {categoryId: string; budgetGroupId?: string | null;}
export type SyncCategoryAssignments = { assignments: AssignmentItem[] }

export type CategoryIdsByGroup = Record<string, string[]>;
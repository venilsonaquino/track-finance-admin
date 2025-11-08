import { SectionEditable } from "./budget.mock";

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
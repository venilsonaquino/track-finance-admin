export default function ColGroup({ months }: { months: string[] }) {

  const LABEL_COL_W = 240; // px
  const MONTH_COL_W = 120; // px

  return (
    <colgroup>
      <col style={{ width: `${LABEL_COL_W}px` }} />
      {months.map((_, i) => (
        <col key={i} style={{ width: `${MONTH_COL_W}px` }} />
      ))}
    </colgroup>
  );
}
type SectionTitleProps = {
  label: string;
  color?: string;
};

export default function SectionTitle({ label, color }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className={`border-l-8 h-6 rounded-sm ${color ? color : 'border-zinc-700'}`} />
      <div className="tracking-wide text-sm font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}
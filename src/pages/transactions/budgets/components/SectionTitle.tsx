type SectionTitleProps = {
  label: string;
  color?: string;
};

export default function SectionTitle({ label, color }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color || "var(--primary)" }}
      />
      <span className="tracking-wide text-sm font-semibold text-muted-foreground leading-none">
        {label.toUpperCase()}
      </span>
    </div>
  );
}

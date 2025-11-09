import { Check, ChevronDown } from "lucide-react";
import { Category, Group } from "../types";
import { Badge } from "@/components/ui/badge";

export function CategoryCardSheet({
  cat, selected, onToggle, draggable, onDragStart,
}: {
  cat: Category;
  selected: boolean;
  onToggle: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <button
      key={cat.id}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onToggle}
      className={[
        "w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left transition",
        "hover:bg-muted/50",
        selected ? "border-blue-200 bg-blue-50/50" : "border-border",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
        <span className="text-sm font-medium">{cat.name}</span>
      </div>
      {selected && <Check className="h-4 w-4 text-blue-600" />}
    </button>
  );
}

export function GroupCardSheet({
  group,
  count,
  open,
  onToggle,
  children,
  dragState,
  onDragOver,
  onDrop,
  onDragLeave,
}: {
  group: Group;
  count: number;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  dragState?: "over" | "pulse" | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}) {
  const ring = dragState === "over" ? "ring-2 ring-blue-200" : "";

  return (
    <div
      className={`rounded-xl border bg-background ${ring}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-t-xl"
        style={{ borderLeft: `4px solid ${group.color}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{group.name}</span>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t px-3 py-2 text-sm text-muted-foreground rounded-b-xl">
          {count === 0 ? (
            <div className="px-3 py-6 text-center border-dashed">
              Solte categorias aqui ou use “Mover”.
            </div>
          ) : (
            <div className="space-y-2">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
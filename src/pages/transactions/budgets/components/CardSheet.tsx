import { Check, ChevronDown } from "lucide-react";
import { Category, Group } from "../types";
import { Badge } from "@/components/ui/badge";

export function CategoryCardSheet({
  category, selected, onToggle, draggable, onDragStart,
}: {
  category: Category;
  selected: boolean;
  onToggle: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <button
      key={category.id}
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
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="text-sm font-medium">{category.name}</span>
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
  draggable,
  onDragStart,
  onDragEnd,
  reorderIndicator,
  isDragging,
}: {
  group: Group;
  count: number;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  dragState?: "over" | "pulse" | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  reorderIndicator?: "before" | "after" | null;
  isDragging?: boolean;
}) {
  const ring = dragState === "over" ? "ring-2 ring-blue-200" : dragState === "pulse" ? "animate-pulse ring-1 ring-blue-100" : "";

  return (
    <div
      data-group-card="true"
      className={`relative rounded-xl border bg-background transition ${ring} ${isDragging ? "opacity-60" : ""}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {reorderIndicator === "before" && (
        <span className="pointer-events-none absolute left-3 right-3 top-0 -translate-y-1/2 h-1 rounded-full bg-blue-400" />
      )}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-t-xl"
        style={{ borderLeft: `4px solid ${group.color}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{group.title}</span>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t px-3 py-2 text-sm text-muted-foreground rounded-b-xl">
          {count === 0 ? (
            <div className="px-3 py-6 text-center border-dashed">
              <span className="text-sm text-muted-foreground">Nenhuma categoria atribuída</span>
            </div>
          ) : (
            <div className="space-y-2">{children}</div>
          )}
        </div>
      )}
      {reorderIndicator === "after" && (
        <span className="pointer-events-none absolute left-3 right-3 bottom-0 translate-y-1/2 h-1 rounded-full bg-blue-400" />
      )}
    </div>
  );
}

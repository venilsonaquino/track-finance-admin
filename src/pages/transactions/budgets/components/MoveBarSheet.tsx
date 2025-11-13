import { CardFooter } from "@/components/ui/card";
import { Group } from "../types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MoveBarSheet({
  groups, selectedCount, selectedGroup, onChangeGroup, onMove, isSaving = false,
}: {
  groups: Group[];
  selectedCount: number;
  selectedGroup?: string;
  onChangeGroup: (id: string) => void;
  onMove: () => void;
  isSaving?: boolean;
}) {
  return (
    <CardFooter className="border-t bg-background/95 py-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span className="text-xs text-muted-foreground">
        {selectedCount} selecionada{selectedCount !== 1 ? "s" : ""}
      </span>
      <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Select value={selectedGroup} onValueChange={onChangeGroup}>
          <SelectTrigger className="h-9 w-full sm:w-40">
            <SelectValue placeholder="Mover para..." />
          </SelectTrigger>
          <SelectContent>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.title}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" className="w-full sm:w-auto" disabled={!selectedCount || !selectedGroup || isSaving} onClick={onMove}>
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1" />
              Movendo...
            </>
          ) : (
            "Mover"
          )}
        </Button>
      </div>
    </CardFooter>
  );
}
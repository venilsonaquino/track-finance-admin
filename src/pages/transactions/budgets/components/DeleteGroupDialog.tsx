import { useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { EditableSectionState } from "../types";

type DeleteGroupDialogProps = {
  open: boolean;
  section?: EditableSectionState | null;
  onOpenChange: (next: boolean) => void;
  onConfirm: (section: EditableSectionState) => Promise<void> | void;
  loading?: boolean;
};

export default function DeleteGroupDialog({
  open,
  section,
  onOpenChange,
  onConfirm,
  loading = false,
}: DeleteGroupDialogProps) {
  const hasWindow = typeof window !== "undefined";

  const handleConfirm = async () => {
    if (section) {
      await onConfirm(section);
    }
  };

  const dialogContent = useMemo(() => {
    if (!open || !hasWindow) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => onOpenChange(false)}
        />
        <div className="relative z-10 w-[min(92vw,440px)] rounded-lg border bg-background p-6 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-lg leading-none font-semibold">Confirmar exclusão</p>
              </div>
            </div>
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.
                </div>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={!section || loading}
            >
              {loading ? "Removendo..." : "Ecluir"}
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [open, hasWindow, onOpenChange, loading, section]);

  return dialogContent;
}

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
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm
               data-[state=open]:animate-in data-[state=closed]:animate-out
               data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          onClick={() => onOpenChange(false)}
          data-state="open"
        />

        {/* Content */}
        <div
          className="fixed z-50 grid w-[min(92vw,440px)] gap-4 rounded-lg border bg-background p-6 shadow-lg
               data-[state=open]:animate-in data-[state=closed]:animate-out
               data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
               data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          role="dialog"
          aria-modal="true"
          data-state="open"
        >
          {/* Header: título + X */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Confirmar Exclusão
            </h2>

            <button
              type="button"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground
                   hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2
                   focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Descrição (bloco separado, abaixo do título) */}
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
          </p>

          {/* Footer – botões alinhados à direita */}
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              {loading ? "Removendo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </div>
      ,
      document.body
    );
  }, [open, hasWindow, onOpenChange, loading, section]);

  return dialogContent;
}
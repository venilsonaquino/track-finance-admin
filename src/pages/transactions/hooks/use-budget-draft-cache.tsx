import { useCallback, useEffect, useMemo, useState } from "react";
import { EditableSectionState, PendingDraftEntry } from "../budgets/types";

export type BudgetDraftSnapshot = {
  year: number;
  version?: number;
  sections: EditableSectionState[];
  updatedAt: number;
  pendingEntries: PendingDraftEntry[];
};

type SaveDraftOptions = {
  version?: number;
  pendingEntries?: PendingDraftEntry[];
};

type UseBudgetDraftCacheOptions = {
  storage?: "localStorage" | "sessionStorage";
  enabled?: boolean;
};

const STORAGE_NAMESPACE = "budget-draft";

const cloneSections = (sections: EditableSectionState[]): EditableSectionState[] =>
  sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      values: [...row.values],
    })),
  }));

const cloneEntries = (entries: PendingDraftEntry[]): PendingDraftEntry[] =>
  entries.map((entry) => ({ ...entry }));

const isBrowser = () => typeof window !== "undefined";

export function useBudgetDraftCache(
  year?: number,
  options?: UseBudgetDraftCacheOptions
) {
  const { storage = "localStorage", enabled = true } = options ?? {};

  const storageKey = useMemo(() => {
    if (!year || !enabled) return null;
    return `${STORAGE_NAMESPACE}:${year}`;
  }, [year, enabled]);

  const getStorage = useCallback(() => {
    if (!isBrowser()) return null;
    return storage === "sessionStorage" ? window.sessionStorage : window.localStorage;
  }, [storage]);

  const readDraft = useCallback((): BudgetDraftSnapshot | null => {
    if (!storageKey) return null;
    const storageInstance = getStorage();
    if (!storageInstance) return null;

    try {
      const raw = storageInstance.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as BudgetDraftSnapshot & { pendingEntries?: PendingDraftEntry[] };
      if (parsed.year !== year) return null;
      return {
        ...parsed,
        pendingEntries: Array.isArray(parsed.pendingEntries) ? parsed.pendingEntries : [],
      };
    } catch (error) {
      console.warn("[useBudgetDraftCache] Falha ao ler draft:", error);
      return null;
    }
  }, [getStorage, storageKey, year]);

  const [draft, setDraft] = useState<BudgetDraftSnapshot | null>(() => readDraft());

  const saveDraft = useCallback(
    (sections: EditableSectionState[], meta?: SaveDraftOptions) => {
      if (!storageKey) return;

      const storageInstance = getStorage();
      if (!storageInstance) return;

      if (!sections.length) {
        try {
          storageInstance.removeItem(storageKey);
        } catch (error) {
          console.warn("[useBudgetDraftCache] Falha ao remover draft vazio:", error);
        } finally {
          setDraft(null);
        }
        return;
      }

      if (typeof year !== "number") {
        console.warn("[useBudgetDraftCache] 'year' is undefined or not a number, cannot save draft.");
        return;
      }

      const snapshot: BudgetDraftSnapshot = {
        year,
        version: meta?.version,
        sections: cloneSections(sections),
        pendingEntries: cloneEntries(meta?.pendingEntries ?? []),
        updatedAt: Date.now(),
      };

      try {
        storageInstance.setItem(storageKey, JSON.stringify(snapshot));
        setDraft(snapshot);
      } catch (error) {
        console.warn("[useBudgetDraftCache] Falha ao salvar draft:", error);
      }
    },
    [getStorage, storageKey, year]
  );

  const clearDraft = useCallback(() => {
    if (!storageKey) {
      setDraft(null);
      return;
    }

    const storageInstance = getStorage();
    try {
      storageInstance?.removeItem(storageKey);
    } catch (error) {
      console.warn("[useBudgetDraftCache] Falha ao limpar draft:", error);
    } finally {
      setDraft(null);
    }
  }, [getStorage, storageKey]);

  const consumeDraft = useCallback(() => {
    const snapshot = readDraft();
    if (snapshot) {
      clearDraft();
    }
    return snapshot;
  }, [clearDraft, readDraft]);

  const canRestoreDraft = useCallback(
    (reference?: { version?: number }) => {
      if (!draft) return false;
      if (reference?.version && draft.version && draft.version !== reference.version) {
        return false;
      }
      return true;
    },
    [draft]
  );

  useEffect(() => {
    setDraft(readDraft());
  }, [readDraft]);

  useEffect(() => {
    if (!storageKey || !isBrowser()) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      setDraft(readDraft());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [readDraft, storageKey]);

  return {
    draft,
    hasDraft: Boolean(draft),
    lastUpdatedAt: draft?.updatedAt ?? null,
    saveDraft,
    clearDraft,
    consumeDraft,
    canRestoreDraft,
  };
}

import { useCallback, useEffect, useState } from "react";
import { BudgetGroupRequest, BudgetGroupResponse, BudgetGroupService } from "@/api/services/budgetGroupService";
import { BudgetPayloadResponse } from "../budgets/types";

export const useBudgetOverview = (year?: number) => {
  const [budgetOverview, setBudgetOverview] = useState<BudgetPayloadResponse>();
  const [loadingBudgetOverview, setLoadingBudgetOverview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchBudgetOverview = useCallback(async (yearOverride?: number) => {
    try {
      setLoadingBudgetOverview(true);
      setError(null);
      const currentYear = yearOverride ?? year ?? new Date().getFullYear();
      const response = await BudgetGroupService.getBudgetOverview(currentYear);
      const { data }: { data: BudgetPayloadResponse } = response;

      setBudgetOverview(data);
      setError(null);
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message || (error instanceof Error ? error.message : 'Erro desconhecido ao buscar budget overview');
      setError(errorMessage);
      console.error("Erro ao buscar budget overview:", error);
    } finally {
      setLoadingBudgetOverview(false);
    }
  }, [year]);
  
  useEffect(() => {
    fetchBudgetOverview(year);
  }, [fetchBudgetOverview, year]);

  // Limpa erro automaticamente após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    budgetOverview,
    loadingBudgetOverview,
    error,
    clearError,
    fetchBudgetOverview
  };
};

export const useBudgetGroupsCrud = () => {
  const [budgetGroups, setBudgetGroups] = useState<BudgetGroupResponse[]>([]);
  const [loadingBudgetGroups, setLoadingBudgetGroups] = useState(false);
  const [loadingCreateGroup, setLoadingCreateGroup] = useState(false);
  const [loadingUpdateGroup, setLoadingUpdateGroup] = useState(false);
  const [loadingRenameGroup, setLoadingRenameGroup] = useState(false);
  const [loadingDeleteGroup, setLoadingDeleteGroup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchBudgetGroups = async () => {
    try {
      setLoadingBudgetGroups(true);
      setError(null);
      const response = await BudgetGroupService.getBudgetGroups();
      const { data }: { data: BudgetGroupResponse[] } = response;
      setBudgetGroups(Array.isArray(data) ? data : []);
      setError(null); // Limpa erro após sucesso
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar grupos de orçamento';
      setError(errorMessage);
      setBudgetGroups([]);
    } finally {
      setLoadingBudgetGroups(false);
    }
  };

  const createBudgetGroup = async (data: BudgetGroupRequest) => {
    try {
      setLoadingCreateGroup(true);
      setError(null);
      await BudgetGroupService.createBudgetGroup(data);
      fetchBudgetGroups();
      setError(null); // Limpa erro após sucesso
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar grupo de orçamento';
      setError(errorMessage);
      throw error;
    } finally {
      setLoadingCreateGroup(false);
    }
  };

  const updateBudgetGroup = async (id: string, data: BudgetGroupRequest) => {
    try {
      setLoadingUpdateGroup(true);
      setError(null);
      await BudgetGroupService.updateBudgetGroup(id, data);
      fetchBudgetGroups();
      setError(null); // Limpa erro após sucesso
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar grupo de orçamento';
      setError(errorMessage);
      throw error;
    } finally {
      setLoadingUpdateGroup(false);
    }
  };

  const deleteBudgetGroup = async (id: string) => {
    try {
      setLoadingDeleteGroup(true);
      setError(null);
      await BudgetGroupService.deleteBudgetGroup(id);
      fetchBudgetGroups();
      setError(null); // Limpa erro após sucesso
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao deletar grupo de orçamento';
      setError(errorMessage);
      throw error;
    } finally {
      setLoadingDeleteGroup(false);
    }
  };

  const renameBudgetGroup = async (id: string, title: string) => {
    try {
      setLoadingRenameGroup(true);
      setError(null);
      await BudgetGroupService.updateGroupName(id, title);
      fetchBudgetGroups();
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao renomear grupo de orçamento";
      setError(errorMessage);
      throw error;
    } finally {
      setLoadingRenameGroup(false);
    }
  };

  const categoryAssignments = async (id: string) => {
    try {
      setError(null);
      await BudgetGroupService.categoryAssignments(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atribuir categorias';
      setError(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchBudgetGroups();
  }, []);

  // Limpa erro automaticamente após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    budgetGroups,
    loadingBudgetGroups,
    loadingCreateGroup,
    loadingUpdateGroup,
    loadingRenameGroup,
    loadingDeleteGroup,
    error,
    clearError,
    fetchBudgetGroups,
    createBudgetGroup,
    updateBudgetGroup,
    renameBudgetGroup,
    deleteBudgetGroup,
    categoryAssignments
  };
};

import { useEffect, useState } from "react";
import { BudgetGroupRequest, BudgetGroupResponse, BudgetGroupService } from "@/api/services/budgetGroupService";
import { BudgetPayloadResponse } from "../budgets/types";

export const useBudgetOverview = () => {
  const [budgetOverview, setBudgetOverview] = useState<BudgetPayloadResponse>();
  const [loadingBudgetOverview, setLoadingBudgetOverview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchBudgetOverview = async (year?: number) => {
    try {
      setLoadingBudgetOverview(true);
      setError(null);
      const currentYear = year ?? new Date().getFullYear();
      const response = await BudgetGroupService.getBudgetOverview(currentYear);
      const { data }: { data: BudgetPayloadResponse } = response;

      setBudgetOverview(data);
      setError(null);
    } catch (error) {
      setError(error as string);
      console.error("Erro ao buscar budget overview:", error);
    } finally {
      setLoadingBudgetOverview(false);
    }
  };

  useEffect(() => {
    fetchBudgetOverview();
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
      setError(error as string);
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
      setError(error as string);
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
      setError(error as string);
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
      setError(error as string);
      throw error;
    } finally {
      setLoadingDeleteGroup(false);
    }
  };

  const categoryAssignments = async (id: string) => {
    try {
      setError(null);
      await BudgetGroupService.categoryAssignments(id);
    } catch (error) {
      setError(error as string);
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
    loadingDeleteGroup,
    error,
    clearError,
    fetchBudgetGroups,
    createBudgetGroup,
    updateBudgetGroup,
    deleteBudgetGroup,
    categoryAssignments
  };
};
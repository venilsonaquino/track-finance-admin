import { useEffect, useState } from "react";
import { BudgetGroupRequest, BudgetGroupResponse, BudgetGroupService } from "@/api/services/budgetGroupService";

export const useBudgetGroups = () => {
  const [budgetGroups, setBudgetGroups] = useState<BudgetGroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchBudgetGroups = async () => {
    try {
      setLoading(true);
      const response = await BudgetGroupService.getBudgetGroups();
      const { data }: { data: BudgetGroupResponse[] } = response;
      setBudgetGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error as string);
      setBudgetGroups([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBudgetGroups();
  }, []); 

  const categoryAssignments = async (id: string) => {
    try {
      setLoading(true);
      await BudgetGroupService.categoryAssignments(id);
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const createBudgetGroup = async (data: BudgetGroupRequest) => {
    try {
      setLoading(true);
      await BudgetGroupService.createBudgetGroup(data);
      fetchBudgetGroups();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const updateBudgetGroup = async (id: string, data: BudgetGroupRequest) => {
    try {
      setLoading(true);
      await BudgetGroupService.updateBudgetGroup(id, data);
      fetchBudgetGroups();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const deleteBudgetGroup = async (id: string) => {
    try {
      setLoading(true);
      await BudgetGroupService.deleteBudgetGroup(id);
      fetchBudgetGroups();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }


  return {
    budgetGroups,
    loading,
    error,
    fetchBudgetGroups,
    categoryAssignments,
    createBudgetGroup,
    updateBudgetGroup,
    deleteBudgetGroup
  }
}
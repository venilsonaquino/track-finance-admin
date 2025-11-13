import HttpClient from "@/api/httpClient";
import { CategoryResponse } from "../dtos/category/category-response";

export interface BudgetGroupRequest {
  title: string;
  kind: string;
  color: string;
  footerLabel: string;
}

export interface BudgetGroupResponse {
  id: string;
  title: string;
  kind: string;
  color: string;
  userId: string;
  footerLabel: string;
  categories: CategoryResponse[];
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
}

export interface AssignmentItem {
  categoryId: string;
  budgetGroupId?: string | null;
}

export interface CategoryIdsByGroupRequest {
  assignments: AssignmentItem[];
}

export interface ReorderBudgetGroupsRequest {
  groups: { 
    id: string;
    position: number;
  }[];
}

export const BudgetGroupService = {
  getBudgetGroups: () => HttpClient.get("/budget-groups"),
  getBudgetGroupById: (id: string) => HttpClient.get(`/budget-groups/${id}`),
  createBudgetGroup: (data: BudgetGroupRequest) => HttpClient.post("/budget-groups", data),
  updateBudgetGroup: (id: string, data: BudgetGroupRequest) => HttpClient.put(`/budget-groups/${id}`, data),
  deleteBudgetGroup: (id: string) => HttpClient.delete(`/budget-groups/${id}`),
  categoryAssignments: (id: string) => HttpClient.put(`/budget-groups/${id}/category-assignments`),
  updateCategoryAssignments: (payload: CategoryIdsByGroupRequest) => HttpClient.put("/budget-groups/category-assignments", payload),
  getBudgetOverview: (year: number) => HttpClient.get(`/budget-groups/overview?year=${year}`),
  updateReorderGroups: (payload: ReorderBudgetGroupsRequest) => HttpClient.patch("/budget-groups/reorder", payload),
  updateGroupName: (id: string, title: string) => HttpClient.patch(`/budget-groups/${id}/rename`, { title }),
};

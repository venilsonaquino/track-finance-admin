import HttpClient from "@/api/httpClient";
import { CategoryRequest } from "../dtos/category/category-request";

export const CategoryService = {
  getCategories: () => HttpClient.get("/categories"),
  createCategory: (category: CategoryRequest) => HttpClient.post("/categories", category),
  updateCategory: (id: string, category: CategoryRequest) => HttpClient.put(`/categories/${id}`, category),
  deleteCategory: (id: string) => HttpClient.delete(`/categories/${id}`),
};

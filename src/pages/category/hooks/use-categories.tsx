import { CategoryRequest } from "@/api/dtos/category/category-request";
import { CategoryResponse } from "@/api/dtos/category/category-response";
import { CategoryService } from "@/api/services/categoyService";
import { useEffect, useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getCategories();
      const { data } = response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error as string);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (category: CategoryRequest) => {
    try {
      const response = await CategoryService.createCategory(category);
      setCategories(prev => [...prev, response.data]);
    } catch (error) {
      setError(error as string);
    }
  }

  const updateCategory = async (id: string, category: CategoryRequest) => {
    try {
      const response = await CategoryService.updateCategory(id, category);  
      setCategories(prev => prev.map(c => c.id === id ? response.data : c));
    } catch (error) {
      setError(error as string);
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await CategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      setError(error as string);
    }
  }

  return {
    categories,
    loading,  
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}


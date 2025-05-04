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

  return {
    categories,
    loading,  
    error,  
  }
}


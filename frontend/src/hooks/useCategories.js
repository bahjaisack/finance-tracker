import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/apiClient";
import { toast } from "sonner"; 

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get("/categories/");
      return response.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post("/categories/", data);
      return response.data;
    },
    onSuccess: () => {
       toast.success("Category added successfully!", {
      className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
        toast.error(message, {
  className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!",{
      className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
        toast.error(message, {
  className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
    },
  });
};
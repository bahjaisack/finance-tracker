import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/apiClient";
import { toast } from "sonner";
export const useGetTransactions = (select) => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await apiClient.get("/transactions");
      return response.data;
    },
    select,
  });
};

const invalidateTransactionQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransaction) => {
      const response = await apiClient.post("/transactions", newTransaction);
      return response.data;
    },
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
      
    
  toast.success("Transaction created successfully!", {
      className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});

    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create transaction";
    toast.error(message, {
  className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const response = await apiClient.put(`/transactions/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
      
    
  toast.success("Transaction updated successfully!", {
      className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});

    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update transaction";
    toast.error(message, {
  className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
      
    
  toast.success("Transaction deleted successfully!", {
      className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});

    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete transaction";
    toast.error(message, {
  className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
    },
  });
};
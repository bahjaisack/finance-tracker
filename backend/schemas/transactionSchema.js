import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be either 'income' or 'expense'" }),
  }),
  category: z.string().min(1, "Category is required"),
  date: z.string().optional(),
  note: z.string().optional().default(""),
});

export const updateTransactionSchema = createTransactionSchema.partial();
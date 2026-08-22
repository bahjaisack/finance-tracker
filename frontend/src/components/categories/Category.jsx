import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Tag, Loader2, Lock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  type: z.enum(["income", "expense"]),
});

export const Category = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const responseData = data?.data?.data || data?.data || data || {};
  const predefined = Array.isArray(responseData.predefined)
    ? responseData.predefined
    : [];
  const custom = Array.isArray(responseData.custom) ? responseData.custom : [];

  const categories = [...predefined, ...custom];

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "expense",
    },
  });

  const onSubmit = (values) => {
    createCategory.mutate(values, {
      onSuccess: () => {
        form.reset({ name: "", type: values.type });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-slate-300 dark:border-slate-700">
          <Tag className="h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Categories</DialogTitle>
          <DialogDescription>
            Add or remove custom income and expense categories.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="New Category (e.g. Subscriptions)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-120">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createCategory.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {createCategory.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 space-y-2 max-h-65 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-400">
              No categories found. Create one above!
            </p>
          ) : (
            categories.map((cat, idx) => {
              const name = typeof cat === "string" ? cat : cat?.name || "";
              const id = typeof cat === "object" ? (cat?._id || cat?.id) : null;
              const type = typeof cat === "object" ? (cat?.type || "expense") : "expense";
              const isCustom = Boolean(id); // Custom categories have DB IDs

              if (!name) return null;

              const isDeleting =
                deleteCategory.isPending && deleteCategory.variables === id;

              return (
                <div
                  key={id || `${name}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        type === "income"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      }
                    >
                      {type}
                    </Badge>
                  </div>

                  {isCustom ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting}
                      className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      onClick={() => deleteCategory.mutate(id)}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  ) : (
                    <span
                      className="p-1.5 text-slate-300 dark:text-slate-600"
                      title="System default category"
                    >
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
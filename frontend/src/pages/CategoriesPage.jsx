import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Tag, Loader2, Lock, FolderPlus, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const responseData = data?.data?.data || data?.data || data || {};
  const predefined = Array.isArray(responseData.predefined) ? responseData.predefined : [];
  const custom = Array.isArray(responseData.custom) ? responseData.custom : [];

  const filteredCustom = custom.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPredefined = predefined.filter((cat) => {
    const name = typeof cat === "string" ? cat : cat.name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", type: "expense" },
  });

  const onSubmit = (values) => {
    createCategory.mutate(values, {
      onSuccess: () => form.reset({ name: "", type: values.type }),
    });
  };

  const hasNoResults =
    filteredCustom.length === 0 && filteredPredefined.length === 0;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Categories
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage system defaults and organize custom categories for accurate transaction grouping.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-indigo-600" />
              Add Category
            </CardTitle>
            <CardDescription>Create a new custom income or expense category.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Input placeholder="Category Name (e.g. Subscriptions)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-45">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={createCategory.isPending}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  {createCategory.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add Category
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                All Categories
              </CardTitle>
              <CardDescription>
                Custom categories can be deleted. System default categories are locked.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 focus-visible:ring-indigo-500"
              />
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading categories...
              </div>
            ) : hasNoResults ? (
              <div className="text-center py-12 text-slate-400 space-y-1">
                <p className="text-sm font-medium">No matching categories found.</p>
                {searchTerm && (
                  <p className="text-xs text-slate-500">
                    Try adjusting your search query "{searchTerm}"
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-125 overflow-y-auto pr-1">
                {filteredCustom.map((cat) => (
                  <div
                    key={cat._id || cat.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {cat.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={
                          cat.type === "income"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }
                      >
                        {cat.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteCategory.isPending && deleteCategory.variables === (cat._id || cat.id)}
                      className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      onClick={() => deleteCategory.mutate(cat._id || cat.id)}
                    >
                      {deleteCategory.isPending && deleteCategory.variables === (cat._id || cat.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}

                {filteredPredefined.map((cat, idx) => {
                  const name = typeof cat === "string" ? cat : cat.name;
                  return (
                    <div
                      key={`predefined-${idx}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-950 opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {name}
                        </span>
                        <Badge variant="outline" className="text-xs font-normal">
                          Default
                        </Badge>
                      </div>
                      <span title="System default category">
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
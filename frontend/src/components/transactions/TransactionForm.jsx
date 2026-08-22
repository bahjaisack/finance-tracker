import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";

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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateTransaction } from "@/hooks/useTransactions";
import { useGetCategories } from "@/hooks/useCategories";

const transactionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export const TransactionForm = () => {
  const [open, setOpen] = useState(false);

  const createTransaction = useCreateTransaction();

  const { data: categoryData, isLoading: isLoadingCategories } =
    useGetCategories();


  const responseData =
    categoryData?.data?.data || categoryData?.data || categoryData || {};

  const predefined = Array.isArray(responseData.predefined)
    ? responseData.predefined
    : [];

  const custom = Array.isArray(responseData.custom) ? responseData.custom : [];

 
  const categories = [...predefined, ...custom].reduce((result, category) => {
    const name = typeof category === "string" ? category : category?.name;

    if (!name) return result;

    const exists = result.some(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );

    if (!exists) {
      result.push({
        name,
        type:
          typeof category === "object"
            ? category?.type || "expense"
            : "expense",
      });
    }

    return result;
  }, []);

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const selectedType = form.watch("type");

  const filteredCategories = categories.filter((category) => {
    return category.type === selectedType;
  });


  const handleTypeChange = (value, field) => {
    field.onChange(value);

    const currentCategory = form.getValues("category");

    const categoryStillValid = categories.some(
      (category) =>
        category.name === currentCategory && category.type === value,
    );

    if (!categoryStillValid) {
      form.setValue("category", "");
    }
  };

  const onSubmit = (data) => {
    createTransaction.mutate(data, {
      onSuccess: () => {
        form.reset({
          title: "",
          amount: "",
          type: "expense",
          category: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
        });

        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-medium">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>

          <DialogDescription>
            Record a new income or expense item to keep your balance up to date.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title </FormLabel>

                  <FormControl>
                    <Input placeholder="e.g., Grocery Shopping" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(value) => handleTypeChange(value, field)}
                    >
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
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Loading categories..."
                              : "Select category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-center text-slate-500">
                          No {selectedType} categories available
                        </div>
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>

                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>

                  <FormControl>
                    <Input placeholder="Optional notes" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createTransaction.isPending || isLoadingCategories}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            >
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Transaction"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

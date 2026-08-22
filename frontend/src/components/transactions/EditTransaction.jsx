import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

import { useUpdateTransaction } from "@/hooks/useTransactions";
import { useGetCategories } from "@/hooks/useCategories";

const transactionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const getCategoryName = (category) => {
  if (!category) return "";

  if (typeof category === "string") {
    return category;
  }

  return category.name || "";
};

const normalizeCategories = (data) => {
  const responseData =
    data?.data?.data ||
    data?.data ||
    data ||
    {};

  const predefined = Array.isArray(responseData.predefined)
    ? responseData.predefined
    : [];

  const custom = Array.isArray(responseData.custom)
    ? responseData.custom
    : [];

  const combined = [...predefined, ...custom];

  return combined.reduce((result, category) => {
    const name = getCategoryName(category);

    if (!name) {
      return result;
    }

    const exists = result.some(
      (item) =>
        item.name.toLowerCase().trim() ===
        name.toLowerCase().trim()
    );

    if (!exists) {
      result.push({
        name,
        type:
          typeof category === "object"
            ? category.type || "expense"
            : "expense",

        id:
          typeof category === "object"
            ? category._id || category.id || name
            : name,
      });
    }

    return result;
  }, []);
};

export const EditTransaction = ({
  transaction,
  open,
  onOpenChange,
}) => {
  const updateTransaction = useUpdateTransaction();

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
  } = useGetCategories();

  const categories = normalizeCategories(categoriesData);

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

  const availableCategories = categories.filter(
    (category) =>
      !category.type ||
      category.type === selectedType
  );

  useEffect(() => {
    if (!transaction) {
      return;
    }

    const formattedDate = transaction.date
      ? new Date(transaction.date)
          .toISOString()
          .split("T")[0]
      : new Date().toISOString().split("T")[0];

    const categoryName = getCategoryName(
      transaction.category
    );

    form.reset({
      title: transaction.title || "",
      amount: transaction.amount || "",
      type: transaction.type || "expense",
      category: categoryName,
      date: formattedDate,
      notes: transaction.notes || "",
    });
  }, [transaction, form]);

  const handleTypeChange = (value, field) => {
    field.onChange(value);

    const currentCategory = form.getValues("category");

    const categoryStillValid = categories.some(
      (category) =>
        category.name === currentCategory &&
        category.type === value
    );

    if (!categoryStillValid) {
      form.setValue("category", "");
    }
  };

  const onSubmit = (data) => {
    const id =
      transaction?._id ||
      transaction?.id;

    if (!id) {
      return;
    }

    updateTransaction.mutate(
      {
        id,
        data,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-106">
        <DialogHeader>
          <DialogTitle>
            Edit Transaction
          </DialogTitle>

          <DialogDescription>
            Update details for this income or expense item.
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
                  <FormLabel>
                    Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="e.g., Grocery Shopping"
                      {...field}
                    />
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
                    <FormLabel>
                      Amount ($)
                    </FormLabel>

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
                    <FormLabel>
                      Type
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        handleTypeChange(
                          value,
                          field
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="expense">
                          Expense
                        </SelectItem>

                        <SelectItem value="income">
                          Income
                        </SelectItem>
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
                  <FormLabel>
                    Category
                  </FormLabel>

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
                      {availableCategories.length === 0 ? (
                        <div className="p-2 text-xs text-center text-slate-500">
                          No categories found for{" "}
                          {selectedType}
                        </div>
                      ) : (
                        availableCategories.map(
                          (category) => (
                            <SelectItem
                              key={category.id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          )
                        )
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
                  <FormLabel>
                    Date
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
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
                  <FormLabel>
                    Notes
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Optional notes"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            <Button
              type="submit"
              disabled={updateTransaction.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            >
              {updateTransaction.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
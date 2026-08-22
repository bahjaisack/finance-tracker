import { useState } from "react";
import { format, isValid } from "date-fns";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Pencil,
  Receipt,
  DollarSign,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Link } from "react-router-dom";

import {
  useGetTransactions,
  useDeleteTransaction,
} from "@/hooks/useTransactions";

import { useGetCategories } from "@/hooks/useCategories";

import { TransactionForm } from "@/components/transactions/TransactionForm";
import { EditTransaction } from "@/components/transactions/EditTransaction";


const getCategoryName = (category) => {
  if (!category) return "";

  if (typeof category === "string") {
    return category.trim();
  }

  return (
    category.name ||
    category.categoryName ||
    ""
  ).trim();
};

const getCategoryId = (category) => {
  if (!category || typeof category === "string") {
    return "";
  }

  return String(
    category._id ||
      category.id ||
      ""
  );
};

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};


const normalizeCategories = (data) => {
  const responseData =
    data?.data?.data ||
    data?.data ||
    data ||
    {};

  const predefined = Array.isArray(
    responseData.predefined
  )
    ? responseData.predefined
    : [];

  const custom = Array.isArray(
    responseData.custom
  )
    ? responseData.custom
    : [];

  const combined = [
    ...predefined,
    ...custom,
  ];

  const uniqueCategories = [];

  combined.forEach((category) => {
    const name = getCategoryName(category);

    if (!name) return;

    const alreadyExists =
      uniqueCategories.some(
        (existing) =>
          normalizeText(
            getCategoryName(existing)
          ) === normalizeText(name)
      );

    if (!alreadyExists) {
      uniqueCategories.push(category);
    }
  });

  return uniqueCategories;
};



export const Transactions = () => {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [editingTransaction, setEditingTransaction] =
    useState(null);


  const {
    data: transactionsData,
    isLoading,
  } = useGetTransactions();

  const transactions =
    Array.isArray(transactionsData)
      ? transactionsData
      : Array.isArray(
          transactionsData?.data?.transactions
        )
        ? transactionsData.data.transactions
        : Array.isArray(
            transactionsData?.transactions
          )
          ? transactionsData.transactions
          : Array.isArray(
              transactionsData?.data
            )
            ? transactionsData.data
            : [];



  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
  } = useGetCategories();

  const categories =
    normalizeCategories(
      categoriesData
    );


  const deleteTransaction =
    useDeleteTransaction();

  const totalIncome =
    transactions
      .filter(
        (tx) => tx.type === "income"
      )
      .reduce(
        (total, tx) =>
          total + Number(tx.amount || 0),
        0
      );

  const totalExpense =
    transactions
      .filter(
        (tx) => tx.type === "expense"
      )
      .reduce(
        (total, tx) =>
          total + Number(tx.amount || 0),
        0
      );

  const netBalance =
    totalIncome - totalExpense;


  const filteredTransactions =
    transactions.filter((tx) => {

      const categoryName =
        getCategoryName(
          tx.category
        );

      const categoryId =
        getCategoryId(
          tx.category
        );

      const normalizedCategory =
        normalizeText(
          categoryName
        );

      const normalizedSearch =
        normalizeText(
          searchTerm
        );

      const normalizedFilter =
        normalizeText(
          categoryFilter
        );



      const matchesSearch =
        !normalizedSearch ||
        normalizeText(
          tx.title
        ).includes(
          normalizedSearch
        ) ||
        normalizedCategory.includes(
          normalizedSearch
        );


      const matchesCategory =
        categoryFilter === "all" ||
        normalizedCategory ===
          normalizedFilter ||
        categoryId ===
          String(categoryFilter);


      const matchesType =
        typeFilter === "all" ||
        tx.type === typeFilter;


      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });



  const handleDelete = (id) => {
    if (!id) return;

    deleteTransaction.mutate(id);
  };




  const formatDate = (dateStr) => {
    if (!dateStr) {
      return "N/A";
    }

    const date =
      new Date(dateStr);

    return isValid(date)
      ? format(
          date,
          "MMM dd, yyyy"
        )
      : "N/A";
  };



  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
    

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transactions
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage and audit all incoming and outgoing financial transactions.
          </p>
        </div>


        <div className="flex items-center gap-2">


          <Button
            asChild
            variant="outline"
            className="gap-2 border-slate-300 dark:border-slate-700"
          >
            <Link to="/categories">
              Manage Categories
            </Link>
          </Button>


          <TransactionForm />

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


        <Card className="border-slate-200 dark:border-slate-800">

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium text-slate-600">
              Net Balance
            </CardTitle>

            <DollarSign className="h-4 w-4 text-indigo-600" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              $
              {netBalance.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </div>

          </CardContent>

        </Card>



        <Card className="border-slate-200 dark:border-slate-800">

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium text-emerald-600">
              Total Income
            </CardTitle>

            <ArrowUpRight className="h-4 w-4 text-emerald-600" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold text-emerald-600">
              +$
              {totalIncome.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </div>

          </CardContent>

        </Card>


        <Card className="border-slate-200 dark:border-slate-800">

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium text-rose-600">
              Total Expense
            </CardTitle>

            <ArrowDownRight className="h-4 w-4 text-rose-600" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold text-rose-600">
              -$
              {totalExpense.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </div>

          </CardContent>

        </Card>

      </div>



      <Card className="border-slate-200 dark:border-slate-800">

        <CardContent className="pt-6">

          <div className="flex flex-col sm:flex-row gap-4 justify-between">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="pl-9 focus-visible:ring-indigo-500"
              />

            </div>


            <div className="flex gap-3">

              <Select
                value={typeFilter}
                onValueChange={(value) => {

                  setTypeFilter(value);

                  setCategoryFilter(
                    "all"
                  );

                }}
              >

                <SelectTrigger className="w-35">

                  <SelectValue placeholder="Type" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    All Types
                  </SelectItem>

                  <SelectItem value="income">
                    Income
                  </SelectItem>

                  <SelectItem value="expense">
                    Expense
                  </SelectItem>

                </SelectContent>

              </Select>



              <Select
                value={categoryFilter}
                onValueChange={
                  setCategoryFilter
                }
              >

                <SelectTrigger className="w-40">

                  <SelectValue placeholder="Category" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    All Categories
                  </SelectItem>


                  {isLoadingCategories ? (

                    <div className="p-2 text-xs text-center text-slate-500">
                      Loading categories...
                    </div>

                  ) : categories.length === 0 ? (

                    <div className="p-2 text-xs text-center text-slate-500">
                      No categories available
                    </div>

                  ) : (

                    categories
                      .filter((category) => {

                        if (
                          typeFilter ===
                          "all"
                        ) {
                          return true;
                        }

                        if (
                          typeof category ===
                          "string"
                        ) {
                          return true;
                        }

                        return (
                          !category.type ||
                          category.type ===
                            typeFilter
                        );
                      })
                      .map(
                        (
                          category,
                          index
                        ) => {

                          const name =
                            getCategoryName(
                              category
                            );

                          if (!name) {
                            return null;
                          }

                          return (
                            <SelectItem
                              key={
                                getCategoryId(
                                  category
                                ) ||
                                `${name}-${index}`
                              }
                              value={name}
                            >
                              {name}
                            </SelectItem>
                          );

                        }
                      )

                  )}

                </SelectContent>

              </Select>

            </div>

          </div>

        </CardContent>

      </Card>


      <Card className="border-slate-200 dark:border-slate-800">

        <CardContent className="p-0">

          {isLoading ? (

            <div className="flex items-center justify-center py-12 text-slate-500">

              <Loader2 className="h-6 w-6 animate-spin mr-2" />

              Loading transactions...

            </div>

          ) : filteredTransactions.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-12 text-slate-400">

              <Receipt className="h-10 w-10 mb-2 stroke-[1.5]" />

              <p className="text-sm font-medium">
                No transactions found.
              </p>

              {(searchTerm ||
                categoryFilter !==
                  "all" ||
                typeFilter !==
                  "all") && (

                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search or filters.
                </p>

              )}

            </div>

          ) : (

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Title
                  </TableHead>

                  <TableHead>
                    Category
                  </TableHead>

                  <TableHead>
                    Type
                  </TableHead>

                  <TableHead>
                    Amount
                  </TableHead>

                  <TableHead>
                    Date
                  </TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>

                {filteredTransactions.map(
                  (tx) => {

                    const id =
                      tx._id ||
                      tx.id;

                    const categoryName =
                      getCategoryName(
                        tx.category
                      );

                    return (

                      <TableRow
                        key={id}
                      >

                        <TableCell className="font-medium">
                          {tx.title ||
                            "Untitled"}
                        </TableCell>


                        <TableCell>

                          <Badge variant="outline">
                            {categoryName ||
                              "Uncategorized"}
                          </Badge>

                        </TableCell>


                        <TableCell>

                          {tx.type ===
                          "income" ? (

                            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">

                              <ArrowUpRight className="h-3 w-3 mr-1" />

                              Income

                            </Badge>

                          ) : (

                            <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">

                              <ArrowDownRight className="h-3 w-3 mr-1" />

                              Expense

                            </Badge>

                          )}

                        </TableCell>


                        <TableCell
                          className={
                            tx.type ===
                            "income"
                              ? "font-semibold text-emerald-600"
                              : "font-semibold text-rose-600"
                          }
                        >

                          {tx.type ===
                          "income"
                            ? "+"
                            : "-"}

                          $
                          {Number(
                            tx.amount || 0
                          ).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                        </TableCell>


                        <TableCell>
                          {formatDate(
                            tx.date
                          )}
                        </TableCell>


                        <TableCell>

                          <div className="flex justify-end gap-1">

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                setEditingTransaction(
                                  tx
                                )
                              }
                            >

                              <Pencil className="h-4 w-4" />

                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={
                                deleteTransaction.isPending
                              }
                              className="h-8 w-8 text-slate-400 hover:text-rose-600"
                              onClick={() =>
                                handleDelete(
                                  id
                                )
                              }
                            >

                              {deleteTransaction.isPending ? (

                                <Loader2 className="h-4 w-4 animate-spin" />

                              ) : (

                                <Trash2 className="h-4 w-4" />

                              )}

                            </Button>

                          </div>

                        </TableCell>

                      </TableRow>

                    );

                  }
                )}

              </TableBody>

            </Table>

          )}

        </CardContent>

      </Card>


   

      {editingTransaction && (

        <EditTransaction
          transaction={
            editingTransaction
          }

          open={
            Boolean(
              editingTransaction
            )
          }

          onOpenChange={(open) => {

            if (!open) {
              setEditingTransaction(
                null
              );
            }

          }}
        />

      )}

    </div>
  );
};
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/apiClient";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Shield, 
  PieChart, 
  UserPlus, 
  AlertCircle 
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminPage = () => {
  const { data: overview, isLoading, isError, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/overview");
      return res.data?.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
          <Skeleton className="col-span-4 h-64 rounded-xl" />
          <Skeleton className="col-span-3 h-64 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="m-auto max-w-md border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle>Failed to load analytics</CardTitle>
          <CardDescription>
            {error?.response?.data?.message || "You do not have permission to access admin data."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { users, financials, topSpendingCategories } = overview || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide metrics, user distribution, and financial performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financials?.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Platform inflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financials?.totalExpense)}</div>
            <p className="text-xs text-muted-foreground">Platform outflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net System Balance</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financials?.netBalance)}</div>
            <p className="text-xs text-muted-foreground">Income minus expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center gap-2">
            <PieChart className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Top Spending Categories</CardTitle>
              <CardDescription>Top 5 expense categories platform-wide</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Transactions</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSpendingCategories?.length > 0 ? (
                  topSpendingCategories.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium capitalize">
                        {item.category || "Uncategorized"}
                      </TableCell>
                      <TableCell className="text-center">{item.transactionCount}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.totalSpent)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No category data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>System access permissions</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {users?.breakdown?.map((roleGroup) => (
              <div
                key={roleGroup._id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <Badge variant={roleGroup._id === "admin" ? "default" : "secondary"} className="capitalize">
                  {roleGroup._id || "user"}
                </Badge>
                <span className="text-sm font-bold">{roleGroup.count} accounts</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <UserPlus className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Recently Registered Users</CardTitle>
            <CardDescription>Latest 5 users joining the platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.recent?.map((u) => {
                const avatarUrl = u.profilePic || u.avatar || u.avatarUrl || u.image;
                return (
                  <TableRow key={u._id}>
                    <TableCell className="flex items-center gap-3 font-medium">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} alt={u.name || u.username} />
                        <AvatarFallback>{getInitials(u.name || u.username)}</AvatarFallback>
                      </Avatar>
                      {u.name || u.username || "User"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {u.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
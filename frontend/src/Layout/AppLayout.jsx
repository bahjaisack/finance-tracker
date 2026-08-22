import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore.js";
import {
  LayoutDashboard,
  Receipt,
  Tags,
  User,
  ShieldAlert,
  LogOut,
  Wallet,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const AppLayout = () => {
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", path: "/transactions", icon: Receipt },
    { label: "Categories", path: "/categories", icon: Tags },
    { label: "Profile", path: "/profile", icon: User },
  ];

  if (currentUser?.role === "admin") {
    navItems.push({ label: "Admin Panel", path: "/admin", icon: ShieldAlert });
  }

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const displayAvatar =
    currentUser?.profilePic ||
    currentUser?.avatar ||
    currentUser?.avatarUrl ||
    currentUser?.image ||
    "";

  if (isAuthLoading && !currentUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen m-0 p-0 overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <aside className="w-64 h-full shrink-0 border-r border-border bg-card flex flex-col justify-between p-4 shadow-sm z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <Wallet className="h-5 w-5" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground">
                Finance Tracker
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Workspace
              </span>
            </div>
          </div>

          <Separator />

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-950/50 dark:text-indigo-400"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-4">
          <Separator />

          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-accent/40 border border-border/50">
            <Avatar className="h-9 w-9 border border-indigo-100 dark:border-indigo-900 shrink-0">
              <AvatarImage
                key={displayAvatar || "no-avatar"}
                src={displayAvatar}
                alt={currentUser?.name || currentUser?.username || "User"}
              />

              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold dark:bg-indigo-950 dark:text-indigo-300">
                {getInitials(currentUser?.name || currentUser?.username)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-xs overflow-hidden min-w-0">
              <span className="font-semibold text-foreground truncate">
                {currentUser?.name || currentUser?.username || "User"}
              </span>

              <span className="text-muted-foreground truncate">
                {currentUser?.email || "No email available"}
              </span>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 border-none shadow-none"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 shrink-0 border-b border-border bg-card px-8 flex items-center justify-between">
          <h1 className="text-sm font-medium text-muted-foreground">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {currentUser?.name || currentUser?.username || "User"}
            </span>{" "}
          </h1>

          {currentUser?.role === "admin" && (
            <Badge
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300"
            >
              Admin Mode
            </Badge>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

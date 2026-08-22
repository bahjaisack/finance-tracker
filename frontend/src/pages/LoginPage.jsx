import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import apiClient from "../lib/api/apiClient";
import { useAuthStore } from "../lib/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post("/auth/login", data);

      const responseData = response.data?.data || response.data;
      const token = responseData.token;
      const userProfile = responseData.profile || responseData.user;

      if (!token) {
        throw new Error("No authentication token received from server.");
      }

      setAuth(userProfile, token);

 
 toast.success("Welcome Back!", {
      className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
      navigate("/dashboard");
    } catch (error) {
      console.error("Login submission error:", error);
      const message =
        error.response?.data?.message || "Invalid email or password.";
          toast.error(message, {
  className: "!bg-indigo-950 !text-indigo-100 !border-indigo-800 shadow-md",
});
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Finance Tracker
          </span>
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Take full control of your personal finances.
          </h1>
          <p className="text-slate-400 text-base">
            Track income, analyze spending metrics, manage categories, and stay
            ahead of your financial goals in one intuitive workspace.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          © 2026 Finance Tracker. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Sign up free
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                          className="focus-visible:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="focus-visible:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
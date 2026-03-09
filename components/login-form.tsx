"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* HEADER SECTION */}
      <div className="flex items-center gap-5 mb-4">
        <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-3 bg-slate-900">
          <KeyRound size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
            Welcome Back
          </h1>
          <div className="flex items-center gap-2 mt-2 text-slate-500">
            <ShieldCheck size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Session Entry</span>
          </div>
        </div>
      </div>

      <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-slate-100 rounded-[3rem] overflow-hidden">
        <CardHeader className="pb-2 pt-8">
          <CardTitle className="text-2xl font-black tracking-tight">Identity Verification</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Enter your credentials to access your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl h-14 bg-slate-50 border-none focus-visible:ring-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1" htmlFor="password">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl h-14 bg-slate-50 border-none focus-visible:ring-2"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase tracking-wider">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-16 bg-slate-900 text-white text-sm font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl hover:bg-slate-800 transition-all hover:scale-[1.01] active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Sign In"}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/auth/sign-up"
                className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm"
              >
                Don't have an account? <span className="underline decoration-2 underline-offset-4">Sign up</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
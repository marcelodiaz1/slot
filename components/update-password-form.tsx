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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

// Add onClose to the interface
interface UpdatePasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onClose?: () => void;
}

export function UpdatePasswordForm({
  className,
  onClose,  
  ...props
}: UpdatePasswordFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard/settings");
        if (onClose) onClose(); // Close modal on redirect
      }, 3000);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    // Added 'relative' to ensure the X button positions correctly
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
    
        <button 
          onClick={onClose}
          type="button"
          className="  -right-2 -top-2 p-2 text-slate-400 hover:text-slate-900 transition-colors z-50"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={3} />
        </button> 

      <Card className="border-none shadow-none">
        <CardContent className="pt-6 px-0"> {/* Adjusted padding for modal flushness */}
          {!isSuccess ? (
            <>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-black">Reset Your Password</CardTitle>
                <CardDescription>
                  Please enter your new password below.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="rounded-xl bg-slate-50 border-none h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-slate-900 rounded-xl font-bold uppercase tracking-widest text-xs" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Save new password"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Password Updated!</h3>
              <p className="text-slate-500 text-sm mb-8">
                Your security is our priority. Redirecting you to your settings...
              </p>
              <Button 
                onClick={() => {
                  router.push("/dashboard/settings");
                  if (onClose) onClose();
                }}
                className="w-full h-12 bg-slate-900 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
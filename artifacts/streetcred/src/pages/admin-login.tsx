import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { setAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        setAdminToken(res.token);
        toast({
          title: "Access Granted",
          description: "Welcome to the command center.",
        });
        setLocation("/admin");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid credentials.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <img src={logoPath} alt="Streetcred" className="w-24 h-24 border border-white/20" />
        </div>
        
        <div className="bg-card border border-white/10 p-8 shadow-2xl relative">
          {/* Glitch accent lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-transparent to-transparent opacity-50" />
          
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl tracking-widest uppercase text-white mb-2">System Access</h1>
            <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">Admin Terminal</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-xs tracking-widest uppercase text-muted-foreground">Email / Clearance ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@streetcred.com" 
                        {...field} 
                        className="rounded-none border-white/20 bg-black/50 h-12 font-mono text-sm focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-xs tracking-widest uppercase text-muted-foreground">Passcode</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="rounded-none border-white/20 bg-black/50 h-12 font-mono text-lg focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-xs" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full rounded-none h-14 font-display text-xl tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 mt-8"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Initialize Session"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

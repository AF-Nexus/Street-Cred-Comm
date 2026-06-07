import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: data.error || "Login failed" });
        return;
      }
      localStorage.setItem("streetcred_user_token", data.token);
      toast({ title: "Welcome back!" });
      setLocation("/");
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-10">
        <img src={logoPath} alt="Streetcred" className="w-20 h-20 object-cover border border-white/20" />
      </Link>

      <div className="w-full max-w-md border border-white/10 bg-card p-8">
        <h1 className="font-display text-4xl tracking-wider uppercase mb-2 text-center">Sign In</h1>
        <p className="text-muted-foreground font-sans text-sm text-center mb-8">
          New here?{" "}
          <Link href="/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Create an account
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="uppercase text-xs tracking-widest text-muted-foreground font-sans">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-none border-white/20 bg-black/50 h-12 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="uppercase text-xs tracking-widest text-muted-foreground font-sans">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-none border-white/20 bg-black/50 h-12 focus-visible:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-none font-display text-xl tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

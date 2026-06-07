import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: data.error || "Registration failed" });
        return;
      }
      localStorage.setItem("streetcred_user_token", data.token);
      toast({ title: "Account created! Welcome to StreetCred." });
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
        <h1 className="font-display text-4xl tracking-wider uppercase mb-2 text-center">Create Account</h1>
        <p className="text-muted-foreground font-sans text-sm text-center mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="uppercase text-xs tracking-widest text-muted-foreground font-sans">Username</label>
            <Input
              type="text"
              placeholder="your name or tag"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-none border-white/20 bg-black/50 h-12 focus-visible:ring-primary"
            />
          </div>

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
              placeholder="Min. 6 characters"
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
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}

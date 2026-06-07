import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useUserAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: data.error || "Registration failed" });
        return;
      }
      login(data.token);
      toast({ title: "Welcome to Streetcred!" });
      setLocation("/");
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-10 group">
        <img
          src={logoPath}
          alt="Streetcred"
          className="w-16 h-16 object-cover border border-zinc-800 group-hover:border-primary transition-colors"
        />
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl tracking-widest uppercase text-white mb-2">Create Account</h1>
          <p className="text-zinc-500 font-sans text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-sans text-xs uppercase tracking-widest text-zinc-500">Username</label>
            <Input
              type="text"
              placeholder="your name or tag"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="rounded-none border-zinc-800 bg-zinc-900 h-12 focus-visible:ring-primary text-white placeholder:text-zinc-600 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs uppercase tracking-widest text-zinc-500">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-none border-zinc-800 bg-zinc-900 h-12 focus-visible:ring-primary text-white placeholder:text-zinc-600 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs uppercase tracking-widest text-zinc-500">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-none border-zinc-800 bg-zinc-900 h-12 focus-visible:ring-primary text-white placeholder:text-zinc-600 font-sans pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-none font-display text-lg tracking-widest uppercase gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-zinc-600 text-xs font-sans">
          Own your narrative. Live on your terms.
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: data.error || "Reset failed" });
        return;
      }
      setDone(true);
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl tracking-widest uppercase text-white mb-3">Password Updated</h2>
          <p className="text-zinc-400 font-sans text-sm mb-8">You can now sign in with your new password.</p>
          <Button
            onClick={() => setLocation("/login")}
            className="w-full h-12 rounded-none font-display text-lg tracking-widest uppercase"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <LockKeyhole className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display text-3xl tracking-widest uppercase text-white mb-2">Reset Password</h1>
          <p className="text-zinc-500 font-sans text-sm">Enter the 6-digit code you received from WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="font-sans text-xs uppercase tracking-widest text-zinc-500">6-Digit Reset Code</label>
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              className="rounded-none border-zinc-800 bg-zinc-900 h-12 focus-visible:ring-primary text-white placeholder:text-zinc-600 font-mono text-xl tracking-[0.3em] text-center"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs uppercase tracking-widest text-zinc-500">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-none border-zinc-800 bg-zinc-900 h-12 focus-visible:ring-primary text-white placeholder:text-zinc-600 font-sans pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-none font-display text-lg tracking-widest uppercase gap-2 mt-2"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Updating..." : (
              <>
                <LockKeyhole className="w-4 h-4" />
                Reset Password
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-zinc-600 hover:text-zinc-400 font-sans text-xs transition-colors">
            Request a new code
          </Link>
        </div>
      </div>
    </div>
  );
}

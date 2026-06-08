import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, MessageCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ variant: "destructive", title: data.error || "Something went wrong" });
        return;
      }
      setSubmitted(true);
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
        {!submitted ? (
          <>
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl tracking-widest uppercase text-white mb-2">Forgot Password</h1>
              <p className="text-zinc-500 font-sans text-sm leading-relaxed">
                Enter your email. We'll generate a reset code for you.
                Then DM us on WhatsApp to receive it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-zinc-500">Your Email</label>
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

              <Button
                type="submit"
                className="w-full h-12 rounded-none font-display text-lg tracking-widest uppercase gap-2"
                disabled={loading}
              >
                {loading ? "Generating code..." : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Get Reset Code
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 font-sans text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl tracking-widest uppercase text-white mb-3">Code Ready</h2>
            <p className="text-zinc-400 font-sans text-sm leading-relaxed mb-8">
              Your reset code has been generated for{" "}
              <span className="text-white font-semibold">{email}</span>
            </p>

            <div className="bg-zinc-900 border border-zinc-800 p-5 mb-6 text-left space-y-3">
              <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-3">Next steps</p>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-primary-foreground font-display text-sm flex items-center justify-center shrink-0">1</span>
                <p className="text-zinc-300 font-sans text-sm">Open WhatsApp and message us</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-primary-foreground font-display text-sm flex items-center justify-center shrink-0">2</span>
                <p className="text-zinc-300 font-sans text-sm">Send your email address: <strong className="text-white">{email}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-primary-foreground font-display text-sm flex items-center justify-center shrink-0">3</span>
                <p className="text-zinc-300 font-sans text-sm">We'll send you the 6-digit code. Then use it below to reset.</p>
              </div>
            </div>

            <a
              href={`https://wa.me/265993702468?text=${encodeURIComponent(`Hi StreetCred! I forgot my password. My account email is: ${email}. Please send me my reset code.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 bg-green-600 hover:bg-green-500 text-white font-display text-lg tracking-widest uppercase transition-colors mb-4"
            >
              <MessageCircle className="w-5 h-5" />
              Message on WhatsApp
            </a>

            <Link
              href="/reset-password"
              className="block w-full h-12 border border-zinc-700 text-zinc-300 hover:border-primary hover:text-primary font-display text-lg tracking-widest uppercase transition-colors flex items-center justify-center"
            >
              I Have My Code →
            </Link>

            <div className="mt-4">
              <Link href="/login" className="text-zinc-600 hover:text-zinc-400 font-sans text-xs transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Search, Menu, X } from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={logoPath}
            alt="Streetcred Logo"
            className="h-12 w-12 object-cover border border-white/20 group-hover:border-primary transition-colors"
          />
          <span className="font-display text-3xl tracking-widest uppercase hidden sm:inline-block group-hover:text-primary transition-colors">
            Streetcred
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-display text-xl tracking-wider">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link>
          <Link href="/shop?category=Hoodies" className="hover:text-primary transition-colors">Hoodies</Link>
          <Link href="/shop?category=Tees" className="hover:text-primary transition-colors">Tees</Link>
          <Link href="/shop?category=Accessories" className="hover:text-primary transition-colors">Accessories</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/shop" className="p-2 hover:text-primary transition-colors" aria-label="Search">
            <Search className="w-6 h-6" />
          </Link>
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 border border-white/20 px-4 py-2 font-display text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <button
            className="md:hidden p-2 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background py-4 px-4 flex flex-col gap-4 font-display text-2xl tracking-wider">
          <Link href="/shop" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
          <Link href="/shop?category=Hoodies" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Hoodies</Link>
          <Link href="/shop?category=Tees" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Tees</Link>
          <Link href="/shop?category=Accessories" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
          <Link href="/login" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
        </div>
      )}
    </nav>
  );
}

import { Link, useLocation } from "wouter";
import { Search, Menu, X, User, LogOut, ShoppingBag, ChevronDown } from "lucide-react";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";
import { useState } from "react";
import { useUserAuth } from "@/contexts/UserAuthContext";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useUserAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300"
      style={{ background: isLoggedIn ? "rgba(9,9,11,0.97)" : "rgba(0,0,0,0.95)", borderColor: isLoggedIn ? "#27272a" : "rgba(255,255,255,0.08)" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={logoPath}
            alt="Streetcred Logo"
            className="h-9 w-9 object-cover border transition-colors"
            style={{ borderColor: isLoggedIn ? "#3f3f46" : "rgba(255,255,255,0.15)" }}
          />
          {!isLoggedIn && (
            <span className="font-display text-2xl tracking-widest uppercase hidden sm:inline-block group-hover:text-primary transition-colors">
              Streetcred
            </span>
          )}
          {isLoggedIn && (
            <span className="font-display text-xl tracking-widest uppercase hidden sm:inline-block text-zinc-300 group-hover:text-primary transition-colors">
              Streetcred
            </span>
          )}
        </Link>

        {/* Guest nav links */}
        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-7 font-display text-lg tracking-wider">
            <Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link>
            <Link href="/shop?category=Hoodies" className="hover:text-primary transition-colors">Hoodies</Link>
            <Link href="/shop?category=Tees" className="hover:text-primary transition-colors">Tees</Link>
            <Link href="/shop?category=Accessories" className="hover:text-primary transition-colors">Accessories</Link>
          </div>
        )}

        {/* Logged-in category strip */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {["All", "Hoodies", "Tees", "Bottoms", "Accessories"].map((cat) => (
              <Link
                key={cat}
                href={cat === "All" ? "/" : `/?category=${cat}`}
                className="px-3 py-1.5 font-sans text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors uppercase tracking-widest rounded-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Search icon */}
          <Link href="/shop" className="p-2 text-zinc-400 hover:text-primary transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </Link>

          {/* Guest: Sign In */}
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 border border-white/20 px-4 py-2 font-display text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <button
                className="md:hidden p-2 text-zinc-400 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          )}

          {/* Logged in: user avatar + dropdown */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1.5 border border-zinc-800 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 transition-colors group"
              >
                <div className="w-7 h-7 bg-primary flex items-center justify-center">
                  <span className="font-display text-sm text-primary-foreground uppercase">
                    {user?.username?.[0] ?? "U"}
                  </span>
                </div>
                <span className="font-sans text-sm text-zinc-300 group-hover:text-white hidden sm:inline-block max-w-[120px] truncate">
                  {user?.username}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 z-50 shadow-xl shadow-black/50">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest">Signed in as</p>
                      <p className="font-display text-sm text-white tracking-wider mt-0.5 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/shop"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors font-sans"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Browse Shop
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors font-sans"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Guest mobile menu */}
      {!isLoggedIn && isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black py-4 px-4 flex flex-col gap-3 font-display text-xl tracking-wider">
          <Link href="/shop" className="hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
          <Link href="/shop?category=Hoodies" className="hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>Hoodies</Link>
          <Link href="/shop?category=Tees" className="hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>Tees</Link>
          <Link href="/shop?category=Accessories" className="hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
          <Link href="/login" className="text-primary hover:text-primary/80 transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
        </div>
      )}
    </nav>
  );
}

import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { useListProducts, useGetFeaturedProducts } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { formatPrice, getCurrency } from "@/lib/currency";
import {
  Search, SlidersHorizontal, Flame, Tag, Layers,
  ShoppingBag, ArrowRight, Sparkles, Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Hoodies", "Tees", "Bottoms", "Accessories", "Hats"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Layers className="w-4 h-4" />,
  Hoodies: <ShoppingBag className="w-4 h-4" />,
  Tees: <Tag className="w-4 h-4" />,
  Bottoms: <Tag className="w-4 h-4" />,
  Accessories: <Sparkles className="w-4 h-4" />,
  Hats: <Tag className="w-4 h-4" />,
};

function LiveClock({ country }: { country: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const currency = getCurrency(country);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5 text-primary font-mono text-lg font-bold tabular-nums">
        <Clock className="w-4 h-4" />
        {timeStr}
      </div>
      <div className="flex items-center gap-2 text-zinc-500 font-sans text-xs">
        <span>{dateStr}</span>
        <span>·</span>
        <span>{currency.code} ({currency.symbol})</span>
      </div>
    </div>
  );
}

export default function StoreHome() {
  const { user } = useUserAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const { data: products, isLoading } = useListProducts();
  const { data: featured } = useGetFeaturedProducts();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (showOnlyAvailable && p.available === 0) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [products, activeCategory, showOnlyAvailable, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* Personal greeting banner */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest mb-1">{greeting}</p>
            <h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-white">
              Welcome back, <span className="text-primary">{user?.username ?? "friend"}</span>
            </h1>
            {featured && featured.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Flame className="w-4 h-4 text-primary" />
                <span className="font-sans text-sm text-zinc-400">
                  {featured.length} new {featured.length === 1 ? "drop" : "drops"} available
                </span>
              </div>
            )}
          </div>
          <LiveClock country={user?.country ?? "MW"} />
        </div>
      </div>

      {/* New drops horizontal strip */}
      {featured && featured.length > 0 && (
        <div className="border-b border-zinc-800 bg-black/40 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl tracking-widest uppercase text-white">New Drops</h2>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1 font-sans text-xs text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group flex-shrink-0 snap-start w-40 md:w-52 border border-zinc-800 hover:border-primary transition-colors bg-zinc-900 overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-800 relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground font-display text-xs tracking-widest px-2 py-0.5">
                      NEW
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-display text-sm tracking-widest uppercase text-white line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <p className="font-mono text-xs text-zinc-400 mt-1">
                      {formatPrice(product.price, user?.country)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main shop area */}
      <div className="container mx-auto px-4 py-10">

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-none border-zinc-800 bg-zinc-900 h-11 focus-visible:ring-primary text-white placeholder:text-zinc-600 font-sans"
            />
          </div>
          <Button
            variant="outline"
            className={`rounded-none h-11 gap-2 border-zinc-800 font-sans text-sm uppercase tracking-widest px-5 transition-colors ${
              showOnlyAvailable
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600"
            }`}
            onClick={() => setShowOnlyAvailable((v) => !v)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showOnlyAvailable ? "In Stock Only" : "Show All"}
          </Button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 font-display text-sm tracking-widest uppercase transition-all border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-primary/50 hover:text-white"
              }`}
            >
              {CATEGORY_ICONS[cat]}
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-sans text-zinc-500 text-xs uppercase tracking-widest">
            {isLoading ? "Loading..." : `${filteredProducts.length} item${filteredProducts.length !== 1 ? "s" : ""}`}
          </p>
          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="font-sans text-xs text-zinc-500 hover:text-primary uppercase tracking-widest underline underline-offset-4 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading
            ? Array(10).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : filteredProducts.length > 0
            ? filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} country={user?.country} />
              ))
            : (
              <div className="col-span-full py-24 text-center border border-zinc-800 bg-zinc-900/50">
                <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="font-display text-3xl text-zinc-600 tracking-widest uppercase">Nothing here</p>
                <p className="text-zinc-700 font-sans text-sm mt-2">Try a different category or search</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

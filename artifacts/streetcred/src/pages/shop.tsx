import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Hoodies", "Tees", "Bottoms", "Accessories", "Hats"];

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Fetch all products
  const { data: products, isLoading } = useListProducts();

  // Filter products locally based on state
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      // Filter by category
      if (activeCategory !== "All" && product.category !== activeCategory) {
        return false;
      }
      
      // Filter by availability
      if (showOnlyAvailable && product.available === 0) {
        return false;
      }
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) || 
               (product.description && product.description.toLowerCase().includes(query));
      }
      
      return true;
    });
  }, [products, activeCategory, showOnlyAvailable, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
      <div className="mb-16">
        <h1 className="font-display text-6xl md:text-8xl tracking-wider uppercase leading-none mb-4">
          The Vault
        </h1>
        <div className="h-1 w-32 bg-primary mb-8" />
        <p className="font-sans text-xl text-muted-foreground max-w-2xl">
          Browse the full Streetcred collection. Raw, authentic streetwear.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 flex-shrink-0">
          <div className="sticky top-28 border border-white/10 p-6 bg-card">
            <h3 className="font-display text-2xl tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Filter</h3>
            
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-white/20 rounded-none h-12 focus-visible:ring-primary font-sans"
                />
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Categories</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`text-left font-display tracking-wider text-xl uppercase py-2 px-3 transition-colors border-l-2 ${
                      activeCategory === category 
                        ? "border-primary text-primary bg-primary/5" 
                        : "border-transparent text-muted-foreground hover:text-white hover:border-white/30"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Availability</h4>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${showOnlyAvailable ? 'border-primary bg-primary' : 'border-white/30 group-hover:border-white/60'}`}>
                  {showOnlyAvailable && <div className="w-2 h-2 bg-primary-foreground" />}
                </div>
                <span className="font-sans text-sm tracking-wider uppercase">Hide Sold Out</span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <span className="font-sans text-sm tracking-widest uppercase text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'} Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center border border-dashed border-white/20">
                <h3 className="font-display text-4xl text-muted-foreground tracking-widest uppercase mb-4">Nothing Found</h3>
                <p className="font-sans text-muted-foreground">No products match your current filters.</p>
                <button 
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                    setShowOnlyAvailable(false);
                  }}
                  className="mt-6 font-sans text-sm uppercase tracking-widest underline decoration-primary underline-offset-8 hover:text-primary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

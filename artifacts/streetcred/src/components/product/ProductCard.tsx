import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react/src/generated/api.schemas";

export function ProductCard({ product }: { product: Product }) {
  const isSoldOut = product.available === 0;

  return (
    <Link href={`/product/${product.id}`} className="group block relative border border-white/10 hover:border-primary transition-colors bg-card h-full flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-muted-foreground/30 text-4xl">NO IMAGE</div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <div className="border-2 border-destructive text-destructive font-display text-3xl tracking-widest uppercase px-6 py-2 rotate-[-12deg] shadow-[0_0_15px_rgba(220,38,38,0.5)] bg-black/40">
              Sold Out
            </div>
          </div>
        )}

        {product.featured === 1 && !isSoldOut && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-display text-sm tracking-wider px-3 py-1">
            NEW DROP
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between border-t border-white/5 relative z-10 bg-card">
        <div>
          {product.category && (
            <p className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">{product.category}</p>
          )}
          <h3 className="font-display text-2xl tracking-wide uppercase line-clamp-2 leading-none mb-3 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="text-xl font-bold font-sans tracking-tight">
          MWK {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block relative border border-white/10 bg-card h-full flex flex-col animate-pulse">
      <div className="relative aspect-[3/4] bg-white/5"></div>
      <div className="p-5 flex-grow flex flex-col justify-between border-t border-white/5">
        <div>
          <div className="h-3 w-16 bg-white/10 mb-3"></div>
          <div className="h-6 w-3/4 bg-white/10 mb-2"></div>
          <div className="h-6 w-1/2 bg-white/10 mb-4"></div>
        </div>
        <div className="h-5 w-1/3 bg-white/10"></div>
      </div>
    </div>
  );
}

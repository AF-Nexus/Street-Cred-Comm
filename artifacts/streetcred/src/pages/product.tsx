import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { getGetProductQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0");

  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: {
      enabled: !!productId,
      queryKey: getGetProductQueryKey(productId),
    }
  });

  const [selectedSize, setSelectedSize] = useState<string>("");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <Skeleton className="w-full aspect-[3/4] bg-white/5 rounded-none" />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <Skeleton className="w-24 h-4 bg-white/5" />
            <Skeleton className="w-3/4 h-12 bg-white/5" />
            <Skeleton className="w-32 h-8 bg-white/5" />
            <Skeleton className="w-full h-32 bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-display text-4xl mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline" className="rounded-none border-white/20">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const sizes = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
  const isSoldOut = product.available === 0;

  const handleWhatsAppOrder = () => {
    let text = `Hi Streetcred! I want to order: ${product.name} - MWK${product.price}`;
    if (selectedSize) {
      text += ` - Size: ${selectedSize}`;
    }
    const url = `https://wa.me/265993702468?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Link href="/shop" className="inline-flex items-center gap-2 font-display tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Vault
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <div className="relative border border-white/10 bg-card aspect-[3/4] overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-muted-foreground/30 text-6xl">
                NO IMAGE
              </div>
            )}

            {isSoldOut && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                <div className="border-4 border-destructive text-destructive font-display text-5xl tracking-widest uppercase px-8 py-3 rotate-[-12deg] shadow-[0_0_30px_rgba(220,38,38,0.3)] bg-black/60">
                  Sold Out
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          {product.category && (
            <div className="text-primary font-sans text-sm font-bold tracking-widest uppercase mb-4">
              {product.category}
            </div>
          )}

          <h1 className="font-display text-5xl md:text-7xl tracking-wider uppercase leading-none mb-6">
            {product.name}
          </h1>

          <div className="font-sans text-3xl font-bold tracking-tight mb-8">
            MWK {product.price.toLocaleString()}
          </div>

          <div className="w-full h-px bg-white/10 mb-8" />

          {product.description && (
            <div className="font-sans text-lg text-muted-foreground leading-relaxed mb-10 whitespace-pre-wrap">
              {product.description}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-sans text-sm font-bold tracking-widest uppercase text-muted-foreground">Select Size</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isSoldOut}
                    className={`h-12 px-6 font-display text-xl tracking-wider transition-all border ${
                      selectedSize === size 
                        ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(253,224,71,0.3)]' 
                        : 'bg-transparent text-foreground border-white/20 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-auto pt-8">
            <Button 
              size="lg" 
              className={`h-16 rounded-none font-display text-2xl tracking-wider transition-all ${
                isSoldOut 
                  ? 'bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive/20 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]'
              }`}
              onClick={handleWhatsAppOrder}
              disabled={isSoldOut || (sizes.length > 0 && !selectedSize)}
            >
              <MessageCircle className="mr-3 w-6 h-6" />
              {isSoldOut ? 'SOLD OUT' : 'ORDER ON WHATSAPP'}
            </Button>
            
            {!isSoldOut && sizes.length > 0 && !selectedSize && (
              <p className="text-destructive font-sans text-sm text-center">Please select a size to order</p>
            )}
            
            <p className="text-center font-sans text-xs text-muted-foreground tracking-wide uppercase mt-4">
              Secure payments • Nationwide delivery in Malawi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

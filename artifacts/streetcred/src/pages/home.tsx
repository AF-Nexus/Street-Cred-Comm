import { Link } from "wouter";
import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function Home() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-background z-0">
          {/* Abstract noise/texture would go here - CSS only */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>
        
        <div className="container relative z-10 px-4 py-20 flex flex-col items-center text-center">
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
            <img 
              src={logoPath} 
              alt="Streetcred" 
              className="w-40 h-40 md:w-56 md:h-56 object-cover border-2 border-white/20 relative z-10 shadow-2xl" 
            />
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-[0.85] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Command <br/><span className="text-primary bg-none bg-primary filter drop-shadow-[0_0_20px_rgba(253,224,71,0.3)]">Respect</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground font-sans mb-10 tracking-wide">
            Exclusive streetwear drops from Malawi. Raw urban energy. Limited quantities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="h-16 px-10 rounded-none font-display text-2xl tracking-wider hover:bg-primary/90 bg-primary text-primary-foreground border border-primary hover:scale-105 transition-transform">
              <Link href="/shop">Shop The Drop</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-none font-display text-2xl tracking-wider border-white/20 hover:bg-white/5 hover:text-white hover:border-white/40 group">
              <a href="https://wa.me/265993702468" target="_blank" rel="noreferrer" className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                WhatsApp Order
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 border-b border-white/10 relative">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-display text-5xl md:text-7xl tracking-wider uppercase leading-none mb-2">
                New Arrivals
              </h2>
              <div className="h-1 w-24 bg-primary" />
            </div>
            <Link href="/shop" className="group flex items-center gap-2 font-display text-xl tracking-wider text-muted-foreground hover:text-primary transition-colors">
              View All <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-white/10 bg-white/5">
                <h3 className="font-display text-3xl text-muted-foreground tracking-widest uppercase">Drops Coming Soon</h3>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-32 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-black/10 blur-3xl rounded-full pointer-events-none" />
        <div className="container px-4 mx-auto relative z-10 max-w-4xl text-center">
          <h2 className="font-display text-6xl md:text-8xl tracking-tight uppercase leading-[0.9] mb-8">
            Not For Everyone. <br/> Just For You.
          </h2>
          <p className="font-sans text-xl md:text-2xl font-medium tracking-wide max-w-2xl mx-auto opacity-90 border-l-4 border-black pl-6 text-left">
            Streetcred isn't just clothing. It's a statement. Born in Malawi, built for the streets worldwide. We don't restock. When it's gone, it's gone.
          </p>
        </div>
      </section>
    </div>
  );
}

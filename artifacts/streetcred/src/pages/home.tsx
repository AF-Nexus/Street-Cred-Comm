import { Link } from "wouter";
import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { ArrowRight, Mic2, Radio, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";

export default function Home() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          {/* Hero featured images as background collage */}
          {featuredProducts && featuredProducts.length > 0 && (
            <div className="absolute inset-0 grid grid-cols-3 opacity-20">
              {featuredProducts.slice(0, 6).map((p) =>
                p.imageUrl ? (
                  <div key={p.id} className="overflow-hidden">
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : null
              )}
            </div>
          )}
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

          <p className="uppercase tracking-[0.4em] text-primary font-sans text-sm font-bold mb-6">
            Bold · Urban · Authentic
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] mb-8 max-w-4xl">
            Own Your Narrative.<br />
            <span className="text-primary">Live On Your Terms.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-sans mb-10 leading-relaxed">
            StreetCred is a lifestyle brand that celebrates the raw, unfiltered essence of city life,
            culture, and creativity. With its sleek logo and edgy vibe, StreetCred is all about owning
            your narrative and living life on your terms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="h-16 px-10 rounded-none font-display text-2xl tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
            >
              <Link href="/shop">Shop The Drop</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-16 px-10 rounded-none font-display text-2xl tracking-wider border-white/20 hover:bg-white/5 hover:text-white hover:border-white/40 group"
            >
              <a href="#podcast" className="flex items-center gap-3">
                <Mic2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                The Podcast
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 border-b border-white/10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-display text-5xl md:text-7xl tracking-wider uppercase leading-none mb-2">
                New Drops
              </h2>
              <div className="h-1 w-24 bg-primary" />
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-2 font-display text-xl tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              View All <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-white/10 bg-white/5">
                <h3 className="font-display text-3xl text-muted-foreground tracking-widest uppercase">
                  Drops Coming Soon
                </h3>
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
            A Bold, Urban Brand.
          </h2>
          <p className="font-sans text-xl md:text-2xl font-medium tracking-wide max-w-2xl mx-auto opacity-90 border-l-4 border-black pl-6 text-left">
            StreetCred embodies the spirit of authenticity and street smarts. Born in the streets,
            built for those who live life unapologetically. Limited releases. When it's gone, it's gone.
          </p>
        </div>
      </section>

      {/* Podcast Section */}
      <section id="podcast" className="py-32 border-b border-white/10">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <Radio className="w-8 h-8 text-primary" />
            <p className="uppercase tracking-[0.4em] text-primary font-sans text-sm font-bold">
              Now Playing
            </p>
          </div>

          <h2 className="font-display text-5xl md:text-7xl tracking-wider uppercase leading-none mb-6">
            StreetCred<br />
            <span className="text-primary">Podcast</span>
          </h2>

          <div className="h-1 w-24 bg-primary mb-10" />

          <p className="font-sans text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Tune into the StreetCred podcast where <strong className="text-white">real talk meets urban grit.</strong>{" "}
            Join the conversation as hosts and special guests dive into the untold stories, trends, and
            insights shaping the streets. From music and culture to lifestyle and beyond — StreetCred is
            where authenticity meets the pavement.
          </p>
          <div className="flex items-center gap-2 mb-6 text-muted-foreground font-sans text-sm">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Real conversations. No filter.</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-3 border border-primary/40 bg-primary/5 px-6 py-4">
              <Mic2 className="w-5 h-5 text-primary" />
              <div>
                <div className="font-display text-xs tracking-widest uppercase text-muted-foreground mb-1">Host</div>
                <div className="font-display text-2xl tracking-wider text-white">LiamEffect</div>
              </div>
            </div>
            <div className="flex items-center gap-3 border border-primary/40 bg-primary/5 px-6 py-4">
              <Mic2 className="w-5 h-5 text-primary" />
              <div>
                <div className="font-display text-xs tracking-widest uppercase text-muted-foreground mb-1">Host</div>
                <div className="font-display text-2xl tracking-wider text-white">HeadMaster</div>
              </div>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="h-16 px-10 rounded-none font-display text-2xl tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/shop">Shop The Brand</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

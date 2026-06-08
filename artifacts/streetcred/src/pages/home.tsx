import { Link } from "wouter";
import { useGetFeaturedProducts, useGetPodcastEmbed } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { ArrowRight, Mic2, Radio, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";
import heroImg1 from "@assets/IMG-20260608-WA0049_1780928591341.jpg";
import heroImg2 from "@assets/IMG-20260608-WA0050_1780928608781.jpg";
import heroImg3 from "@assets/IMG-20260608-WA0051_1780928619646.jpg";
import heroImg4 from "@assets/IMG-20260608-WA0052_1780928632838.jpg";
import { useState, useEffect } from "react";

const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Home() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts();
  const { data: podcastEmbed } = useGetPodcastEmbed();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlide(currentSlide);
      setTransitioning(true);
      const next = (currentSlide + 1) % heroImages.length;
      setCurrentSlide(next);
      const timeout = setTimeout(() => {
        setPrevSlide(null);
        setTransitioning(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Slideshow background */}
        <div className="absolute inset-0 z-0">
          {/* Prev slide (fading out) */}
          {prevSlide !== null && (
            <div
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
              style={{ opacity: transitioning ? 0 : 1 }}
            >
              <img
                src={heroImages[prevSlide]}
                alt=""
                className="w-full h-full object-cover scale-110"
              />
            </div>
          )}
          {/* Current slide (Ken Burns zoom) */}
          <div
            key={currentSlide}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: transitioning ? 1 : 1 }}
          >
            <img
              src={heroImages[currentSlide]}
              alt=""
              className="w-full h-full object-cover"
              style={{
                animation: "kenBurns 4.5s ease-in-out forwards",
              }}
            />
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-none transition-all duration-500 ${
                i === currentSlide ? "bg-primary w-8" : "bg-white/30 w-4 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        <div className="container relative z-10 px-4 py-20 flex flex-col items-center text-center">
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-full" />
            <img
              src={logoPath}
              alt="Streetcred"
              className="w-40 h-40 md:w-56 md:h-56 object-cover border-2 border-white/30 relative z-10 shadow-2xl"
            />
          </div>

          <p className="uppercase tracking-[0.4em] text-primary font-sans text-sm font-bold mb-6">
            Bold · Urban · Authentic
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] mb-8 max-w-4xl">
            Own Your Narrative.<br />
            <span className="text-primary">Live On Your Terms.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 font-sans mb-10 leading-relaxed">
            StreetCred is a lifestyle brand that celebrates the raw, unfiltered essence of city life,
            culture, and creativity. Born in the streets, built for those who live life unapologetically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
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
              className="h-16 px-10 rounded-none font-display text-2xl tracking-wider border-white/30 hover:bg-white/10 hover:text-white hover:border-white/60 group"
            >
              <a href="#podcast" className="flex items-center gap-3">
                <Mic2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                The Podcast
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <span className="uppercase tracking-[0.3em] text-white/40 font-sans text-xs">Follow</span>
            <div className="h-px w-8 bg-white/20" />
            <a
              href="https://www.instagram.com/streetcred256?igsh=MTN3OWJldGg3bWkwYw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-primary transition-colors duration-300 hover:scale-110 transform"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com/@streetcred256"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-primary transition-colors duration-300 hover:scale-110 transform"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@streetcredpodcast?si=yWXnKjlvOSx7tP7u"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-primary transition-colors duration-300 hover:scale-110 transform"
              aria-label="YouTube"
            >
              <YouTubeIcon className="w-6 h-6" />
            </a>
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

          {/* Podcast embed */}
          {podcastEmbed && podcastEmbed.embedUrl && (
            <div className="mb-10 border border-white/10 bg-black overflow-hidden">
              {podcastEmbed.title && (
                <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                  <p className="font-display text-sm tracking-widest uppercase text-muted-foreground">{podcastEmbed.title}</p>
                </div>
              )}
              <iframe
                src={podcastEmbed.embedUrl}
                className="w-full"
                style={{ height: 180 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="StreetCred Podcast"
              />
            </div>
          )}

          {/* Social + CTA */}
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-none font-display text-xl tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/shop">Shop The Brand</Link>
            </Button>
            <div className="flex items-center gap-4">
              <a
                href="https://youtube.com/@streetcredpodcast?si=yWXnKjlvOSx7tP7u"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-sans text-sm uppercase tracking-widest"
              >
                <YouTubeIcon className="w-5 h-5" /> Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}

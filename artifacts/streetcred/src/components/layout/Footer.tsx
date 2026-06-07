import { Link } from "wouter";
import logoPath from "@assets/IMG-20260606-WA0072_1780821751075.jpg";
import { Instagram, Twitter, Facebook, Mic2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <img src={logoPath} alt="Streetcred Logo" className="h-16 w-16 object-cover border border-white/20" />
            </Link>
            <p className="text-muted-foreground max-w-sm font-sans mb-4 leading-relaxed">
              StreetCred is a bold, urban brand and podcast that embodies the spirit of authenticity and street smarts. 🌆
            </p>
            <div className="flex items-center gap-2 mb-6 text-primary font-sans text-sm">
              <Mic2 className="w-4 h-4" />
              <span>Hosted by <strong>LiamEffect</strong> &amp; <strong>HeadMaster</strong></span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-2xl tracking-wider mb-6">Shop</h4>
            <ul className="flex flex-col gap-3 text-muted-foreground font-sans">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Hoodies" className="hover:text-primary transition-colors">Hoodies</Link></li>
              <li><Link href="/shop?category=Tees" className="hover:text-primary transition-colors">Tees</Link></li>
              <li><Link href="/shop?category=Accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-2xl tracking-wider mb-6">Account</h4>
            <ul className="flex flex-col gap-3 text-muted-foreground font-sans">
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><a href="#podcast" className="hover:text-primary transition-colors">The Podcast</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>Copyright© reserved</p>
          <p>
            Website designed by{" "}
            <a href="https://frankkaumba.gamer.gd" target="_blank" rel="noreferrer" className="text-white hover:text-primary underline decoration-primary/50 underline-offset-4 transition-colors">
              Frankkaumbadev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PromotionalBanner = () => {
  return (
    <section className="py-16 bg-cover bg-center relative" 
      style={{ 
        backgroundImage: `url(https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?q=80&w=2680)` 
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="ethnic-container relative z-10">
        <div className="max-w-lg mx-auto text-center text-white">
          <h2 className="font-serif text-4xl mb-4">Special Occasion Collection</h2>
          <p className="text-lg mb-8 text-white/90">
            Elegance for every celebration. Discover our premium festive and bridal collections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/category/lehengas">
              <Button className="bg-ethnic-gold text-foreground hover:bg-ethnic-gold/90 min-w-40">
                Shop Wedding
              </Button>
            </Link>
            <Link to="/category/sarees">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 min-w-40">
                Shop Festive
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;

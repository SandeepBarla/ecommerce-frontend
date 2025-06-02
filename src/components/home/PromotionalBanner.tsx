import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const PromotionalBanner = () => {
  return (
    <section
      className="py-12 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?q=80&w=2680)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-purple-900/50"></div>

      <div className="absolute top-8 left-8 opacity-20">
        <div className="w-24 h-24 border border-white/30 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-8 right-8 opacity-20">
        <div className="w-20 h-20 border border-ethnic-gold/40 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="ethnic-container relative z-10">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="flex justify-center mb-4">
            <Badge className="bg-ethnic-gold/20 text-ethnic-gold border border-ethnic-gold/30 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Collection
            </Badge>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
            <span className="block text-white">Special Occasion</span>
            <span className="block text-ethnic-gold">Collection</span>
          </h2>

          <p className="text-base md:text-lg mb-6 text-white/90 leading-relaxed max-w-lg mx-auto">
            Celebrate life's precious moments in exquisite handcrafted
            ensembles. From intimate ceremonies to grand celebrations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/category/lehengas" className="group">
              <Button className="bg-ethnic-gold text-black hover:bg-ethnic-gold/90 px-6 py-3 text-base font-semibold rounded-full shadow-2xl hover:shadow-ethnic-gold/25 transition-all duration-300 hover:scale-105 min-w-[180px] group-hover:animate-pulse">
                <Heart className="w-4 h-4 mr-2 group-hover:text-red-600 transition-colors" />
                Wedding Collection
              </Button>
            </Link>
            <Link to="/category/sarees" className="group">
              <Button
                variant="outline"
                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-ethnic-purple backdrop-blur-sm px-6 py-3 text-base font-semibold rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 min-w-[180px]"
              >
                <Sparkles className="w-4 h-4 mr-2 group-hover:text-ethnic-purple transition-colors" />
                Festive Collection
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-ethnic-gold to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-ethnic-gold rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white rounded-full animate-ping opacity-40 delay-700"></div>
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-ethnic-gold rounded-full animate-pulse opacity-80"></div>
    </section>
  );
};

export default PromotionalBanner;

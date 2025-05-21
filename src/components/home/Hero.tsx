
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Slide {
  image: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
    heading: "Festival Collection",
    subheading: "Celebrate this festive season with our exclusive collection",
    buttonText: "Explore Collection",
    buttonLink: "/category/sarees"
  },
  {
    image: "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
    heading: "Wedding Season Essentials",
    subheading: "Timeless elegance for your special occasions",
    buttonText: "Discover More",
    buttonLink: "/category/lehengas"
  },
  {
    image: "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
    heading: "Designer Fusion Wear",
    subheading: "Contemporary designs with traditional craftsmanship",
    buttonText: "Shop Now",
    buttonLink: "/category/salwar-kameez"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Slides */}
      <div className="h-full">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Image background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            
            {/* Content */}
            <div className="relative h-full ethnic-container flex items-center">
              <div className="max-w-2xl animate-slide-up">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                  {slide.heading}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8">
                  {slide.subheading}
                </p>
                <Link to={slide.buttonLink}>
                  <Button className="bg-ethnic-gold text-foreground hover:bg-ethnic-gold/90 text-base px-8 py-6">
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

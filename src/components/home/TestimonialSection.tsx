
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating: number;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    avatar: "https://i.pravatar.cc/150?img=32",
    text: "I received so many compliments on my Banarasi silk saree at my cousin's wedding. The quality and craftsmanship are exceptional. Will definitely be ordering again!",
    rating: 5,
    product: "Embroidered Silk Saree"
  },
  {
    id: "2",
    name: "Neha Gupta",
    location: "Delhi, NCR",
    avatar: "https://i.pravatar.cc/150?img=47",
    text: "The Anarkali suit I ordered fit perfectly and looked even more beautiful than in the pictures. The delivery was prompt and the packaging was excellent.",
    rating: 5,
    product: "Designer Anarkali Suit"
  },
  {
    id: "3",
    name: "Aisha Patel",
    location: "Bangalore, Karnataka",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "The lehenga I purchased for my engagement exceeded my expectations. The detailing is intricate and the fabric is luxurious. EthnicElegance has become my go-to for special occasions.",
    rating: 4,
    product: "Bridal Lehenga Choli"
  }
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);
  
  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };
  
  const previous = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-16 bg-muted">
      <div className="ethnic-container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl mb-3">Customer Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read what our customers have to say about their experience
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
                    {/* Stars */}
                    <div className="flex mb-4 text-ethnic-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < testimonial.rating ? "fill-ethnic-gold text-ethnic-gold" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    
                    {/* Testimonial text */}
                    <blockquote className="text-lg italic mb-6">
                      "{testimonial.text}"
                    </blockquote>
                    
                    {/* Product */}
                    <p className="text-sm text-muted-foreground mb-4">
                      Purchased: <span className="text-foreground">{testimonial.product}</span>
                    </p>
                    
                    {/* Customer info */}
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={previous}
              className="p-2 rounded-full border border-border mr-4 hover:bg-ethnic-purple hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={next}
              className="p-2 rounded-full border border-border hover:bg-ethnic-purple hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Dots */}
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`mx-1 w-2 h-2 rounded-full ${
                  current === index ? "bg-ethnic-purple" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

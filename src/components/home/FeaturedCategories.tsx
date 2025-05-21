
import { Link } from "react-router-dom";

interface Category {
  name: string;
  image: string;
  link: string;
  items: number;
}

const categories: Category[] = [
  {
    name: "Sarees",
    image: "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?q=80&w=2574",
    link: "/category/sarees",
    items: 120
  },
  {
    name: "Lehengas",
    image: "https://images.unsplash.com/photo-1609748340878-81303d781f51?q=80&w=2574",
    link: "/category/lehengas",
    items: 85
  },
  {
    name: "Salwar Kameez",
    image: "https://images.unsplash.com/photo-1610030469668-0fb076ad5cd2?q=80&w=2574",
    link: "/category/salwar-kameez",
    items: 95
  },
  {
    name: "Kurtis",
    image: "https://images.unsplash.com/photo-1614889555266-0e1184518e71?q=80&w=2574",
    link: "/category/kurtis",
    items: 150
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="ethnic-container">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl mb-3">Shop By Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections of traditional and contemporary Indian ethnic wear
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={category.link} 
              className="group relative h-80 overflow-hidden rounded-lg ethnic-card"
            >
              {/* Image */}
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                style={{ backgroundImage: `url(${category.image})` }} 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="font-serif text-2xl mb-1 group-hover:text-ethnic-gold transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/80">
                  {category.items} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

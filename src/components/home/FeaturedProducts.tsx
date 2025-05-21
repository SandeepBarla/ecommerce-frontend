
import { useShop, Product } from "@/contexts/ShopContext";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  products?: Product[];
  limit?: number;
}

const FeaturedProducts = ({
  title = "Featured Collection",
  subtitle = "Discover our most popular styles and designs",
  viewAllLink = "/category/lehengas",
  viewAllText = "View All Products",
  products,
  limit = 4
}: FeaturedProductsProps) => {
  const { featuredProducts: contextFeaturedProducts } = useShop();
  const displayProducts = products || contextFeaturedProducts;
  const limitedProducts = displayProducts.slice(0, limit);
  
  return (
    <section className="py-16">
      <div className="ethnic-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl mb-3">{title}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          </div>
          <Link 
            to={viewAllLink}
            className="inline-flex items-center mt-4 md:mt-0 text-ethnic-purple hover:text-ethnic-purple/80 transition-colors"
          >
            {viewAllText} <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        
        {/* Mobile grid layout updated to match screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {limitedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

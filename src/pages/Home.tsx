import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import PromotionalBanner from "../components/home/PromotionalBanner";
import TestimonialSection from "../components/home/TestimonialSection";
import USPSection from "../components/home/USPSection";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
      } catch (error) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // You can filter products for featured/new arrivals as needed
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <>
      <Hero />
      <USPSection />
      <FeaturedProducts
        title="Our Collection"
        subtitle="Handpicked lehengas for every occasion"
        viewAllLink="/category/lehengas"
        viewAllText="View All Lehengas"
        products={featuredProducts}
        loading={loading}
        error={error}
      />
      <PromotionalBanner />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Be the first to shop our latest designs"
        viewAllLink="/new-arrivals"
        viewAllText="View All New Arrivals"
        products={newArrivals}
        loading={loading}
        error={error}
      />
      <TestimonialSection />
    </>
  );
};

export default Home;

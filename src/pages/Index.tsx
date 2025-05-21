import { fetchProducts } from "@/api/products";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import USPSection from "@/components/home/USPSection";
import Layout from "@/components/layout/Layout";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { useQuery } from "@tanstack/react-query";

function mapApiProductToCardProduct(apiProduct: ProductListResponse) {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    description: "",
    price: apiProduct.price,
    originalPrice: undefined,
    images: [apiProduct.primaryImageUrl],
    category: "",
    tags: [],
    colors: [],
    sizes: [],
    stockQuantity: apiProduct.stock,
    isNew: false,
    isFeatured: false,
    discount: undefined,
  };
}

const Index = () => {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const displayProducts = products.map(mapApiProductToCardProduct);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <Layout>
      <Hero />
      <USPSection />
      <FeaturedProducts
        title="Our Collection"
        subtitle="Handpicked lehengas for every occasion"
        viewAllLink="/category/lehengas"
        viewAllText="View All Lehengas"
        products={displayProducts}
      />
      <PromotionalBanner />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Be the first to shop our latest designs"
        viewAllLink="/new-arrivals"
        viewAllText="View All New Arrivals"
        products={displayProducts}
      />
      <TestimonialSection />
    </Layout>
  );
};

export default Index;

import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts
        title="Our Collection"
        subtitle="Handpicked ethnic wear for every occasion"
        viewAllLink="/products"
        viewAllText="View Our Collection"
        filterFeatured={true}
        filterNew={false}
        limit={8}
        skipProducts={0}
      />
      <PromotionalBanner />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Be the first to shop our latest designs"
        viewAllLink="/new-arrivals"
        viewAllText="View All New Arrivals"
        filterFeatured={false}
        filterNew={true}
        limit={8}
        skipProducts={0}
      />
      <TestimonialSection />
    </Layout>
  );
};

export default Index;

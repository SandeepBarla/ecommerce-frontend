import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import USPSection from "@/components/home/USPSection";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <USPSection />
      <FeaturedProducts
        title="Our Collection"
        subtitle="Handpicked lehengas for every occasion"
        viewAllLink="/category/lehengas"
        viewAllText="View All Lehengas"
        filterFeatured={false}
        filterNew={false}
        limit={4}
        skipProducts={0}
      />
      <PromotionalBanner />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Be the first to shop our latest designs"
        viewAllLink="/new-arrivals"
        viewAllText="View All New Arrivals"
        filterFeatured={false}
        filterNew={false}
        limit={4}
        skipProducts={4}
      />
      <TestimonialSection />
    </Layout>
  );
};

export default Index;

import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import PromotionalBanner from "../components/home/PromotionalBanner";
import TestimonialSection from "../components/home/TestimonialSection";
import USPSection from "../components/home/USPSection";

const Home = () => {
  return (
    <>
      <Hero />
      <USPSection />
      <FeaturedProducts
        title="Our Collection"
        subtitle="Handpicked lehengas for every occasion"
        viewAllLink="/category/lehengas"
        viewAllText="View All Lehengas"
        filterFeatured={true}
        filterNew={false}
        limit={4}
      />
      <PromotionalBanner />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Be the first to shop our latest designs"
        viewAllLink="/new-arrivals"
        viewAllText="View All New Arrivals"
        filterFeatured={false}
        filterNew={true}
        limit={4}
      />
      <TestimonialSection />
    </>
  );
};

export default Home;

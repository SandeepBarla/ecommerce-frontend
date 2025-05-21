
import { Truck, CircleCheck, ArrowLeftRight, Banknote } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-8 w-8 text-ethnic-purple" />,
    title: "Free Shipping",
    description: "Free shipping on all orders over ₹1,999"
  },
  {
    icon: <CircleCheck className="h-8 w-8 text-ethnic-purple" />,
    title: "Quality Assurance",
    description: "Handpicked fabrics and superior craftsmanship"
  },
  {
    icon: <ArrowLeftRight className="h-8 w-8 text-ethnic-purple" />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy"
  },
  {
    icon: <Banknote className="h-8 w-8 text-ethnic-purple" />,
    title: "Secure Payments",
    description: "Multiple secure payment options"
  }
];

const USPSection = () => {
  return (
    <section className="py-12 border-t border-b border-border">
      <div className="ethnic-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;

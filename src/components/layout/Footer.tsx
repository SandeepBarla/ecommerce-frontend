
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted mt-12">
      {/* Newsletter Section */}
      <div className="bg-ethnic-purple text-white py-10">
        <div className="ethnic-container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-2xl mb-2">Join Our Community</h3>
            <p className="mb-6">Subscribe to receive updates on new arrivals, special offers, and styling inspiration.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
              />
              <Button className="bg-white hover:bg-ethnic-gold text-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="ethnic-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-serif text-xl mb-4">
              Sakhya
            </h3>
            <p className="text-muted-foreground mb-4">
              Celebrating India's rich textile heritage with contemporary designs. 
              Our curated collection brings timeless elegance to the modern woman.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="hover:text-ethnic-purple transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="hover:text-ethnic-purple transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-ethnic-purple transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Shop Column - Removed unnecessary categories */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/category/lehengas" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Lehengas</Link></li>
              <li><Link to="/new-arrivals" className="text-muted-foreground hover:text-ethnic-purple transition-colors">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Best Sellers</Link></li>
              <li><Link to="/offers" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Offers</Link></li>
            </ul>
          </div>
          
          {/* Account Column */}
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Register</Link></li>
              <li><Link to="/account" className="text-muted-foreground hover:text-ethnic-purple transition-colors">My Account</Link></li>
              <li><Link to="/wishlist" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Wishlist</Link></li>
              <li><Link to="/orders" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Order History</Link></li>
            </ul>
          </div>
          
          {/* Help Column */}
          <div>
            <h4 className="font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-ethnic-purple transition-colors">FAQs</Link></li>
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-ethnic-purple transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="ethnic-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {currentYear} Sakhya. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="https://res.cloudinary.com/dj2eq0oys/image/upload/v1621763049/payment-methods/visa_u8l4yu.svg" alt="Visa" className="h-6" />
              <img src="https://res.cloudinary.com/dj2eq0oys/image/upload/v1621763049/payment-methods/mastercard_uwady1.svg" alt="Mastercard" className="h-6" />
              <img src="https://res.cloudinary.com/dj2eq0oys/image/upload/v1621763049/payment-methods/paypal_bxqipp.svg" alt="PayPal" className="h-6" />
              <img src="https://res.cloudinary.com/dj2eq0oys/image/upload/v1621763049/payment-methods/american-express_itelpj.svg" alt="American Express" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

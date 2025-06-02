import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted mt-12">
      {/* Newsletter Section */}
      <div className="bg-ethnic-purple text-white py-10">
        <div className="ethnic-container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-2xl mb-2">Join Our Community</h3>
            <p className="mb-6">
              Subscribe to receive updates on new arrivals, special offers, and
              styling inspiration.
            </p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand Column - Full width on mobile, 1 column on desktop */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-xl mb-4">Sakhya</h3>
            <p className="text-muted-foreground mb-4">
              Celebrating India's rich textile heritage with contemporary
              designs. Our curated collection brings timeless elegance to the
              modern woman.
            </p>
            <div className="flex items-center space-x-2">
              <a
                href="https://instagram.com/sakhya_official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-ethnic-purple transition-colors group"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
                <span className="text-sm font-medium group-hover:text-ethnic-purple">
                  @sakhya_official
                </span>
              </a>
            </div>
          </div>

          {/* Shop and Account Columns - Side by side on mobile and desktop */}
          <div className="grid grid-cols-2 lg:col-span-2 gap-8">
            {/* Shop Column */}
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Our Collection
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/lehengas"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Lehengas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/sarees"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Sarees
                  </Link>
                </li>
                <li>
                  <Link
                    to="/new-arrivals"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/offers"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Offers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account Column */}
            <div>
              <h4 className="font-medium mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/orders"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/addresses"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    My Addresses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="text-muted-foreground hover:text-ethnic-purple transition-colors"
                  >
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="ethnic-container py-6">
          <div className="flex justify-center items-center text-sm text-muted-foreground">
            <p>© {currentYear} Sakhya. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

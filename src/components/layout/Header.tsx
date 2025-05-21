
import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingCart, User, Search, Menu, X, Home, Package, Award, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, cartItems } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Simplified categories, focusing only on lehengas
  const categoryLinks = [
    { name: "Lehengas", path: "/category/lehengas", icon: <Package size={18} /> },
    { name: "New Arrivals", path: "/new-arrivals", icon: <Package size={18} /> },
    { name: "Best Sellers", path: "/best-sellers", icon: <Award size={18} /> },
    { name: "Offers", path: "/offers", icon: <Tag size={18} /> },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      {/* Top promotional banner */}
      <div className="bg-ethnic-purple text-white text-center py-2 text-xs px-2 sm:text-sm">
        Free shipping on orders over ₹1,999 • Use code WELCOME20 for 20% off your first purchase
      </div>
      
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-1 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={20} className="text-gray-700" />
            ) : (
              <Menu size={20} className="text-gray-700" />
            )}
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <Link to="/" className="inline-block">
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-ethnic-purple">
                Sakhya
              </h1>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="font-medium hover:text-ethnic-purple transition-colors">
              Home
            </Link>
            {categoryLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="font-medium hover:text-ethnic-purple transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons - More compact on mobile */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={toggleSearch}
              className="p-1 hover:text-ethnic-purple transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            
            <Link 
              to="/wishlist" 
              className="p-1 hover:text-ethnic-purple transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>
            
            <Link 
              to="/cart" 
              className="p-1 hover:text-ethnic-purple transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-ethnic-gold text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <Link 
                  to="/account" 
                  className="p-1 hover:text-ethnic-purple transition-colors"
                  aria-label="Account"
                >
                  <User size={18} />
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20 hidden group-hover:block">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link 
                    to="/account" 
                    className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link 
                    to="/account/orders" 
                    className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  {user?.role === "admin" && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:bg-ethnic-purple/10 hover:text-ethnic-purple text-xs sm:text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Inline search bar instead of full-screen overlay */}
        {searchOpen && (
          <div className="mt-3 pb-3 w-full">
            <div className="relative max-w-3xl mx-auto">
              <Input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full pl-10 pr-10 border border-ethnic-purple/30 focus:border-ethnic-purple rounded-full"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ethnic-purple"
                onClick={toggleSearch}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Menu - Redesigned to be more elegant */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="p-0 w-full max-w-[80%] bg-white">
          <div className="flex flex-col h-full">
            {/* Search in mobile menu */}
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search for products..." 
                  className="w-full pl-10 pr-3 border border-ethnic-purple/30 focus:border-ethnic-purple rounded-full bg-gray-50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            {/* Menu items */}
            <div className="flex-1 py-4 overflow-auto">
              <div className="px-4">
                <Link
                  to="/"
                  className="flex items-center space-x-4 py-3.5 text-lg font-medium text-gray-800 hover:text-ethnic-purple"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-ethnic-purple/10 rounded-full">
                    <Home size={18} className="text-ethnic-purple" />
                  </div>
                  <span>Home</span>
                </Link>
              </div>
              
              <div className="mt-2 border-t border-gray-100 pt-2">
                {categoryLinks.map((link) => (
                  <div className="px-4" key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-4 py-3.5 text-lg font-medium text-gray-800 hover:text-ethnic-purple"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-ethnic-purple/10 rounded-full">
                        {link.icon}
                      </div>
                      <span>{link.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="px-4">
                  <Link
                    to="/account"
                    className="flex items-center space-x-4 py-3.5 text-lg font-medium text-gray-800 hover:text-ethnic-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-ethnic-purple/10 rounded-full">
                      <User size={18} className="text-ethnic-purple" />
                    </div>
                    <span>My Account</span>
                  </Link>
                </div>
                
                <div className="px-4">
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-4 py-3.5 text-lg font-medium text-gray-800 hover:text-ethnic-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-ethnic-purple/10 rounded-full">
                      <Heart size={18} className="text-ethnic-purple" />
                    </div>
                    <span>Wishlist</span>
                  </Link>
                </div>
                
                <div className="px-4">
                  <Link
                    to="/cart"
                    className="flex items-center space-x-4 py-3.5 text-lg font-medium text-gray-800 hover:text-ethnic-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-ethnic-purple/10 rounded-full">
                      <ShoppingCart size={18} className="text-ethnic-purple" />
                    </div>
                    <span>Cart</span>
                    {cartItems.length > 0 && (
                      <Badge className="bg-ethnic-gold text-foreground text-xs h-5 flex items-center justify-center">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Bottom section for login/logout */}
            <div className="p-6 border-t border-gray-100">
              {isAuthenticated ? (
                <Button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline" 
                  className="w-full justify-center border-ethnic-purple text-ethnic-purple hover:bg-ethnic-purple hover:text-white"
                >
                  Logout
                </Button>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    className="w-full justify-center bg-ethnic-purple text-white hover:bg-ethnic-purple/90"
                  >
                    Login / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;

import { fetchProducts } from "@/api/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Home,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Tag,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products for search
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "search"],
    queryFn: fetchProducts,
    enabled: searchOpen, // Only fetch when search is open
  });

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !allProducts.length) return [];

    const query = searchQuery.toLowerCase().trim();
    return allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.categoryName?.toLowerCase().includes(query)
      )
      .slice(0, 6); // Limit to 6 results
  }, [searchQuery, allProducts]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery(""); // Clear search when closing
    }
  };

  const handleSearchSelect = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Updated categories with better naming
  const categoryLinks = [
    {
      name: "Our Collection",
      path: "/products",
      icon: <Package size={18} />,
    },
    {
      name: "Lehengas",
      path: "/category/lehengas",
      icon: <Package size={18} />,
    },
    {
      name: "Sarees",
      path: "/category/sarees",
      icon: <Package size={18} />,
    },
    {
      name: "New Arrivals",
      path: "/new-arrivals",
      icon: <Package size={18} />,
    },
    { name: "Offers", path: "/offers", icon: <Tag size={18} /> },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
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
            <Link
              to="/"
              className="font-medium hover:text-ethnic-purple transition-colors"
            >
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
              {(user?.favoriteProductIds?.length || 0) > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-ethnic-gold text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {user?.favoriteProductIds?.length}
                </Badge>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-1 hover:text-ethnic-purple transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-ethnic-gold text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                to="/account"
                className="p-1 hover:text-ethnic-purple transition-colors"
                aria-label="Account"
              >
                <User size={18} />
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-ethnic-purple/10 hover:text-ethnic-purple text-xs sm:text-sm"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Enhanced search bar with results */}
        {searchOpen && (
          <div className="mt-3 pb-3 w-full relative">
            <div className="relative max-w-3xl mx-auto">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 border border-ethnic-purple/30 focus:border-ethnic-purple rounded-full"
                autoFocus
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ethnic-purple"
                onClick={toggleSearch}
              >
                <X size={18} />
              </button>

              {/* Search Results Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600">
                          Found {searchResults.length} result
                          {searchResults.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => handleSearchSelect()}
                          className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3">
                            <img
                              src={
                                product.primaryImageUrl || "/placeholder.png"
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {product.categoryName}
                            </p>
                            <p className="text-sm font-semibold text-ethnic-purple">
                              ₹{product.originalPrice.toFixed(0)}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <div className="p-3 border-t border-gray-100">
                        <Link
                          to={`/products?search=${encodeURIComponent(
                            searchQuery
                          )}`}
                          onClick={() => handleSearchSelect()}
                          className="text-sm text-ethnic-purple hover:text-ethnic-purple/80 font-medium"
                        >
                          View all results for "{searchQuery}"
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 mb-2">
                        No products found for "{searchQuery}"
                      </p>
                      <Link
                        to="/products"
                        onClick={() => handleSearchSelect()}
                        className="text-ethnic-purple hover:text-ethnic-purple/80 text-sm font-medium"
                      >
                        Browse all products
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu - Updated with new collection name */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          className="p-0 w-full max-w-[85%] bg-gradient-to-br from-white via-purple-50/30 to-purple-100/20 border-r border-purple-100"
        >
          <div className="flex flex-col h-full">
            {/* Header with brand */}
            <div className="bg-gradient-to-r from-ethnic-purple to-purple-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-serif font-bold mb-1">Sakhya</h2>
                <p className="text-purple-100 text-sm">
                  Ethnic Fashion Collection
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex-1 py-6 overflow-auto">
              <div className="px-6">
                <Link
                  to="/"
                  className="flex items-center space-x-4 py-4 text-gray-800 hover:text-ethnic-purple transition-all duration-200 group rounded-xl hover:bg-purple-50/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ethnic-purple/10 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                    <Home size={20} className="text-ethnic-purple" />
                  </div>
                  <span className="text-lg font-medium">Home</span>
                </Link>
              </div>

              <div className="mt-2 pt-2">
                <div className="px-6 mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Shop Categories
                  </p>
                </div>
                {categoryLinks.map((link) => (
                  <div className="px-6" key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-4 py-4 text-gray-800 hover:text-ethnic-purple transition-all duration-200 group rounded-xl hover:bg-purple-50/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ethnic-purple/10 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </div>
                      <span className="text-lg font-medium">{link.name}</span>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100/60">
                <div className="px-6 mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    My Account
                  </p>
                </div>
                <div className="px-6">
                  <Link
                    to="/account"
                    className="flex items-center space-x-4 py-4 text-gray-800 hover:text-ethnic-purple transition-all duration-200 group rounded-xl hover:bg-purple-50/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ethnic-purple/10 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <User size={20} className="text-ethnic-purple" />
                    </div>
                    <span className="text-lg font-medium">My Account</span>
                  </Link>
                </div>

                {user?.role === "admin" && (
                  <div className="px-6">
                    <Link
                      to="/admin"
                      className="flex items-center space-x-4 py-4 text-gray-800 hover:text-ethnic-purple transition-all duration-200 group rounded-xl hover:bg-purple-50/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ethnic-purple/10 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <Settings size={20} className="text-ethnic-purple" />
                      </div>
                      <span className="text-lg font-medium">
                        Admin Dashboard
                      </span>
                    </Link>
                  </div>
                )}

                <div className="px-6">
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-4 py-4 text-gray-800 hover:text-ethnic-purple transition-all duration-200 group rounded-xl hover:bg-purple-50/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ethnic-purple/10 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-200 relative">
                      <Heart size={20} className="text-ethnic-purple" />
                      {(user?.favoriteProductIds?.length || 0) > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-ethnic-gold text-white text-xs h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                          {user?.favoriteProductIds?.length}
                        </Badge>
                      )}
                    </div>
                    <span className="text-lg font-medium">Wishlist</span>
                  </Link>
                </div>

                <div className="px-6">
                  <Link
                    to="/cart"
                    className="flex items-center space-x-4 py-4 text-gray-800 hover:text-ethnic-purple transition-all duration-200 group rounded-xl hover:bg-purple-50/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-ethnic-purple/10 to-purple-100/50 rounded-xl group-hover:scale-110 transition-transform duration-200 relative">
                      <ShoppingCart size={20} className="text-ethnic-purple" />
                      {cartItems.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-ethnic-gold text-white text-xs h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                          {cartCount}
                        </Badge>
                      )}
                    </div>
                    <span className="text-lg font-medium">Cart</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom section for login/logout */}
            <div className="p-6 bg-gradient-to-r from-purple-50/50 to-transparent border-t border-purple-100/60">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {user && (
                    <div className="text-center pb-3 border-b border-purple-100/60">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-center border-ethnic-purple text-ethnic-purple hover:bg-ethnic-purple hover:text-white transition-all duration-200 rounded-xl py-3 font-medium"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full justify-center bg-gradient-to-r from-ethnic-purple to-purple-600 text-white hover:from-ethnic-purple/90 hover:to-purple-600/90 transition-all duration-200 rounded-xl py-3 font-medium shadow-lg hover:shadow-xl">
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

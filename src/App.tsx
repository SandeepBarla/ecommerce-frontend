import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css"; // Import your CSS file
import Footer from "./components/layout/Footer"; // Ensure you've created this component
import Navbar from "./components/layout/Navbar";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrders from "./pages/admin/AdminOrderManagement";
import AdminProducts from "./pages/admin/AdminProductManagement";
import AdminUsers from "./pages/admin/AdminUserManagement";
import AdminUserOrders from "./pages/admin/AdminUserOrderManagement";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/cart/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/orders/Orders";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminAddProduct />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route
              path="/admin/users/:userId/orders"
              element={<AdminUserOrders />}
            />
            <Route path="/admin/products/:id" element={<AdminEditProduct />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import AdminDashboard, {
  adminDashboardLoader,
} from "@/components/admin/AdminDashboard";
import { createBrowserRouter } from "react-router-dom";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CollectionPage from "./pages/CollectionPage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/order-success",
    element: <OrderSuccess />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/account/addresses",
    element: <Account />,
  },
  {
    path: "/account/orders",
    element: <Account />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // Collection Pages
  {
    path: "/category/:collectionType",
    element: <CollectionPage />,
  },
  {
    path: "/new-arrivals",
    element: <CollectionPage />,
  },
  {
    path: "/best-sellers",
    element: <CollectionPage />,
  },
  {
    path: "/offers",
    element: <CollectionPage />,
  },
  // Admin Routes (nested)
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        index: true,
        element: <AdminDashboard />, // Dashboard at /admin
        loader: adminDashboardLoader,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "products/new",
        element: <AdminProductEdit />,
      },
      {
        path: "products/:productId",
        element: <AdminProductEdit />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "orders/:orderId",
        element: <AdminOrderDetails />,
      },
    ],
  },
  // Catch-all
  {
    path: "*",
    element: <NotFound />,
  },
]);

import { getAllOrders } from "@/api/orders";
import { fetchProducts } from "@/api/products";
import { getAllUsers } from "@/api/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { OrderResponse } from "@/types/order/OrderResponse";
import { ProductListResponse } from "@/types/product/ProductListResponse";
import { UserResponse } from "@/types/user/UserResponse";
import { BarChart, Package, ShoppingBag, Users } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";

export async function adminDashboardLoader() {
  const [orders, users, products] = await Promise.all([
    getAllOrders(),
    getAllUsers(),
    fetchProducts(),
  ]);
  return { orders, users, products };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { orders, users, products } = useLoaderData() as {
    orders: OrderResponse[];
    users: UserResponse[];
    products: ProductListResponse[];
  };

  // Stats cards with navigation
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: <ShoppingBag className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin/products",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <Package className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin/orders",
    },
    {
      title: "Registered Users",
      value: users.length,
      icon: <Users className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin/users",
    },
    {
      title: "Total Revenue",
      value: `₹${orders
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        .toLocaleString()}`,
      icon: <BarChart className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Sakhya Dashboard</h1>

      {/* Stats Cards - Now clickable */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => navigate(stat.path)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders Card - now clickable */}
        <Card
          className="border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
          onClick={() => navigate("/admin/orders")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => {
                const user = users.find((u) => u.id === order.userId);
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {user ? user.fullName : "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm capitalize ${
                          order.orderStatus === "delivered"
                            ? "text-green-600"
                            : order.orderStatus === "processing"
                            ? "text-blue-600"
                            : order.orderStatus === "shipped"
                            ? "text-purple-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular Products Card - now clickable */}
        <Card
          className="border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
          onClick={() => navigate("/admin/products")}
        >
          <CardHeader>
            <CardTitle className="text-lg">Popular Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded overflow-hidden">
                      <img
                        src={product.primaryImageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="font-medium truncate max-w-[200px]">
                      {product.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₹
                      {formatPrice(
                        getEffectivePrice(
                          product.originalPrice,
                          product.discountedPrice
                        )
                      )}
                    </p>
                    <div className="w-24">
                      <Progress value={75 - product.id * 10} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

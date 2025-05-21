
import { useNavigate } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Package, ShoppingBag, Users } from "lucide-react";

// Sample orders for demo
const sampleOrders = [
  { id: "ORD-001", customer: "Anjali Patel", total: 24999, status: "delivered" },
  { id: "ORD-002", customer: "Priya Singh", total: 15999, status: "processing" },
  { id: "ORD-003", customer: "Meera Sharma", total: 49999, status: "pending" },
  { id: "ORD-004", customer: "Riya Gupta", total: 12999, status: "shipped" },
];

// Sample users for demo
const sampleUsers = [
  { id: "user1", name: "Sample User", email: "user@example.com" },
  { id: "user2", name: "Priya Singh", email: "priya@example.com" },
  { id: "user3", name: "Rahul Kumar", email: "rahul@example.com" },
];

const AdminDashboard = () => {
  const { products } = useShop();
  const navigate = useNavigate();

  // Stats cards with navigation
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: <ShoppingBag className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin/products"
    },
    {
      title: "Total Orders",
      value: sampleOrders.length,
      icon: <Package className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin/orders"
    },
    {
      title: "Registered Users",
      value: sampleUsers.length,
      icon: <Users className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin/users"
    },
    {
      title: "Total Revenue",
      value: "₹103,996",
      icon: <BarChart className="h-8 w-8 text-ethnic-purple" />,
      path: "/admin"
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
              <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
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
              {sampleOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total.toLocaleString()}</p>
                    <p className={`text-sm capitalize ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'processing' ? 'text-blue-600' :
                      order.status === 'shipped' ? 'text-purple-600' : 'text-yellow-600'
                    }`}>{order.status}</p>
                  </div>
                </div>
              ))}
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
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded overflow-hidden">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{product.price.toLocaleString()}</p>
                    <div className="w-24">
                      <Progress value={75 - (parseInt(product.id) * 10)} className="h-1" />
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

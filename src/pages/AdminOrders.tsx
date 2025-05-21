
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderTable from "@/components/admin/OrderTable";

const AdminOrders = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Order Management</h1>
      </div>

      <OrderTable />
    </AdminLayout>
  );
};

export default AdminOrders;

import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !isAdmin) {
    navigate("/login?redirect=/admin");
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Product Management
        </h1>
        <Button
          onClick={() => navigate("/admin/products/new")}
          className="bg-ethnic-purple hover:bg-ethnic-purple/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <ProductTable />
    </>
  );
};

export default AdminProducts;

import UserTable from "@/components/admin/UserTable";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
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
          User Management
        </h1>
      </div>

      <UserTable />
    </>
  );
};

export default AdminUsers;

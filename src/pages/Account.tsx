
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountProfile from "@/components/account/AccountProfile";
import AccountAddresses from "@/components/account/AccountAddresses";
import AccountOrders from "@/components/account/AccountOrders";

const Account = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes("/addresses") 
      ? "addresses" 
      : location.pathname.includes("/orders") 
        ? "orders" 
        : "profile"
  );
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="ethnic-container py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="md:col-span-3">
            {activeTab === "profile" && <AccountProfile />}
            {activeTab === "addresses" && <AccountAddresses />}
            {activeTab === "orders" && <AccountOrders />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;

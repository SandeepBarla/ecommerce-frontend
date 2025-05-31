import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, MapPin, Settings, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";

interface AccountSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AccountSidebar = ({ activeTab, setActiveTab }: AccountSidebarProps) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: "profile",
      name: "My Profile",
      icon: User,
      path: "/account",
    },
    {
      id: "addresses",
      name: "My Addresses",
      icon: MapPin,
      path: "/account/addresses",
    },
    {
      id: "orders",
      name: "My Orders",
      icon: ShoppingBag,
      path: "/account/orders",
    },
    ...(user?.role === "admin"
      ? [
          {
            id: "admin",
            name: "Admin Dashboard",
            icon: Settings,
            path: "/admin",
          },
        ]
      : []),
  ];

  return (
    <Card className="p-4">
      <div className="px-2 py-4 text-center border-b mb-4">
        <h2 className="text-lg font-medium">{user?.name}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={(e) => {
              if (item.id === "admin") {
                return;
              }
              e.preventDefault();
              setActiveTab(item.id);
              window.history.pushState(null, "", item.path);
            }}
            className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === item.id
                ? "bg-ethnic-purple/10 text-ethnic-purple font-medium"
                : "hover:bg-muted"
            }`}
          >
            <item.icon size={16} className="mr-3 flex-shrink-0" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default AccountSidebar;

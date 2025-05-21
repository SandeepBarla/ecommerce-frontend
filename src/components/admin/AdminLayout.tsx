
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  BarChart, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation helpers
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider defaultOpen={true} open={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="px-4 py-6 bg-ethnic-purple text-white">
            <Link to="/admin" className="flex items-center">
              <h1 className="text-xl font-bold text-white">Sakhya Admin</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigateTo("/admin")}
                      isActive={isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/orders") && !isActive("/admin/users")}
                      className={isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/orders") && !isActive("/admin/users") 
                        ? "bg-ethnic-purple/10 text-ethnic-purple" 
                        : "hover:bg-ethnic-purple/5 hover:text-ethnic-purple"}
                    >
                      <BarChart className="h-5 w-5" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigateTo("/admin/products")}
                      isActive={isActive("/admin/products")}
                      className={isActive("/admin/products") ? "bg-ethnic-purple/10 text-ethnic-purple" : "hover:bg-ethnic-purple/5 hover:text-ethnic-purple"}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Products</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigateTo("/admin/orders")}
                      isActive={isActive("/admin/orders")}
                      className={isActive("/admin/orders") ? "bg-ethnic-purple/10 text-ethnic-purple" : "hover:bg-ethnic-purple/5 hover:text-ethnic-purple"}
                    >
                      <Package className="h-5 w-5" />
                      <span>Orders</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigateTo("/admin/users")}
                      isActive={isActive("/admin/users")}
                      className={isActive("/admin/users") ? "bg-ethnic-purple/10 text-ethnic-purple" : "hover:bg-ethnic-purple/5 hover:text-ethnic-purple"}
                    >
                      <Users className="h-5 w-5" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-medium">System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigateTo("/admin/settings")}
                      className="hover:bg-ethnic-purple/5 hover:text-ethnic-purple"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 bg-white border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full justify-start border-ethnic-purple text-ethnic-purple hover:bg-ethnic-purple/10"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-gray-50">
          <div className="flex flex-col w-full">
            <header className="border-b bg-white px-6 py-3 sticky top-0 z-10 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/" className="text-sm text-gray-600 hover:text-ethnic-purple px-4 py-2 rounded-md hover:bg-ethnic-purple/5">
                    View Store
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

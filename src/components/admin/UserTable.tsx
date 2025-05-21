
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Edit, MoreVertical, Package } from "lucide-react";

// Sample users for demo
const sampleUsers = [
  { 
    id: "user1", 
    name: "Sample User", 
    email: "user@example.com",
    role: "user",
    orders: [
      { id: "ORD-001", date: "2023-05-15", total: 24999, status: "delivered" },
      { id: "ORD-005", date: "2023-04-10", total: 15999, status: "delivered" },
      { id: "ORD-009", date: "2023-03-22", total: 5999, status: "cancelled" },
    ],
    lastActive: "2023-05-15"
  },
  { 
    id: "user2", 
    name: "Priya Singh", 
    email: "priya@example.com",
    role: "user",
    orders: [
      { id: "ORD-002", date: "2023-05-16", total: 15999, status: "processing" },
    ],
    lastActive: "2023-05-18"
  },
  { 
    id: "user3", 
    name: "Rahul Kumar", 
    email: "rahul@example.com",
    role: "user",
    orders: [],
    lastActive: "2023-05-12"
  },
  { 
    id: "admin1", 
    name: "Admin User", 
    email: "admin@ethnicwear.com",
    role: "admin",
    orders: [],
    lastActive: "2023-05-20"
  },
];

const UserTable = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<typeof sampleUsers[0] | null>(null);
  const [showOrders, setShowOrders] = useState(false);

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewOrders = (user: typeof sampleUsers[0]) => {
    setSelectedUser(user);
    setShowOrders(true);
  };

  const handleViewOrderDetail = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Show selected user's orders */}
      {showOrders && selectedUser && (
        <div className="bg-white p-4 rounded-lg border mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">{selectedUser.name}'s Orders</h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <Button variant="outline" onClick={() => setShowOrders(false)}>
              Close
            </Button>
          </div>
          
          {selectedUser.orders.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedUser.orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>₹{order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">View Order</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found for this user
            </div>
          )}
        </div>
      )}

      {/* Users table */}
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Orders</TableHead>
              <TableHead className="hidden md:table-cell">Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell capitalize">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.orders.length}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleViewOrders(user)}>
                          <Package className="mr-2 h-4 w-4" />
                          <span>View Orders</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;

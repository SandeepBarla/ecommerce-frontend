
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "admin";
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample admin user for testing
const adminUser: User = {
  id: "admin1",
  email: "admin@ethnicwear.com",
  name: "Admin User",
  role: "admin",
  addresses: []
};

// Sample regular user for testing
const regularUser: User = {
  id: "user1",
  email: "user@example.com",
  name: "Sample User",
  phone: "9876543210",
  role: "user",
  addresses: [
    {
      id: "addr1",
      name: "Home",
      street: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "9876543210",
      isDefault: true
    },
    {
      id: "addr2",
      name: "Office",
      street: "456 Business Park, Building C",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      phone: "9876543210",
      isDefault: false
    }
  ]
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage");
      }
    }
    setLoading(false);
  }, []);
  
  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    try {
      // For demo purposes, we're using hardcoded credentials
      if (email === adminUser.email && password === "admin123") {
        setUser(adminUser);
        toast.success("Admin logged in successfully");
        return true;
      } else if (email === regularUser.email && password === "password123") {
        setUser(regularUser);
        toast.success("Logged in successfully");
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out successfully");
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    try {
      // For demo purposes, just create a new user object
      const newUser: User = {
        id: `user${Date.now()}`,
        email,
        name,
        role: "user",
        addresses: []
      };
      
      setUser(newUser);
      toast.success("Registration successful");
      return true;
    } catch (error) {
      toast.error("Registration failed");
      return false;
    }
  };
  
  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
      toast.success("Profile updated successfully");
    }
  };
  
  const addAddress = (addressData: Omit<Address, "id">) => {
    if (user) {
      const newAddress: Address = {
        ...addressData,
        id: `addr${Date.now()}`
      };
      
      // If this is the first address, make it default
      if (user.addresses.length === 0) {
        newAddress.isDefault = true;
      }
      
      // If marked as default, update other addresses
      const updatedAddresses = newAddress.isDefault 
        ? user.addresses.map(addr => ({ ...addr, isDefault: false }))
        : [...user.addresses];
      
      setUser({
        ...user,
        addresses: [...updatedAddresses, newAddress]
      });
      
      toast.success("Address added successfully");
    }
  };
  
  const updateAddress = (address: Address) => {
    if (user) {
      let updatedAddresses: Address[];
      
      // If this address is being set as default, update others
      if (address.isDefault) {
        updatedAddresses = user.addresses.map(addr => 
          addr.id === address.id ? address : { ...addr, isDefault: false }
        );
      } else {
        updatedAddresses = user.addresses.map(addr => 
          addr.id === address.id ? address : addr
        );
      }
      
      setUser({
        ...user,
        addresses: updatedAddresses
      });
      
      toast.success("Address updated successfully");
    }
  };
  
  const removeAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      
      // If we removed the default address and there are other addresses, make the first one default
      if (
        user.addresses.find(addr => addr.id === addressId)?.isDefault &&
        updatedAddresses.length > 0
      ) {
        updatedAddresses[0].isDefault = true;
      }
      
      setUser({
        ...user,
        addresses: updatedAddresses
      });
      
      toast.success("Address removed successfully");
    }
  };
  
  const setDefaultAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      setUser({
        ...user,
        addresses: updatedAddresses
      });
      
      toast.success("Default address updated");
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      logout,
      register,
      updateUserProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

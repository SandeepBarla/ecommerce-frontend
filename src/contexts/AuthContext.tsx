import { setAuthToken } from "@/api/api";
import { loginUser } from "@/api/auth";
import { registerUser } from "@/api/users";
import React, { createContext, useContext, useEffect, useState } from "react";
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
  loginWithGoogleContext: (authResponse: {
    userId: number;
    token: string;
    role: string;
  }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        console.error("Error parsing user from localStorage");
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser({ email, password });
      setUser({
        id: response.userId.toString(),
        email,
        name: email,
        role: response.role?.toLowerCase() === "admin" ? "admin" : "user",
        addresses: [],
      });
      setAuthToken(response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId.toString());
      toast.success("Logged in successfully");
      return true;
    } catch {
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setAuthToken(null);
    toast.info("Logged out successfully");
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await registerUser({ fullName: name, email, password });
      setUser({
        id: response.userId.toString(),
        email,
        name,
        role: response.role?.toLowerCase() === "admin" ? "admin" : "user",
        addresses: [],
      });
      setAuthToken(response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId.toString());
      toast.success("Registration successful");
      return true;
    } catch {
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
        id: `addr${Date.now()}`,
      };

      // If this is the first address, make it default
      if (user.addresses.length === 0) {
        newAddress.isDefault = true;
      }

      // If marked as default, update other addresses
      const updatedAddresses = newAddress.isDefault
        ? user.addresses.map((addr) => ({ ...addr, isDefault: false }))
        : [...user.addresses];

      setUser({
        ...user,
        addresses: [...updatedAddresses, newAddress],
      });

      toast.success("Address added successfully");
    }
  };

  const updateAddress = (address: Address) => {
    if (user) {
      let updatedAddresses: Address[];

      // If this address is being set as default, update others
      if (address.isDefault) {
        updatedAddresses = user.addresses.map((addr) =>
          addr.id === address.id ? address : { ...addr, isDefault: false }
        );
      } else {
        updatedAddresses = user.addresses.map((addr) =>
          addr.id === address.id ? address : addr
        );
      }

      setUser({
        ...user,
        addresses: updatedAddresses,
      });

      toast.success("Address updated successfully");
    }
  };

  const removeAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(
        (addr) => addr.id !== addressId
      );

      // If we removed the default address and there are other addresses, make the first one default
      if (
        user.addresses.find((addr) => addr.id === addressId)?.isDefault &&
        updatedAddresses.length > 0
      ) {
        updatedAddresses[0].isDefault = true;
      }

      setUser({
        ...user,
        addresses: updatedAddresses,
      });

      toast.success("Address removed successfully");
    }
  };

  const setDefaultAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      setUser({
        ...user,
        addresses: updatedAddresses,
      });

      toast.success("Default address updated");
    }
  };

  const loginWithGoogleContext = (authResponse: {
    userId: number;
    token: string;
    role: string;
  }) => {
    setUser({
      id: authResponse.userId.toString(),
      email: "", // You may want to fetch this from backend if available
      name: "",
      role: authResponse.role?.toLowerCase() === "admin" ? "admin" : "user",
      addresses: [],
    });
    setAuthToken(authResponse.token);
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("userId", authResponse.userId.toString());
    toast.success("Logged in with Google successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role?.toLowerCase() === "admin",
        login,
        logout,
        register,
        updateUserProfile,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        loginWithGoogleContext,
      }}
    >
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

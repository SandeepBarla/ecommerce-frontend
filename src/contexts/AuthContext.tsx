import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  setDefaultAddress as setDefaultAddressAPI,
  updateAddress as updateAddressAPI,
} from "@/api/addresses";
import { setAuthToken } from "@/api/api";
import { loginUser } from "@/api/auth";
import {
  addFavorite as addFavoriteAPI,
  fetchFavorites,
  removeFavorite as removeFavoriteAPI,
} from "@/api/favorites";
import {
  getUserById,
  registerUser,
  updateUserProfile as updateUserProfileAPI,
} from "@/api/users";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "admin";
  addresses: Address[];
  favoriteProductIds: number[];
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
  updateUserProfile: (data: {
    fullName: string;
    phone?: string;
  }) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  loadUserAddresses: () => Promise<void>;
  addFavorite: (productId: number) => Promise<void>;
  removeFavorite: (productId: number) => Promise<void>;
  loadUserFavorites: () => Promise<void>;
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
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        setAuthToken(token);
        try {
          // Fetch user data from backend
          const userResponse = await getUserById(parseInt(userId));
          const addressesResponse = await getUserAddresses(parseInt(userId));
          const favoritesResponse = await fetchFavorites(parseInt(userId));

          setUser({
            id: userResponse.id.toString(),
            email: userResponse.email,
            name: userResponse.fullName,
            phone: userResponse.phone,
            role:
              userResponse.role?.toLowerCase() === "admin" ? "admin" : "user",
            addresses: addressesResponse.map((addr) => ({
              id: addr.id.toString(),
              name: addr.name,
              street: addr.street,
              city: addr.city,
              state: addr.state,
              pincode: addr.pincode,
              phone: addr.phone,
              isDefault: addr.isDefault,
            })),
            favoriteProductIds: favoritesResponse.map((fav) => fav.productId),
          });
        } catch (error) {
          console.error("Error loading user data:", error);
          // Clear invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser({ email, password });

      // Fetch user details, addresses, and favorites
      const userResponse = await getUserById(response.userId);
      const addressesResponse = await getUserAddresses(response.userId);
      const favoritesResponse = await fetchFavorites(response.userId);

      setUser({
        id: response.userId.toString(),
        email: userResponse.email,
        name: userResponse.fullName,
        phone: userResponse.phone,
        role: response.role?.toLowerCase() === "admin" ? "admin" : "user",
        addresses: addressesResponse.map((addr) => ({
          id: addr.id.toString(),
          name: addr.name,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          phone: addr.phone,
          isDefault: addr.isDefault,
        })),
        favoriteProductIds: favoritesResponse.map((fav) => fav.productId),
      });

      setAuthToken(response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId.toString());
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
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

      // Fetch user details
      const userResponse = await getUserById(response.userId);

      setUser({
        id: response.userId.toString(),
        email: userResponse.email,
        name: userResponse.fullName,
        phone: userResponse.phone,
        role: response.role?.toLowerCase() === "admin" ? "admin" : "user",
        addresses: [],
        favoriteProductIds: [],
      });

      setAuthToken(response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId.toString());
      toast.success("Registration successful");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    }
  };

  const updateUserProfile = async (data: {
    fullName: string;
    phone?: string;
  }): Promise<void> => {
    if (!user) return;

    try {
      await updateUserProfileAPI(parseInt(user.id), data);
      setUser({ ...user, name: data.fullName, phone: data.phone });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const loadUserAddresses = async (): Promise<void> => {
    if (!user) return;

    try {
      const addressesResponse = await getUserAddresses(parseInt(user.id));
      setUser({
        ...user,
        addresses: addressesResponse.map((addr) => ({
          id: addr.id.toString(),
          name: addr.name,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          phone: addr.phone,
          isDefault: addr.isDefault,
        })),
      });
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  const loadUserFavorites = async (): Promise<void> => {
    if (!user) return;

    try {
      const favoritesResponse = await fetchFavorites(parseInt(user.id));
      setUser({
        ...user,
        favoriteProductIds: favoritesResponse.map((fav) => fav.productId),
      });
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Failed to load favorites");
    }
  };

  const addAddress = async (
    addressData: Omit<Address, "id">
  ): Promise<void> => {
    if (!user) return;

    try {
      await createAddress(parseInt(user.id), {
        name: addressData.name,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        phone: addressData.phone,
        isDefault: addressData.isDefault,
      });

      // Reload addresses to get updated state
      await loadUserAddresses();
      toast.success("Address added successfully");
    } catch (error) {
      console.error("Add address error:", error);
      toast.error("Failed to add address");
      throw error;
    }
  };

  const updateAddress = async (address: Address): Promise<void> => {
    if (!user) return;

    try {
      await updateAddressAPI(parseInt(user.id), parseInt(address.id), {
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: address.phone,
        isDefault: address.isDefault,
      });

      // Reload addresses to get updated state
      await loadUserAddresses();
      toast.success("Address updated successfully");
    } catch (error) {
      console.error("Update address error:", error);
      toast.error("Failed to update address");
      throw error;
    }
  };

  const removeAddress = async (addressId: string): Promise<void> => {
    if (!user) return;

    try {
      await deleteAddress(parseInt(user.id), parseInt(addressId));

      // Reload addresses to get updated state
      await loadUserAddresses();
      toast.success("Address removed successfully");
    } catch (error) {
      console.error("Remove address error:", error);
      toast.error("Failed to remove address");
      throw error;
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<void> => {
    if (!user) return;

    try {
      await setDefaultAddressAPI(parseInt(user.id), parseInt(addressId));

      // Reload addresses to get updated state
      await loadUserAddresses();
      toast.success("Default address updated");
    } catch (error) {
      console.error("Set default address error:", error);
      toast.error("Failed to update default address");
      throw error;
    }
  };

  const addFavorite = async (productId: number): Promise<void> => {
    if (!user) return;

    try {
      await addFavoriteAPI(parseInt(user.id), productId);

      // Update favorites in state
      setUser({
        ...user,
        favoriteProductIds: [...user.favoriteProductIds, productId],
      });
      toast.success("Added to favorites");
    } catch (error) {
      console.error("Add favorite error:", error);
      toast.error("Failed to add to favorites");
      throw error;
    }
  };

  const removeFavorite = async (productId: number): Promise<void> => {
    if (!user) return;

    try {
      await removeFavoriteAPI(parseInt(user.id), productId);

      // Update favorites in state
      setUser({
        ...user,
        favoriteProductIds: user.favoriteProductIds.filter(
          (id) => id !== productId
        ),
      });
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Remove favorite error:", error);
      toast.error("Failed to remove from favorites");
      throw error;
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
      favoriteProductIds: [],
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
        loadUserAddresses,
        addFavorite,
        removeFavorite,
        loadUserFavorites,
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

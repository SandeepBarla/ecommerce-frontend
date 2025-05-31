import { AddressUpsertRequest } from "../types/address/AddressRequest";
import { AddressResponse } from "../types/address/AddressResponse";
import api from "./api";

// ✅ Get All User Addresses
export const getUserAddresses = async (
  userId: number
): Promise<AddressResponse[]> => {
  const response = await api.get<AddressResponse[]>(
    `/users/${userId}/addresses`
  );
  return response.data;
};

// ✅ Get Address by ID
export const getAddressById = async (
  userId: number,
  addressId: number
): Promise<AddressResponse> => {
  const response = await api.get<AddressResponse>(
    `/users/${userId}/addresses/${addressId}`
  );
  return response.data;
};

// ✅ Create Address
export const createAddress = async (
  userId: number,
  addressData: AddressUpsertRequest
): Promise<AddressResponse> => {
  const response = await api.post<AddressResponse>(
    `/users/${userId}/addresses`,
    addressData
  );
  return response.data;
};

// ✅ Update Address
export const updateAddress = async (
  userId: number,
  addressId: number,
  addressData: AddressUpsertRequest
): Promise<void> => {
  await api.put(`/users/${userId}/addresses/${addressId}`, addressData);
};

// ✅ Delete Address
export const deleteAddress = async (
  userId: number,
  addressId: number
): Promise<void> => {
  await api.delete(`/users/${userId}/addresses/${addressId}`);
};

// ✅ Get Default Address
export const getDefaultAddress = async (
  userId: number
): Promise<AddressResponse> => {
  const response = await api.get<AddressResponse>(
    `/users/${userId}/addresses/default`
  );
  return response.data;
};

// ✅ Set Default Address
export const setDefaultAddress = async (
  userId: number,
  addressId: number
): Promise<void> => {
  await api.patch(`/users/${userId}/addresses/${addressId}/set-default`);
};

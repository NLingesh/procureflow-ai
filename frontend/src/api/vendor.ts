import api from "./axios";

export const getVendors = async () => {
  const res = await api.get("/vendors");
  return res.data;
};

export const getVendor = async (id: number) => {
  const res = await api.get(`/vendors/${id}`);
  return res.data;
};

export const createVendor = async (data: any) => {
  const res = await api.post("/vendors", data);
  return res.data;
};

export const updateVendor = async (id: number, data: any) => {
  const res = await api.put(`/vendors/${id}`, data);
  return res.data;
};

export const deleteVendor = async (id: number) => {
  const res = await api.delete(`/vendors/${id}`);
  return res.data;
};
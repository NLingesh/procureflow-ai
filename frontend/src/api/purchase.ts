import api from "./axios";

export const getPurchaseOrders = async () => {
    const res = await api.get("/purchase-orders");
    return res.data;
};

export const createPurchaseOrder = async (data: any) => {
    const res = await api.post("/purchase-orders", data);
    return res.data;
};

export const updatePurchaseOrder = async (
    id: number,
    data: any
) => {
    const res = await api.put(`/purchase-orders/${id}`, data);
    return res.data;
};

export const deletePurchaseOrder = async (id: number) => {
    const res = await api.delete(`/purchase-orders/${id}`);
    return res.data;
};
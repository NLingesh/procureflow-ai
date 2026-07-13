import api from "./axios";

export const uploadInvoice = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await api.post("/invoices/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

export const getInvoices = async () => {
    const res = await api.get("/invoices");
    return res.data;
};

export const deleteInvoice = async (id: number) => {
    const res = await api.delete(`/invoices/${id}`);
    return res.data;
};
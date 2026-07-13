import api from "./axios";

export const getDashboardStats = async () => {
    const res = await api.get("/dashboard");
    return res.data;
};

export const getRevenueChart = async () => {
    const res = await api.get("/dashboard/revenue");
    return res.data;
};

export const getRecentActivities = async () => {
    const res = await api.get("/dashboard/activity");
    return res.data;
};
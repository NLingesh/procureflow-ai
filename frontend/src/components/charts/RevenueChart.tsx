import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import api from "../../api/axios";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

const RevenueChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/revenue")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Error loading revenue chart data", err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue trend</p>
        </div>
        <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} total
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
import { useState, useEffect } from "react";
import RevenueChart from "../../components/charts/RevenueChart";
import VendorChart from "../../components/charts/VendorChart";
import PurchaseChart from "../../components/charts/PurchaseChart";
import PaymentChart from "../../components/charts/PaymentChart";
import api from "../../api/axios";

const AnalyticsPage = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading stats in Analytics", err));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive procurement insights and trends</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <VendorChart
          active={stats?.active_vendors_count || 0}
          pending={stats?.pending_vendors_count || 0}
          inactive={stats?.inactive_vendors_count || 0}
        />
        <PurchaseChart />
        <PaymentChart />
      </div>
    </div>
  );
};

export default AnalyticsPage;
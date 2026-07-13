import { useState, useEffect } from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import DashboardStats from "../../components/charts/DashboardStats";
import RevenueChart from "../../components/charts/RevenueChart";
import VendorChart from "../../components/charts/VendorChart";
import PurchaseChart from "../../components/charts/PurchaseChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import RecentActivities from "../../components/dashboard/RecentActivities";
import QuickActions from "../../components/dashboard/QuickActions";
import AISuggestions from "../../components/dashboard/AISuggestions";
import Notifications from "../../components/dashboard/Notifications";
import api from "../../api/axios";

interface UserProfile {
  full_name?: string;
  email?: string;
}

interface DashboardStatsData {
  total_vendors: number;
  total_purchase_orders: number;
  total_invoices: number;
  total_po_amount: number;
  total_invoice_amount: number;
  pending_invoices: number;
  active_vendors_count: number;
  pending_vendors_count: number;
  inactive_vendors_count: number;
}

const DashboardPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileRes, statsRes, activityRes, ordersRes, vendorsRes] = await Promise.all([
        api.get("/auth/me").catch(() => ({ data: { full_name: "Lingesh" } })),
        api.get("/dashboard").catch(() => ({ data: null })),
        api.get("/dashboard/activity").catch(() => ({ data: [] })),
        api.get("/purchase-orders").catch(() => ({ data: [] })),
        api.get("/vendors").catch(() => ({ data: [] })),
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setActivities(activityRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
      setVendors(vendorsRes.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <WelcomeBanner
        fullName={profile?.full_name || "Lingesh"}
        pendingInvoices={stats?.pending_invoices || 0}
        pendingPOs={stats?.total_purchase_orders || 0}
      />
      
      <DashboardStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <VendorChart
          active={stats?.active_vendors_count || 0}
          pending={stats?.pending_vendors_count || 0}
          inactive={stats?.inactive_vendors_count || 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PurchaseChart />
        </div>
        <QuickActions />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} vendors={vendors} />
        </div>
        <div className="space-y-6">
          <Notifications />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivities activities={activities} />
        <AISuggestions />
      </div>
    </div>
  );
};

export default DashboardPage;
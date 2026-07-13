import { DollarSign, Building2, ShoppingCart, Receipt } from "lucide-react";
import StatsCard from "../dashboard/StatsCard";

interface DashboardStatsProps {
  stats: {
    total_vendors: number;
    total_purchase_orders: number;
    total_invoices: number;
    total_po_amount: number;
    total_invoice_amount: number;
    pending_invoices: number;
  } | null;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const formatCurrency = (val: number) => {
    return "$" + val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 animate-fade-in">
      <StatsCard
        title="Total Spend (POs)"
        value={stats ? formatCurrency(stats.total_po_amount) : "$0"}
        change="Approved pipeline"
        trend="up"
        icon={DollarSign}
        gradient="from-indigo-500 to-indigo-600"
      />
      <StatsCard
        title="Active Vendors"
        value={stats ? String(stats.total_vendors) : "0"}
        change="Registered total"
        trend="up"
        icon={Building2}
        gradient="from-emerald-500 to-emerald-600"
      />
      <StatsCard
        title="Purchase Orders"
        value={stats ? String(stats.total_purchase_orders) : "0"}
        change="Orders issued"
        trend="up"
        icon={ShoppingCart}
        gradient="from-violet-500 to-violet-600"
      />
      <StatsCard
        title="Invoices Processed"
        value={stats ? String(stats.total_invoices) : "0"}
        change={`${stats?.pending_invoices || 0} pending review`}
        trend="up"
        icon={Receipt}
        gradient="from-amber-500 to-amber-600"
      />
    </div>
  );
};

export default DashboardStats;
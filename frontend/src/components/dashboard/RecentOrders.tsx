import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PurchaseOrder {
  id: number;
  order_number: string;
  vendor_id: number;
  total_amount: number;
  status: string;
  notes?: string;
}

interface Vendor {
  id: number;
  name: string;
}

interface RecentOrdersProps {
  orders: PurchaseOrder[];
  vendors: Vendor[];
}

const statusColor: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  completed: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const RecentOrders = ({ orders, vendors }: RecentOrdersProps) => {
  const getVendorName = (vendorId: number) => {
    const v = vendors.find((vend) => vend.id === vendorId);
    return v ? v.name : `Vendor ID: ${vendorId}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Latest purchase orders</p>
        </div>
        <Link
          to="/purchase-orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {orders.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">No purchase orders.</div>
        ) : (
          orders.map((o) => {
            const vName = getVendorName(o.vendor_id);
            return (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {getInitials(vName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{o.order_number}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{vName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    ${o.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[o.status] || statusColor.draft}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
import { Link } from "react-router-dom";
import { ShoppingCart, Receipt, Users, CreditCard } from "lucide-react";

const actions = [
  { title: "New Purchase Order", icon: ShoppingCart, href: "/purchase-orders", gradient: "from-indigo-500 to-indigo-600" },
  { title: "Upload Invoice", icon: Receipt, href: "/invoices", gradient: "from-violet-500 to-violet-600" },
  { title: "Add Vendor", icon: Users, href: "/vendors", gradient: "from-emerald-500 to-emerald-600" },
  { title: "Make Payment", icon: CreditCard, href: "/payments", gradient: "from-amber-500 to-amber-600" },
];

const QuickActions = () => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
    <p className="text-sm text-slate-500">Common tasks</p>
    <div className="mt-4 grid grid-cols-2 gap-3">
      {actions.map((a) => (
        <Link key={a.title} to={a.href} className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md">
          <div className={`rounded-xl bg-gradient-to-br ${a.gradient} p-2.5 text-white shadow-lg transition-transform group-hover:scale-110`}>
            <a.icon size={18} />
          </div>
          <span className="text-xs font-medium text-slate-700">{a.title}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;
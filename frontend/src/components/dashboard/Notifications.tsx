import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";

const notifications = [
  { icon: CheckCircle, color: "text-emerald-600", text: "Invoice #INV-089 has been approved", time: "Just now", unread: true },
  { icon: AlertCircle, color: "text-amber-600", text: "PO-2024-003 requires your approval", time: "5 min ago", unread: true },
  { icon: Info, color: "text-indigo-600", text: "Monthly procurement report is ready", time: "1 hr ago", unread: false },
  { icon: CheckCircle, color: "text-emerald-600", text: "Payment to Acme Supplies confirmed", time: "3 hrs ago", unread: false },
];

const Notifications = () => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bell size={18} className="text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
      </div>
      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">2</span>
    </div>
    <div className="space-y-3">
      {notifications.map((n, i) => (
        <div key={i} className={`flex items-start gap-3 rounded-xl p-3 ${n.unread ? "bg-indigo-50/50" : ""}`}>
          <n.icon size={16} className={`mt-0.5 ${n.color}`} />
          <div className="min-w-0 flex-1">
            <p className={`text-sm ${n.unread ? "font-semibold text-slate-900" : "text-slate-600"}`}>{n.text}</p>
            <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
          </div>
          {n.unread && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
        </div>
      ))}
    </div>
  </div>
);

export default Notifications;

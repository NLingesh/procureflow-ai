import { CreditCard, Search, Filter } from "lucide-react";

const payments = [
  { id: "PAY-001", vendor: "Acme Supplies", amount: "$4,250", method: "Wire Transfer", status: "Completed", statusColor: "bg-emerald-50 text-emerald-700", date: "Jul 10" },
  { id: "PAY-002", vendor: "TechWorld Inc", amount: "$8,320", method: "ACH", status: "Processing", statusColor: "bg-indigo-50 text-indigo-700", date: "Jul 9" },
  { id: "PAY-003", vendor: "Global Parts Co", amount: "$2,180", method: "Wire Transfer", status: "Scheduled", statusColor: "bg-amber-50 text-amber-700", date: "Jul 12" },
  { id: "PAY-004", vendor: "Office Depot", amount: "$1,540", method: "Credit Card", status: "Completed", statusColor: "bg-emerald-50 text-emerald-700", date: "Jul 8" },
];

const PaymentsPage = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500">Track and manage all payments</p>
      </div>
    </div>
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search payments..." className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500" />
      </div>
      <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
        <Filter size={14} /> Filter
      </button>
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Payment</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Method</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.map((p) => (
            <tr key={p.id} className="transition hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-900">{p.id}</p>
                <p className="text-xs text-slate-500">{p.vendor}</p>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{p.amount}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{p.method}</td>
              <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.statusColor}`}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PaymentsPage;
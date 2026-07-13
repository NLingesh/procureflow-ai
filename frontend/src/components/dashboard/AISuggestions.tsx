import { Sparkles, ArrowRight, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";

const suggestions = [
  { icon: TrendingDown, color: "text-emerald-600 bg-emerald-50", title: "Cost Saving Opportunity", desc: "Switch Office Depot orders to Global Parts Co to save ~$3,200/quarter.", action: "Review" },
  { icon: AlertTriangle, color: "text-amber-600 bg-amber-50", title: "Payment Due Soon", desc: "3 invoices totaling $24,100 are due within 5 days.", action: "View" },
  { icon: Lightbulb, color: "text-indigo-600 bg-indigo-50", title: "Process Optimization", desc: "Auto-approve POs under $500 to reduce review time by 60%.", action: "Enable" },
];

const AISuggestions = () => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center gap-2">
      <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 p-1.5 text-white">
        <Sparkles size={14} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">AI Suggestions</h3>
    </div>
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div key={i} className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg p-1.5 ${s.color}`}>
              <s.icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.desc}</p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100">
              {s.action} <ArrowRight size={10} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AISuggestions;

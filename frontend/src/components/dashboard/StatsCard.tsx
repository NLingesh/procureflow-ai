import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
}

const StatsCard = ({ title, value, change, trend, icon: Icon, gradient }: StatsCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${gradient}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</h3>
          <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
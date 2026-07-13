import { Sparkles, TrendingUp } from "lucide-react";

interface WelcomeBannerProps {
  fullName?: string;
  pendingInvoices?: number;
  pendingPOs?: number;
}

const WelcomeBanner = ({ fullName = "User", pendingInvoices = 0, pendingPOs = 0 }: WelcomeBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-8 text-white shadow-xl shadow-indigo-500/20">
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles size={12} /> AI Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {fullName} 👋
          </h1>
          <p className="mt-3 max-w-lg text-indigo-100">
            Your procurement pipeline is running smoothly. You have {pendingInvoices} invoices needing review and {pendingPOs} POs pending approval.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-200">
              <TrendingUp size={12} /> Active Procurement Pipeline
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm animate-pulse-ring" />
            <div className="absolute inset-3 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Sparkles size={40} className="text-white/90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
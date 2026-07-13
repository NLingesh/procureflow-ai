import { CheckCircle, AlertCircle, Clock, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Activity {
  text: string;
  time: string;
  type: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  invoice: { icon: FileText, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400" },
  po: { icon: CheckCircle, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400" },
  vendor: { icon: Clock, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400" },
};

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Latest updates</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">No recent activity.</div>
        ) : (
          activities.map((a, i) => {
            const config = typeConfig[a.type] || { icon: AlertCircle, color: "text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400" };
            const Icon = config.icon;
            return (
              <div key={i} className="flex items-start gap-3 px-6 py-4">
                <div className={`mt-0.5 rounded-lg p-1.5 ${config.color}`}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{a.text}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
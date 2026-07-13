import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface VendorChartProps {
  active?: number;
  pending?: number;
  inactive?: number;
}

const COLORS = ["#4f46e5", "#f59e0b", "#94a3b8"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{payload[0].name}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{payload[0].value}</p>
    </div>
  );
};

const VendorChart = ({ active = 0, pending = 0, inactive = 0 }: VendorChartProps) => {
  const data = [
    { name: "Active", value: active },
    { name: "Pending", value: pending },
    { name: "Inactive", value: inactive },
  ];

  const total = active + pending + inactive;

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vendor Status</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Distribution by status</p>
      </div>
      {total === 0 ? (
        <div className="flex items-center justify-center h-[240px] text-slate-400 text-sm">
          No vendor status data
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} strokeWidth={0}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-xs text-slate-600 dark:text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorChart;
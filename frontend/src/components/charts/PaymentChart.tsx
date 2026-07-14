import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface PaymentChartProps {
  data?: { month: string; paid: number }[];
  loading?: boolean;
}

const PaymentChart = ({ data = [], loading = false }: PaymentChartProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900">
      <h2 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
        Payments
      </h2>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
          No payment data available
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="paid"
              stroke="#16A34A"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PaymentChart;
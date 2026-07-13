import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", paid: 12 },
  { month: "Feb", paid: 18 },
  { month: "Mar", paid: 24 },
  { month: "Apr", paid: 21 },
  { month: "May", paid: 29 },
];

const PaymentChart = () => {
  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-slate-900">

      <h2 className="mb-5 text-xl font-semibold">
        Payments
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="paid"
            stroke="#16A34A"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default PaymentChart;
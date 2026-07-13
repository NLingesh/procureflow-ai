interface StatusBadgeProps {
    status: "Active" | "Pending" | "Inactive";
}

const colors = {
    Active: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Inactive: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
import { Inbox } from "lucide-react";

const NoData = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Inbox size={48} />
            <p className="mt-4 text-lg font-medium">No data available</p>
        </div>
    );
};

export default NoData;
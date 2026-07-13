import { Bell } from "lucide-react";

const NotificationBell = () => {
    return (
        <button className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
    );
};

export default NotificationBell;
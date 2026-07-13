import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
    icon: LucideIcon;
    title: string;
    href: string;
}

const SidebarItem = ({
    icon: Icon,
    title,
    href,
}: SidebarItemProps) => {
    const location = useLocation();

    const active = location.pathname === href;

    return (
        <Link
            to={href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
        >
            <Icon size={20} />

            <span className="font-medium">
                {title}
            </span>
        </Link>
    );
};

export default SidebarItem;

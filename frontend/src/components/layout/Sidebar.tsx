import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Receipt,
    CreditCard,
    BarChart3,
    Settings,
} from "lucide-react";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
    return (
        <aside className="hidden h-screen w-72 border-r bg-white px-5 py-6 lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-950">

            <Logo />

            <nav className="mt-10 space-y-2">

                <SidebarItem
                    icon={LayoutDashboard}
                    title="Dashboard"
                    href="/dashboard"
                />

                <SidebarItem
                    icon={Users}
                    title="Vendors"
                    href="/vendors"
                />

                <SidebarItem
                    icon={ShoppingCart}
                    title="Purchase Orders"
                    href="/purchase-orders"
                />

                <SidebarItem
                    icon={Receipt}
                    title="Invoices"
                    href="/invoices"
                />

                <SidebarItem
                    icon={CreditCard}
                    title="Payments"
                    href="/payments"
                />

                <SidebarItem
                    icon={BarChart3}
                    title="Analytics"
                    href="/analytics"
                />

                <SidebarItem
                    icon={Settings}
                    title="Settings"
                    href="/settings"
                />

            </nav>
        </aside>
    );
};

export default Sidebar;

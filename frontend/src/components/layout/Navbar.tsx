import {
    Menu,
    Search,
} from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import UserMenu from "../common/UserMenu";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">

            <div className="flex items-center gap-4">

                <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
                    <Menu size={22} />
                </button>

                <div className="relative hidden md:block">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                </div>

            </div>

            <div className="flex items-center gap-4">

                <ThemeToggle />

                <UserMenu />

            </div>

        </header>
    );
};

export default Navbar;


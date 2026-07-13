import { Boxes } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <Link
            to="/dashboard"
            className="flex items-center gap-3"
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <Boxes size={22} />
            </div>

            <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                    ProcureFlow
                </h1>

                <p className="text-xs text-slate-500">
                    AI Procurement Suite
                </p>
            </div>
        </Link>
    );
};

export default Logo;

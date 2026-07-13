import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Outlet />
        </div>
    );
};

export default AuthLayout;

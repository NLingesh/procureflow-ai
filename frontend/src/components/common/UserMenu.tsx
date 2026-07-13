import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../../api/auth";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout API call failed", err);
    }
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold dark:bg-indigo-950/40 dark:text-indigo-400">
          L
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Lingesh</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
        </div>

        <ChevronDown size={18} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 shadow-xl animate-scale-up z-50">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <User size={14} /> Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Settings size={14} /> Settings
          </Link>
          <div className="my-1.5 border-t border-slate-150 dark:border-slate-850" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
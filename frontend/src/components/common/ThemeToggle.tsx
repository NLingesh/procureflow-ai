import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark";

        setDark(isDark);

        if (isDark) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (dark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }

        setDark(!dark);
    };

    return (
        <button
            onClick={toggleTheme}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
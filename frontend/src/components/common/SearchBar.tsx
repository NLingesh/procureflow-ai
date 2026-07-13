import { Search } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="relative w-full max-w-md">

            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
            />

        </div>
    );
};

export default SearchBar;
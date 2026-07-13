const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            &copy; {new Date().getFullYear()} ProcureFlow AI. All rights reserved.
        </footer>
    );
};

export default Footer;

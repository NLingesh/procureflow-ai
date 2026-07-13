import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 gradient-mesh p-4">
    <div className="text-center animate-fade-in">
      <h1 className="text-8xl font-extrabold text-gradient">404</h1>
      <p className="mt-4 text-xl font-semibold text-slate-900">Page not found</p>
      <p className="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700">
          <Home size={14} /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
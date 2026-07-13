import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Boxes } from "lucide-react";
import { register, login } from "../../api/auth";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, email, password });
      const loginRes = await login({ email, password });
      localStorage.setItem("access_token", loginRes.access_token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 gradient-mesh p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white"><Boxes size={20} /></div>
            <span className="text-xl font-bold text-slate-900">ProcureFlow</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Start your 14-day free trial</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-700 border border-red-100 animate-fade-in">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="John Doe" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@company.com" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
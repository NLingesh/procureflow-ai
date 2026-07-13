import { User, Mail, Building2, MapPin } from "lucide-react";

const ProfilePage = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Profile</h1>
      <p className="text-sm text-slate-500">Manage your personal information</p>
    </div>
    <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-5 mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white shadow-lg">
          L
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Lingesh</h2>
          <p className="text-sm text-slate-500">Administrator</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { icon: User, label: "Full Name", value: "Lingesh" },
          { icon: Mail, label: "Email", value: "lingesh@procureflow.ai" },
          { icon: Building2, label: "Organization", value: "ProcureFlow Inc" },
          { icon: MapPin, label: "Location", value: "San Francisco, CA" },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <f.icon size={14} /> {f.label}
            </label>
            <input defaultValue={f.value} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        ))}
      </div>
      <button className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700">
        Save Changes
      </button>
    </div>
  </div>
);

export default ProfilePage;
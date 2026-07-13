import { useState } from "react";
import { Bell, Palette, Shield, Globe, Check, AlertCircle } from "lucide-react";
import api from "../../api/axios";

type ActiveTab = "notifications" | "appearance" | "security" | "integrations";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("notifications");

  // Notifications State
  const [emailPo, setEmailPo] = useState(true);
  const [emailInvoice, setEmailInvoice] = useState(true);
  const [emailVendor, setEmailVendor] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Appearance State
  const isCurrentlyDark = document.documentElement.classList.contains("dark");
  const [darkTheme, setDarkTheme] = useState(isCurrentlyDark);
  const [currency, setCurrency] = useState("USD");
  const [themeSuccess, setThemeSuccess] = useState(false);

  // Security State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);

  // Integrations State
  const [qbConnected, setQbConnected] = useState(false);
  const [sapConnected, setSapConnected] = useState(false);
  const [netsuiteConnected, setNetsuiteConnected] = useState(false);

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySuccess(true);
    setTimeout(() => setNotifySuccess(false), 3000);
  };

  const handleAppearanceSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (darkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setThemeSuccess(true);
    setTimeout(() => setThemeSuccess(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySuccess(null);
    setSecurityError(null);

    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }

    try {
      setSecurityLoading(true);
      await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSecuritySuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSecurityError(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setSecurityLoading(false);
    }
  };

  const tabItems = [
    { id: "notifications", title: "Notifications", icon: Bell, desc: "Email and push preferences" },
    { id: "appearance", title: "Appearance", icon: Palette, desc: "Theme and display options" },
    { id: "security", title: "Security", icon: Shield, desc: "Password and sessions" },
    { id: "integrations", title: "Integrations", icon: Globe, desc: "Connect external systems" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Left Tabs Menu */}
        <div className="flex flex-col gap-2 md:col-span-1">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-3 rounded-xl p-3 text-left transition cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-450"
                }`}
              >
                <div className={`rounded-lg p-1.5 ${isActive ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold">{tab.title}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Content */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:col-span-3">
          {activeTab === "notifications" && (
            <form onSubmit={handleNotificationSave} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Control which updates are delivered to your email inbox.</p>
              </div>

              {notifySuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                  <Check size={14} /> Notification preferences updated successfully.
                </div>
              )}

              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPo}
                    onChange={(e) => setEmailPo(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Purchase Order Approvals</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Send email when a purchase order is updated or approved.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailInvoice}
                    onChange={(e) => setEmailInvoice(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">AI Invoice Processing</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Alert me when a uploaded invoice PDF finishes processing.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailVendor}
                    onChange={(e) => setEmailVendor(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">New Vendor Signups</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Daily summary email of newly onboarded vendor proposals.</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}

          {activeTab === "appearance" && (
            <form onSubmit={handleAppearanceSave} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Appearance & Display</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Configure theme and localization defaults.</p>
              </div>

              {themeSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                  <Check size={14} /> Theme properties updated successfully.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Theme Mode</label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <label
                      onClick={() => setDarkTheme(false)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                        !darkTheme ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</span>
                    </label>

                    <label
                      onClick={() => setDarkTheme(true)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                        darkTheme ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="USD">USD ($) United States Dollar</option>
                    <option value="EUR">EUR (€) Euro</option>
                    <option value="GBP">GBP (£) British Pound</option>
                    <option value="INR">INR (₹) Indian Rupee</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Ensure your account uses a secure password phrase.</p>
              </div>

              {securitySuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 border-solid">
                  <Check size={14} /> {securitySuccess}
                </div>
              )}

              {securityError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900">
                  <AlertCircle size={14} /> {securityError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
                >
                  {securityLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">ERP & Accounting Integrations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Connect your procurement workflows with external financials.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">QuickBooks Online</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Sync invoice payloads and payments automatically.</p>
                  </div>
                  <button
                    onClick={() => setQbConnected(!qbConnected)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      qbConnected
                        ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {qbConnected ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">SAP ERP</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Enterprise PO release integration.</p>
                  </div>
                  <button
                    onClick={() => setSapConnected(!sapConnected)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      sapConnected
                        ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {sapConnected ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">NetSuite</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">Financial general ledger sync.</p>
                  </div>
                  <button
                    onClick={() => setNetsuiteConnected(!netsuiteConnected)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      netsuiteConnected
                        ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {netsuiteConnected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
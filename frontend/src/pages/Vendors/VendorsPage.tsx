import { useState, useEffect } from "react";
import { Users, Search, Plus, Filter, Edit, Trash2, X, Star } from "lucide-react";
import { getVendors, createVendor, updateVendor, deleteVendor } from "../../api/vendor";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  rating?: string;
  orders?: number;
}

const statusColor: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchVendorsList = async () => {
    try {
      setLoading(true);
      const data = await getVendors();
      setVendors(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsList();
  }, []);

  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      status: vendor.status || "active",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteVendor(id);
      fetchVendorsList();
    } catch (err) {
      console.error(err);
      alert("Failed to delete vendor.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (editingVendor) {
        await updateVendor(editingVendor.id, formData);
      } else {
        await createVendor(formData);
      }
      setShowModal(false);
      fetchVendorsList();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.detail || "Failed to save vendor.");
    }
  };

  // Filter and search
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.email && v.email.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Vendors</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your vendor relationships</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 cursor-pointer"
        >
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 dark:bg-slate-900 outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:bg-red-950/20 dark:border-red-900/50">
          {error}
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400">
          No vendors found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Address</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVendors.map((v) => (
                <tr key={v.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {v.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{v.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[v.status] || statusColor.inactive}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{v.phone || "—"}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{v.address || "—"}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(v)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingVendor ? "Edit Vendor" : "Add Vendor"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            {formError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                {formError}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Inc"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@acme.com"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Industrial Way, Suite 100"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
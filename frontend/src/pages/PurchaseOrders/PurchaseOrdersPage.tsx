import { useState, useEffect } from "react";
import { ShoppingCart, Search, Plus, Filter, Edit, Trash2, X } from "lucide-react";
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from "../../api/purchase";
import { getVendors } from "../../api/vendor";

interface Vendor {
  id: number;
  name: string;
}

interface PurchaseOrder {
  id: number;
  order_number: string;
  vendor_id: number;
  total_amount: number;
  status: string;
  notes?: string;
  created_at?: string;
}

const statusColor: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  completed: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const PurchaseOrdersPage = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({
    order_number: "",
    vendor_id: 0,
    total_amount: 0.0,
    notes: "",
    status: "draft",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchOrdersAndVendors = async () => {
    try {
      setLoading(true);
      const ordersData = await getPurchaseOrders();
      const vendorsData = await getVendors();
      setOrders(ordersData);
      setVendors(vendorsData);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load purchase orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndVendors();
  }, []);

  const handleOpenAddModal = () => {
    // Generate a default order number e.g., PO-2026-XXXX
    const defaultPO = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setEditingOrder(null);
    setFormData({
      order_number: defaultPO,
      vendor_id: vendors[0]?.id || 0,
      total_amount: 0.0,
      notes: "",
      status: "draft",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setFormData({
      order_number: order.order_number,
      vendor_id: order.vendor_id,
      total_amount: order.total_amount,
      notes: order.notes || "",
      status: order.status || "draft",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      await deletePurchaseOrder(id);
      fetchOrdersAndVendors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete purchase order.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.vendor_id === 0) {
      setFormError("Please select a vendor. If none exist, create one first.");
      return;
    }

    try {
      if (editingOrder) {
        await updatePurchaseOrder(editingOrder.id, formData);
      } else {
        await createPurchaseOrder(formData);
      }
      setShowModal(false);
      fetchOrdersAndVendors();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.detail || "Failed to save purchase order.");
    }
  };

  const getVendorName = (vendorId: number) => {
    const v = vendors.find((vend) => vend.id === vendorId);
    return v ? v.name : `Vendor ID: ${vendorId}`;
  };

  // Filter and search
  const filteredOrders = orders.filter((o) => {
    const vName = getVendorName(o.vendor_id).toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      vName.includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Purchase Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage purchase orders</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 cursor-pointer"
        >
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search orders..."
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
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400">
          No purchase orders found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{o.order_number}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{getVendorName(o.vendor_id)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    ${o.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[o.status] || statusColor.draft}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{o.notes || "—"}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(o)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
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
                {editingOrder ? "Edit Purchase Order" : "New Purchase Order"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            {formError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100 animate-fade-in">
                {formError}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Order Number</label>
                <input
                  type="text"
                  required
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  placeholder="PO-2026-0001"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Vendor</label>
                {vendors.length === 0 ? (
                  <p className="text-xs text-red-500">No vendors found. Please create a vendor first.</p>
                ) : (
                  <select
                    value={formData.vendor_id}
                    onChange={(e) => setFormData({ ...formData, vendor_id: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value={0}>Select a vendor...</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                  placeholder="1250.00"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Order descriptions, items specifications, etc."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              {editingOrder && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
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

export default PurchaseOrdersPage;
import { useState, useEffect, useRef } from "react";
import { Receipt, Search, Plus, Filter, Upload, Trash2, X } from "lucide-react";
import { getInvoices, uploadInvoice, deleteInvoice } from "../../api/invoice";
import { getVendors } from "../../api/vendor";
import { getPurchaseOrders } from "../../api/purchase";
import api from "../../api/axios";

interface Vendor {
  id: number;
  name: string;
}

interface PurchaseOrder {
  id: number;
  order_number: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  vendor_id: number;
  purchase_order_id: number | null;
  amount: number;
  status: string;
  notes?: string;
  created_at?: string;
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  overdue: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Manual Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    invoice_number: "",
    vendor_id: 0,
    purchase_order_id: null as number | null,
    amount: 0.0,
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const invoicesData = await getInvoices();
      const vendorsData = await getVendors();
      const posData = await getPurchaseOrders();
      setInvoices(invoicesData);
      setVendors(vendorsData);
      setPurchaseOrders(posData);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load invoice details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      await uploadInvoice(files[0]);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to upload invoice.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleOpenAddModal = () => {
    // Generate a default invoice number e.g., INV-2026-XXXX
    const defaultInvoice = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      invoice_number: defaultInvoice,
      vendor_id: vendors[0]?.id || 0,
      purchase_order_id: null,
      amount: 0.0,
      notes: "",
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await deleteInvoice(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice.");
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
      // POST manual invoice
      await api.post("/invoices", formData);
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.detail || "Failed to save invoice.");
    }
  };

  const getVendorName = (vendorId: number) => {
    const v = vendors.find((vend) => vend.id === vendorId);
    return v ? v.name : `Vendor ID: ${vendorId}`;
  };

  const filteredInvoices = invoices.filter((inv) => {
    const vName = getVendorName(inv.vendor_id).toLowerCase();
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      vName.includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Process and track invoices with AI</p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 cursor-pointer"
          >
            <Plus size={16} /> New Invoice
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search invoices..."
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
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
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400">
          No invoices found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{inv.invoice_number}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{getVendorName(inv.vendor_id)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[inv.status] || statusColor.pending}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{inv.notes || "—"}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(inv.id)}
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

      {/* Manual Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Invoice</h3>
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
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  placeholder="INV-2026-0001"
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
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Purchase Order (Optional)</label>
                <select
                  value={formData.purchase_order_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purchase_order_id: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="">None</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.order_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  placeholder="850.00"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Invoice notes or description"
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm outline-none transition focus:border-indigo-500 dark:bg-slate-900 dark:text-white"
                />
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

export default InvoicesPage;
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

// Lazy-loaded pages
const LandingPage = lazy(() => import("../pages/Landing/LandingPage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const VendorsPage = lazy(() => import("../pages/Vendors/VendorsPage"));
const PurchaseOrdersPage = lazy(() => import("../pages/PurchaseOrders/PurchaseOrdersPage"));
const InvoicesPage = lazy(() => import("../pages/Invoices/InvoicesPage"));
const PaymentsPage = lazy(() => import("../pages/Payments/PaymentsPage"));
const AnalyticsPage = lazy(() => import("../pages/Analytics/AnalyticsPage"));
const SettingsPage = lazy(() => import("../pages/Settings/SettingsPage"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFound/NotFoundPage"));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  </div>
);

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
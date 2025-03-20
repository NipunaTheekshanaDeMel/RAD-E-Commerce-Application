import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useAuthStore(state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isLoading: state.isLoading
    }));

    console.log("Auth Check:", isAuthenticated, "Loading:", isLoading);

    if (isLoading) {
        return <div>Loading...</div>; // Or a more sophisticated loading component
    }


    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }


    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

function App() {
    const { checkAuth, isLoading } = useAuthStore(state => ({
        checkAuth: state.checkAuth,
        isLoading: state.isLoading
    }));

    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const performAuthCheck = async () => {
            console.log("Running checkAuth...");
            console.log(isLoading)
            await checkAuth();
            setAuthChecked(true);
        };

        performAuthCheck();
    }, []);

    if (!authChecked) {
        return <div>Verifying your authentication...</div>; // Show this while checking auth
    }


    return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
             <ProtectedRoute requiredRole="ADMIN">
               <AdminDashboardPage />
             </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

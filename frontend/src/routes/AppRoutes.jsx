import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import RouteScrollTop from './RouteScrollTop';
import PageLoader from '../components/common/PageLoader';

const HomePage = lazy(() => import('../pages/public/Home'));
const AboutPage = lazy(() => import('../pages/public/About'));
const ServicesPage = lazy(() => import('../pages/public/Services'));
const ProductsPage = lazy(() => import('../pages/public/Products'));
const ProductDetailsPage = lazy(() => import('../pages/public/ProductDetails'));
const GalleryPage = lazy(() => import('../pages/public/Gallery'));
const ContactPage = lazy(() => import('../pages/public/Contact'));
const BlogPage = lazy(() => import('../pages/public/Blog'));
const ProfilePage = lazy(() => import('../pages/public/Profile'));
const NotFoundPage = lazy(() => import('../pages/public/NotFound'));

const LoginPage = lazy(() => import('../pages/auth/Login'));
const SignupPage = lazy(() => import('../pages/auth/Signup'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPassword'));

const AdminDashboardPage = lazy(() => import('../pages/admin/Dashboard'));
const AdminProductsPage = lazy(() => import('../pages/admin/ProductsAdmin'));
const AdminEnquiriesPage = lazy(() => import('../pages/admin/EnquiriesAdmin'));
const AdminUsersPage = lazy(() => import('../pages/admin/UsersAdmin'));

export default function AppRoutes() {
  return (
    <>
      <RouteScrollTop />
      <Suspense fallback={<PageLoader label="Loading page" />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="bookings" element={<AdminEnquiriesPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

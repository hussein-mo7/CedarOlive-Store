import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./Root";
import StoreLayout from "./components/layout/StoreLayout";
import AuthLayout from "./components/layout/AuthLayout";
import PrivateRoute from "./components/Protected/PrivateRoute";
import UserProtectedRoute from "./components/Protected/UserProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";
import EmailVerificationPage from "./pages/authPages/EmailVerificationPage";
import ResendVerification from "./pages/authPages/ResendVerification";
import ForgotPassword from "./pages/authPages/ForgotPassword";
import ResetPassword from "./pages/authPages/ResetPassword";

import Profile from "./pages/profilePage/Profile";
import PersonalInformation from "./features/profile/PersonalInformation";
import Orders from "./features/profile/Orders";
import Wishlist from "./features/profile/Wishlist";
import AccountSettings from "./features/profile/AccountSettings";

import AdminLayout from "./features/admin/AdminLayout";
import Dashboard from "./features/admin/Dashboard";
import Products from "./features/admin/Products";
import ProductView from "./features/admin/ProductView";
import OrdersManagement from "./features/admin/OrdersManagement";
import Customers from "./features/admin/Customers";
import EditUser from "./features/admin/EditUser";
import ContactMessages from "./features/admin/ContactMessages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <StoreLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "contact", element: <Contact /> },
          { path: "blog", element: <Blog /> },
          { path: "product/:id", element: <Product /> },
          { path: "shop/:category", element: <Shop /> },
          {
            path: "checkout",
            element: (
              <UserProtectedRoute>
                <Cart />
              </UserProtectedRoute>
            ),
          },
          {
            path: "payment-success",
            element: (
              <UserProtectedRoute>
                <OrderSuccess />
              </UserProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <UserProtectedRoute>
                <Profile />
              </UserProtectedRoute>
            ),
            children: [
              { index: true, element: <PersonalInformation /> },
              { path: "orders", element: <Orders /> },
              { path: "wishlist", element: <Wishlist /> },
              { path: "settings", element: <AccountSettings /> },
            ],
          },
          { path: "*", element: <NotFound /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "signIn", element: <SignIn /> },
          { path: "signUp", element: <SignUp /> },
          { path: "verify/:token", element: <EmailVerificationPage /> },
          { path: "resend-verification", element: <ResendVerification /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "resetPassword/:token", element: <ResetPassword /> },
        ],
      },
      {
        path: "admin",
        element: (
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "customers", element: <Customers /> },
          { path: "users/edit/:userId", element: <EditUser /> },
          { path: "products", element: <Products /> },
          { path: "contactMessages", element: <ContactMessages /> },
          { path: "orders", element: <OrdersManagement /> },
          { path: "product/:productId", element: <ProductView /> },
        ],
      },
    ],
  },
]);

export default router;

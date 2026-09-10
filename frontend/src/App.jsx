import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RateStore from "./pages/user/RateStore";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AddUser from "./pages/admin/AddUser";
import UserDetails from "./pages/admin/UserDetails";
import ChangePassword from "./pages/user/ChangePassword";
import ManageStores from "./pages/admin/ManageStores";
import AddStore from "./pages/admin/AddStore";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin - Users */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin - Stores */}
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageStores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/stores/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddStore />
            </ProtectedRoute>
          }
        />

        {/* Normal User */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/user/rate/:id"
  element={
    <ProtectedRoute allowedRoles={["user"]}>
      <RateStore />
    </ProtectedRoute>
  }
/>
<Route
  path="/user/change-password"
  element={
    <ProtectedRoute allowedRoles={["user", "owner"]}>
      <ChangePassword />
    </ProtectedRoute>
  }
/>

        {/* Store Owner */}
        <Route
  path="/owner/dashboard"
  element={
    <ProtectedRoute allowedRoles={["owner"]}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

        {/* Default Routes */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Routes, Route, } from "react-router-dom";
import MainLayout from './components/layouts/MainLayout';
import About from './pages/About';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import TestLayout from './pages/TestLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Welcome from './pages/Welcome';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ForgotPasswordNewPassword from './pages/Auth/ForgotPasswordNewPassword';
import ChangePassword from './pages/Auth/ChangePassword';
import GuestOnlyRoute from './components/GuestOnlyRoute';
import Categories from "./pages/Categories";
import { useContext } from "react";
import { UserInfoContext } from "./utils/user-context";
import Spinner from "./components/Spinner";
import TestTable from "./pages/TestTable";
import CategoriesGrid from "./pages/Categories.Grid";
import Activities from "./pages/Activities";

export default function AppRoutes() {
  const { isSessionReady } = useContext(UserInfoContext);
  return (
    isSessionReady ?
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route element={<GuestOnlyRoute />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          {/* Protected  */}
          <Route path="welcome" element={<Welcome />} />
          <Route path="forgot-password-new-password" element={<ForgotPasswordNewPassword />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories-grid" element={<CategoriesGrid />} />
          <Route path="activities" element={<Activities />} />
          {/* Proteced Ends */}

          <Route path="about-us" element={<About />} />
          <Route path="test-layout" element={<TestLayout />} />
          <Route path="test-table" element={<TestTable />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
      : <Spinner />
  )
}

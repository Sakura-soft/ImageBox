import Login from "@/components/view/auth-view/Login";
import ResetPassword from "@/components/view/auth-view/ResetPassword";
import ResetPasswordOtp from "@/components/view/auth-view/ResetPasswordOtp";
import Singup from "@/components/view/auth-view/Singup";
import VerifyOtp from "@/components/view/auth-view/VerifyOtp";
import ThemeToggle from "@/theme/ThemeToggle";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="w-full min-h-screen bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 smooth flex items-center justify-center">
      <Routes>
        <Route path="singup" element={<Singup />} />
        <Route path="login" element={<Login />} />
        <Route path="Verify-otp" element={<VerifyOtp />} />
        <Route path="reset-password-otp" element={<ResetPasswordOtp />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Routes>
      <ThemeToggle className=" fixed top-2 right-2" />
    </main>
  );
};

export default AuthLayout;

import React, { useEffect } from "react";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import { Route, Routes, useLocation } from "react-router-dom";
import Auth from "./auth/Auth";
import { Toaster } from "./components/ui/sonner";
import { useSelector } from "react-redux";
import useUserApi from "./hooks/api-hooks/UserApi";
import CLoader from "./components/ui/CLoader";
import Home from "./components/view/home-page/Home";
import ImagePreview from "./components/view/content-view/image-preview/ImagePreview";
import { ShareImagePreview } from "./components/view/content-view/image-preview/shareImagePreview";

const Layout = () => {
  const { user, appLoading } = useSelector((state) => state.user);

  const { getUser } = useUserApi();

  const location = useLocation();

  const isAuthPage = location.pathname.includes("auth");

  useEffect(() => {
    if (
      location.pathname !== "/" &&
      !isAuthPage &&
      !user &&
      !location.pathname.includes("preview")
    ) {
      const fetchUser = async () => {
        await getUser();
      };
      fetchUser();
    }
  }, [location]);

  if (appLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <CLoader size={20} />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image/preview/:imageId" element={<ImagePreview />} />
        <Route
          path="/image/preview/share/:sToken"
          element={<ShareImagePreview />}
        />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route
          path="/user/*"
          element={
            <Auth>
              <AppLayout />
            </Auth>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default Layout;

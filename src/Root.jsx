import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/scroll/ScrollToTop";
import { useGetCurrentUser } from "./api/users/userApi";
import { useDispatch } from "react-redux";
import { setCurrentUser, checkExpiration } from "./redux/userSlice";
import { logout } from "./redux/authSlice";
import Cookies from "universal-cookie";
import { Toaster } from "sonner";

const cookies = new Cookies();

const Root = () => {
  const dispatch = useDispatch();
  const token = cookies.get("token");
  const { data: currentUser, isSuccess, isError } = useGetCurrentUser();

  useEffect(() => {
    dispatch(checkExpiration());
    if (token && isSuccess && currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
  }, [token, isSuccess, currentUser, dispatch]);

  useEffect(() => {
    if (token && isError) {
      dispatch(logout());
    }
  }, [token, isError, dispatch]);

  return (
    <>
      <Toaster
        position="top-center"
        closeButton
        toastOptions={{
          duration: 3200,
          style: {
            background: "#1c1410",
            color: "#f6f1eb",
            border: "1px solid rgba(246, 241, 235, 0.12)",
            borderRadius: "16px",
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default Root;

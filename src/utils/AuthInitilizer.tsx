import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { fetchCurrentUser } from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return null;
}

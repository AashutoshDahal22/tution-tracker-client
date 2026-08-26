import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { fetchCurrentUser } from "@/features/auth/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    //checks if the user has a saved JWT token from the prev login
    const token = localStorage.getItem("token");

    // If a token exists, ask the backend for the current user's data.
    // This restores the user's authentication state when the app reloads.
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return null;
}

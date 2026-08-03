// src/components/AuthInitializer.tsx

"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/hooks";

import { setCredentials, logout } from "@/store/auth/authSlice";
import { useGetMeQuery } from "@/store/api/authApi";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  const { data: user, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setCredentials(user));
    }

    if (isError) {
      dispatch(logout());
    }
  }, [dispatch, user, isSuccess, isError]);

  return null;
}

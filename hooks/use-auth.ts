"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
      setIsAuthenticated(isAuth);
      setIsLoading(false);

      if (
        !isAuth &&
        pathname?.startsWith("/admin") &&
        pathname !== "/admin/login"
      ) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      sessionStorage.setItem("admin_authenticated", "true");
      sessionStorage.setItem("admin_user", "admin");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_user");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  const getUser = () => {
    return sessionStorage.getItem("admin_user");
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getUser,
  };
}

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "waiter" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  bonusPoints: number;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SYSTEM_ACCOUNTS = [
  {
    email: "admin@gmail.com",
    password: "admin123",
    user: {
      id: "admin",
      name: "Administrator",
      email: "admin@gmail.com",
      phone: "+998 90 000 00 00",
      address: "Toshkent, O'zbekiston",
      joinDate: "2024-01-01",
      bonusPoints: 9999,
      role: "admin" as const,
    },
  },
  {
    email: "waiter@gmail.com",
    password: "waiter123",
    user: {
      id: "waiter",
      name: "Ofitsant",
      email: "waiter@gmail.com",
      phone: "+998 91 000 00 00",
      address: "",
      joinDate: "2024-01-01",
      bonusPoints: 0,
      role: "waiter" as const,
    },
  },
];

const API_BASE = "https://startup-2-f8oh.onrender.com/api";

async function apiPost(path: string, body: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function apiPatch(path: string, body: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kk_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const sysAccount = SYSTEM_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (sysAccount) {
      setUser(sysAccount.user);
      localStorage.setItem("kk_user", JSON.stringify(sysAccount.user));
      try {
        await apiPost("/auth/login", { email, password });
      } catch {
        try {
          await apiPost("/auth/register", {
            ...sysAccount.user,
            password,
          });
        } catch {}
      }
      return true;
    }

    try {
      const userData = await apiPost("/auth/login", { email, password });
      setUser(userData);
      localStorage.setItem("kk_user", JSON.stringify(userData));
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    if (SYSTEM_ACCOUNTS.find(a => a.email === email)) return false;
    try {
      const userData = await apiPost("/auth/register", { name, email, password, phone });
      setUser(userData);
      localStorage.setItem("kk_user", JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error("Register xato:", err);
      return false;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("kk_user", JSON.stringify(updated));
    try {
      await apiPatch(`/auth/users/${user.id}`, data);
    } catch (err) {
      console.error("updateUser xatolik:", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kk_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser: updateUser as any, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
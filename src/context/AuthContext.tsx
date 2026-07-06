import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthUser, AuthSession } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { getFromStorage, setToStorage, removeFromStorage } from '@/utils/storage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<AuthUser, 'createdAt' | 'avatar'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (email: string, newPassword: string) => boolean;
  getUsers: () => AuthUser[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUsers(): AuthUser[] {
  return getFromStorage<AuthUser[]>(STORAGE_KEYS.USERS, []);
}

function saveUsers(users: AuthUser[]) {
  setToStorage(STORAGE_KEYS.USERS, users);
}

function getSession(): AuthSession | null {
  return getFromStorage<AuthSession | null>(STORAGE_KEYS.SESSION, null);
}

function saveSession(session: AuthSession | null) {
  if (session) {
    setToStorage(STORAGE_KEYS.SESSION, session);
  } else {
    removeFromStorage(STORAGE_KEYS.SESSION);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      const users = getStoredUsers();
      const found = users.find((u) => u.email.toLowerCase() === session.email.toLowerCase());
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }

    setUser(found);
    saveSession({ email: found.email, rememberMe });
    return { success: true };
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 500));
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: AuthUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    setUser(newUser);
    saveSession({ email: newUser.email, rememberMe: true });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  const updatePassword = useCallback((email: string, newPassword: string) => {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) return false;

    users[index] = { ...users[index], password: newPassword };
    saveUsers(users);
    if (user?.email.toLowerCase() === email.toLowerCase()) {
      setUser(users[index]);
    }
    return true;
  }, [user]);

  const getUsers = useCallback(() => getStoredUsers(), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updatePassword,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

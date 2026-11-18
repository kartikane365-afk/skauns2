import React, { createContext, useContext, useState, useEffect } from 'react';
import { dispatchUserRegistrationToAdmin } from '../services/adminDispatcher';

// Master Admin identifier (strictly internal; never displayed in public UI)
const MASTER_ADMIN_EMAIL = 'kartikane365@gmail.com';
const DEFAULT_MASTER_PASS = 'skauns2026';

const USERS_STORAGE_KEY = 'skauns_registered_users_v1';
const SESSION_STORAGE_KEY = 'skauns_auth_session_v1';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface StoredUserRecord extends AuthUser {
  passwordHash: string;
  isDefaultMaster?: boolean;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateProfile: (updates: { fullName?: string; phone?: string }) => void;
  changePassword: (currentPassword: string, newPassword: string) => AuthResult;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function hashPassword(raw: string): string {
  // Deterministic lightweight hash for client-side auth storage
  let h = 0x811c9dc5;
  const salted = `skn_salt_2026::${raw}`;
  for (let i = 0; i < salted.length; i++) {
    h ^= salted.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `skh_${(h >>> 0).toString(16)}_${btoa(unescape(encodeURIComponent(raw))).slice(0, 12)}`;
}

function loadUsers(): StoredUserRecord[] {
  let list: StoredUserRecord[] = [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {
    list = [];
  }

  // Ensure Master Admin account exists in user store
  const hasMaster = list.some((u) => u.email.toLowerCase() === MASTER_ADMIN_EMAIL);
  if (!hasMaster) {
    list.unshift({
      id: 'usr_master_admin',
      fullName: 'Kartikane Parihar',
      email: MASTER_ADMIN_EMAIL,
      phone: '9871044291',
      role: 'admin',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(DEFAULT_MASTER_PASS),
      isDefaultMaster: true,
    });
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  }
  return list;
}

function saveUsers(users: StoredUserRecord[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore
  }
}

function toPublicUser(rec: StoredUserRecord): AuthUser {
  return {
    id: rec.id,
    fullName: rec.fullName,
    email: rec.email,
    phone: rec.phone,
    role: rec.email.toLowerCase() === MASTER_ADMIN_EMAIL ? 'admin' : rec.role,
    createdAt: rec.createdAt,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed && parsed.email) {
          return {
            ...parsed,
            role: parsed.email.toLowerCase() === MASTER_ADMIN_EMAIL ? 'admin' : 'customer',
          };
        }
      }
    } catch {
      // Ignore
    }
    return null;
  });

  useEffect(() => {
    // Initialize users store on mount so master seed is ready
    loadUsers();
  }, []);

  const persistSession = (authUser: AuthUser | null) => {
    setUser(authUser);
    try {
      if (authUser) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  };

  const register = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): AuthResult => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.fullName.trim();
    const cleanPhone = data.phone.replace(/\D/g, '');
    const cleanPass = data.password;

    if (cleanName.length < 2) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const users = loadUsers();
    const existingIdx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    // If Master Admin registers for the first time while still on default seed, allow claiming custom password
    if (existingIdx !== -1) {
      const existing = users[existingIdx];
      if (cleanEmail === MASTER_ADMIN_EMAIL && existing.isDefaultMaster) {
        const updatedMaster: StoredUserRecord = {
          ...existing,
          fullName: cleanName || existing.fullName,
          phone: cleanPhone || existing.phone,
          passwordHash: hashPassword(cleanPass),
          role: 'admin',
          isDefaultMaster: false,
        };
        users[existingIdx] = updatedMaster;
        saveUsers(users);
        const pub = toPublicUser(updatedMaster);
        persistSession(pub);
        return { success: true, message: 'Master account activated and logged in.', user: pub };
      }
      return { success: false, message: 'An account with this email already exists. Please login instead.' };
    }

    const isMaster = cleanEmail === MASTER_ADMIN_EMAIL;
    const newRec: StoredUserRecord = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone.slice(-10),
      role: isMaster ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(cleanPass),
    };

    users.push(newRec);
    saveUsers(users);

    const pub = toPublicUser(newRec);
    persistSession(pub);

    // Notify master email silently on new customer registration
    if (!isMaster) {
      void dispatchUserRegistrationToAdmin({
        fullName: pub.fullName,
        email: pub.email,
        phone: pub.phone,
        createdAt: pub.createdAt,
      });
    }

    return { success: true, message: 'Account created successfully.', user: pub };
  };

  const login = (email: string, password: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const users = loadUsers();
    const match = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!match) {
      return { success: false, message: 'No account found for this email. Please register first.' };
    }

    if (match.passwordHash !== hashPassword(password)) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const pub = toPublicUser(match);
    persistSession(pub);
    return { success: true, message: 'Authenticated successfully.', user: pub };
  };

  const logout = () => {
    persistSession(null);
  };

  const updateProfile = (updates: { fullName?: string; phone?: string }) => {
    if (!user) return;
    const users = loadUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        fullName: updates.fullName?.trim() || users[idx].fullName,
        phone: updates.phone?.replace(/\D/g, '').slice(-10) || users[idx].phone,
      };
      saveUsers(users);
      persistSession(toPublicUser(users[idx]));
    }
  };

  const changePassword = (currentPassword: string, newPassword: string): AuthResult => {
    if (!user) return { success: false, message: 'Not logged in.' };
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    const users = loadUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx === -1) return { success: false, message: 'Account not found.' };
    if (users[idx].passwordHash !== hashPassword(currentPassword)) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    users[idx] = {
      ...users[idx],
      passwordHash: hashPassword(newPassword),
      isDefaultMaster: false,
    };
    saveUsers(users);
    return { success: true, message: 'Password updated successfully.' };
  };

  const isAdmin = Boolean(user && user.email.toLowerCase() === MASTER_ADMIN_EMAIL);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from '../lib/firebase';
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

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isCloudAuth: boolean;
  isFirebaseUserLoggedIn: boolean;
  authLoading: boolean;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: { fullName?: string; phone?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please login instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found for this email. Please register first.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a minute and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled yet in Firebase Console → Authentication → Sign-in method.';
    default:
      return (err as { message?: string })?.message || 'Authentication failed. Please try again.';
  }
}

// ── Local Fallback Helpers (used only when Firebase env vars are not configured yet) ──
function hashPassword(raw: string): string {
  let h = 0x811c9dc5;
  const salted = `skn_salt_2026::${raw}`;
  for (let i = 0; i < salted.length; i++) {
    h ^= salted.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `skh_${(h >>> 0).toString(16)}_${btoa(unescape(encodeURIComponent(raw))).slice(0, 12)}`;
}

function loadLocalUsers(): StoredUserRecord[] {
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

function saveLocalUsers(users: StoredUserRecord[]) {
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

  const [authLoading, setAuthLoading] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed && parsed.email) return false;
      }
    } catch {
      // Ignore
    }
    return isFirebaseConfigured;
  });

  // Subscribe to Firebase Auth state when cloud auth is active
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      loadLocalUsers();
      return;
    }

    const db = firebaseDb;
    const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (!fbUser || !fbUser.email) {
        setUser(null);
        persistLocalSession(null);
        setAuthLoading(false);
        return;
      }

      const emailLower = fbUser.email.toLowerCase();
      const isMaster = emailLower === MASTER_ADMIN_EMAIL;
      const fallbackProfile: AuthUser = {
        id: fbUser.uid,
        fullName: fbUser.displayName || emailLower.split('@')[0],
        email: emailLower,
        phone: '',
        role: isMaster ? 'admin' : 'customer',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };

      // Set user immediately and unblock authLoading so refresh is instant (0ms delay)
      setUser(fallbackProfile);
      persistLocalSession(fallbackProfile);
      setAuthLoading(false);

      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          const enriched: AuthUser = {
            id: fbUser.uid,
            fullName: String(data.fullName || fallbackProfile.fullName),
            email: emailLower,
            phone: String(data.phone || ''),
            role: isMaster ? 'admin' : 'customer',
            createdAt: String(data.createdAt || fallbackProfile.createdAt),
          };
          setUser(enriched);
          persistLocalSession(enriched);
        }
      } catch {
        // Fallback profile already saved and active
      }
    });

    return () => unsub();
  }, []);

  const persistLocalSession = (authUser: AuthUser | null) => {
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

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResult> => {
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

    // ── CLOUD FIREBASE REGISTRATION ──
    if (isFirebaseConfigured && firebaseAuth && firebaseDb) {
      try {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, cleanPass);
        await fbUpdateProfile(cred.user, { displayName: cleanName });

        const isMaster = cleanEmail === MASTER_ADMIN_EMAIL;
        const createdAt = new Date().toISOString();
        const profile: AuthUser = {
          id: cred.user.uid,
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone.slice(-10),
          role: isMaster ? 'admin' : 'customer',
          createdAt,
        };

        await setDoc(doc(firebaseDb, 'users', cred.user.uid), {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          createdAt: profile.createdAt,
        });

        setUser(profile);

        if (!isMaster) {
          void dispatchUserRegistrationToAdmin({
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            createdAt: profile.createdAt,
          });
        }

        return { success: true, message: 'Account created successfully.', user: profile };
      } catch (err) {
        return { success: false, message: mapFirebaseError(err) };
      }
    }

    // ── LOCAL FALLBACK REGISTRATION ──
    const users = loadLocalUsers();
    const existingIdx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

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
        saveLocalUsers(users);
        const pub = toPublicUser(updatedMaster);
        persistLocalSession(pub);
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
    saveLocalUsers(users);

    const pub = toPublicUser(newRec);
    persistLocalSession(pub);

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

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    // ── CLOUD FIREBASE LOGIN ──
    if (isFirebaseConfigured && firebaseAuth && firebaseDb) {
      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, cleanEmail, password);
        const isMaster = cleanEmail === MASTER_ADMIN_EMAIL;
        let profile: AuthUser = {
          id: cred.user.uid,
          fullName: cred.user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: '',
          role: isMaster ? 'admin' : 'customer',
          createdAt: cred.user.metadata.creationTime || new Date().toISOString(),
        };

        try {
          const snap = await getDoc(doc(firebaseDb, 'users', cred.user.uid));
          if (snap.exists()) {
            const data = snap.data();
            profile = {
              id: cred.user.uid,
              fullName: String(data.fullName || profile.fullName),
              email: cleanEmail,
              phone: String(data.phone || ''),
              role: isMaster ? 'admin' : 'customer',
              createdAt: String(data.createdAt || profile.createdAt),
            };
          }
        } catch {
          // Use basic profile
        }

        setUser(profile);
        return { success: true, message: 'Authenticated successfully.', user: profile };
      } catch (err) {
        const errCode = (err as { code?: string })?.code || '';
        // If master admin tries logging in before registering in Firebase, auto-provision
        if (
          cleanEmail === MASTER_ADMIN_EMAIL &&
          (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential' || errCode === 'auth/invalid-login-credentials')
        ) {
          try {
            const cred = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password);
            await fbUpdateProfile(cred.user, { displayName: 'Kartikane Parihar' });
            const profile: AuthUser = {
              id: cred.user.uid,
              fullName: 'Kartikane Parihar',
              email: cleanEmail,
              phone: '9871044291',
              role: 'admin',
              createdAt: new Date().toISOString(),
            };
            try {
              await setDoc(doc(firebaseDb, 'users', cred.user.uid), {
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                role: profile.role,
                createdAt: profile.createdAt,
              });
            } catch {
              // Ignore doc write error
            }
            setUser(profile);
            return { success: true, message: 'Master Admin account activated and logged in.', user: profile };
          } catch (createErr) {
            const createErrCode = (createErr as { code?: string })?.code || '';
            if (createErrCode === 'auth/email-already-in-use') {
              return { success: false, message: 'Incorrect password for master admin account. Please check your password.' };
            }
            return { success: false, message: mapFirebaseError(createErr) };
          }
        }
        return { success: false, message: mapFirebaseError(err) };
      }
    }

    // ── LOCAL FALLBACK LOGIN ──
    const users = loadLocalUsers();
    const match = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!match) {
      return { success: false, message: 'No account found for this email. Please register first.' };
    }

    if (match.passwordHash !== hashPassword(password)) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const pub = toPublicUser(match);
    persistLocalSession(pub);
    return { success: true, message: 'Authenticated successfully.', user: pub };
  };

  const logout = async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth);
      setUser(null);
      return;
    }
    persistLocalSession(null);
  };

  const updateProfile = async (updates: { fullName?: string; phone?: string }) => {
    if (!user) return;
    if (isFirebaseConfigured && firebaseAuth?.currentUser && firebaseDb) {
      const nextName = updates.fullName?.trim() || user.fullName;
      const nextPhone = updates.phone?.replace(/\D/g, '').slice(-10) || user.phone;
      await fbUpdateProfile(firebaseAuth.currentUser, { displayName: nextName });
      await updateDoc(doc(firebaseDb, 'users', user.id), {
        fullName: nextName,
        phone: nextPhone,
      });
      setUser({ ...user, fullName: nextName, phone: nextPhone });
      return;
    }

    const users = loadLocalUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        fullName: updates.fullName?.trim() || users[idx].fullName,
        phone: updates.phone?.replace(/\D/g, '').slice(-10) || users[idx].phone,
      };
      saveLocalUsers(users);
      persistLocalSession(toPublicUser(users[idx]));
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
    if (!user) return { success: false, message: 'Not logged in.' };
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    if (isFirebaseConfigured && firebaseAuth?.currentUser && firebaseAuth.currentUser.email) {
      try {
        const cred = EmailAuthProvider.credential(firebaseAuth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(firebaseAuth.currentUser, cred);
        await updatePassword(firebaseAuth.currentUser, newPassword);
        return { success: true, message: 'Password updated in Firebase Auth.' };
      } catch (err) {
        return { success: false, message: mapFirebaseError(err) };
      }
    }

    const users = loadLocalUsers();
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
    saveLocalUsers(users);
    return { success: true, message: 'Password updated successfully.' };
  };

  const isAdmin = Boolean(user && user.email.toLowerCase() === MASTER_ADMIN_EMAIL);
  const isFirebaseUserLoggedIn = Boolean(firebaseAuth?.currentUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isCloudAuth: isFirebaseConfigured,
        isFirebaseUserLoggedIn,
        authLoading,
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

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { ADMIN_EMAIL, getUserEmail, isAdminUser } from '../constants/auth';

const AuthContext = createContext();
const LOCAL_USER_KEY = 'placeprep-local-user';

const createLocalUser = ({ fullName, email, role }) => {
  const [firstName = 'Student', ...rest] = (fullName || 'Student User').trim().split(' ');
  return {
    id: `local-${email}`,
    fullName,
    firstName,
    lastName: rest.join(' '),
    role,
    primaryEmailAddress: { emailAddress: email },
    emailAddresses: [{ emailAddress: email }],
  };
};

export const isClerkMode =
  Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) &&
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'placeholder-publishable-key';

export const ClerkAuthProvider = ({ children }) => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { isLoaded: authLoaded, getToken } = useAuth();
  const { signOut } = useClerk();

  const email = getUserEmail(user);
  const isAdmin = isSignedIn && isAdminUser(user);

  const value = {
    isLoaded: userLoaded && authLoaded,
    isSignedIn,
    user,
    email,
    isAdmin,
    adminEmail: ADMIN_EMAIL,
    getToken,
    signOut: () => signOut({ sessionId: null }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const LocalAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const login = async ({ email, fullName = 'Student User', role = 'student' }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const nextRole = normalizedEmail === ADMIN_EMAIL ? 'admin' : role;
    const nextUser = createLocalUser({ fullName, email: normalizedEmail, role: nextRole });
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const signup = login;

  const signOut = async () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  const value = useMemo(() => {
    const email = getUserEmail(user);
    const isAdmin = Boolean(user && isAdminUser(user));

    return {
      isLoaded: true,
      isSignedIn: Boolean(user),
      isLocalMode: true,
      user,
      email,
      isAdmin,
      adminEmail: ADMIN_EMAIL,
      login,
      signup,
      getToken: async () => null,
      signOut,
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AppAuthProvider = isClerkMode ? ClerkAuthProvider : LocalAuthProvider;

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAppAuth must be used within an AppAuthProvider');
  return context;
};

import React, { createContext, useContext, ReactNode } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { User } from '../types';

interface AuthContextType {
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => void;
  signUp: (token: string, user: User) => Promise<void>;
  session: string | null;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => {},
  signUp: async () => {},
  session: null,
  isLoading: false,
  user: null,
});

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />');
  }
  return value;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [[isLoading, session], setSession] = useStorageState('userToken');
  const [[, userData], setUserData] = useStorageState('userData');

  const signIn = async (token: string, user: User) => {
    setSession(token);
    setUserData(JSON.stringify(user));
  };

  const signOut = () => {
    setSession(null);
    setUserData(null);
  };

  const signUp = async (token: string, user: User) => {
    setSession(token);
    setUserData(JSON.stringify(user));
  };

  const user: User | null = userData ? JSON.parse(userData) : null;

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        session,
        isLoading,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

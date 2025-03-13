import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType {
  user: User | null;
  signInWithGitHub: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  //access the user in the session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      //set the user to the session.user
      setUser(session?.user ?? null);

      //listen for changes in user authorization state
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_, session) => {
          setUser(session?.user ?? null);
        }
      );

      //unsubscribe to the listener when component unmounts
      return () => {
        listener.subscription.unsubscribe();
      };
    });
  }, []);

  const signInWithGitHub = () => {
    supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

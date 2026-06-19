import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { clearGuestMenus } from "@/hooks/useMenuList";

const GUEST_KEY = "rdp_is_guest";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsGuest(localStorage.getItem(GUEST_KEY) === "true");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setIsGuest(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
  }, []);

  const signUp = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { success: true, isNewUser: true, data };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const migrateGuestMenus = useCallback(async (userId) => {
    try {
      const raw = localStorage.getItem("rdp_guest_menus");
      if (!raw) return;
      const guestMenus = JSON.parse(raw);
      if (!guestMenus.length) return;
      const rows = guestMenus.map((m) => ({ user_id: userId, name: m.name }));
      await supabase.from("menus").insert(rows);
      clearGuestMenus();
    } catch {
      // migration failure is non-fatal
    }
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      setError(null);
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        localStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
        await migrateGuestMenus(data.user.id);
        return { success: true, data };
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [migrateGuestMenus],
  );

  const signOut = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem(GUEST_KEY);
      setIsGuest(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isGuest,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

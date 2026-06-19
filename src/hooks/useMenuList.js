import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const GUEST_KEY = "rdp_guest_menus";

function loadGuestMenus() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGuestMenus(menus) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(menus));
}

export function clearGuestMenus() {
  localStorage.removeItem(GUEST_KEY);
}

export default function useMenuList(userId) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setMenus(loadGuestMenus());
      setLoading(false);
      return;
    }

    const fetchMenus = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setMenus(data);
      setLoading(false);
    };

    fetchMenus();
  }, [userId]);

  const addMenu = async (name) => {
    if (!name.trim()) return;

    if (!userId) {
      const newItem = {
        id: `guest_${Date.now()}`,
        name: name.trim(),
        created_at: new Date().toISOString(),
      };
      setMenus((prev) => {
        const updated = [newItem, ...prev];
        saveGuestMenus(updated);
        return updated;
      });
      return newItem;
    }

    setError(null);
    const { data, error } = await supabase
      .from("menus")
      .insert({ user_id: userId, name: name.trim() })
      .select()
      .single();

    if (error) {
      setError(error.message);
      throw error;
    }
    setMenus((prev) => [data, ...prev]);
    return data;
  };

  const deleteMenu = async (menuId) => {
    if (!userId) {
      setMenus((prev) => {
        const updated = prev.filter((m) => m.id !== menuId);
        saveGuestMenus(updated);
        return updated;
      });
      return;
    }

    setError(null);
    const { error } = await supabase.from("menus").delete().eq("id", menuId);

    if (error) {
      setError(error.message);
      throw error;
    }
    setMenus((prev) => prev.filter((m) => m.id !== menuId));
  };

  return { menus, loading, error, addMenu, deleteMenu };
}

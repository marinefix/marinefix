const STORAGE_KEY = "marinefix_admin_session";

export function checkIsAdmin(): boolean {
  if (typeof window === "undefined") return false;

  return localStorage.getItem(STORAGE_KEY) === "authenticated";
}

export async function authenticateAdmin(passcode: string): Promise<boolean> {
  try {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ passcode }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (data.success === true) {
      localStorage.setItem(STORAGE_KEY, "authenticated");
      window.dispatchEvent(new Event("admin_session_changed"));
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch("/api/admin-logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("admin_session_changed"));
  }
}
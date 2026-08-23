// Admin Authentication & Stealth Session Manager
const ADMIN_PASSCODE = "Aparna"; // Neenga virumbina secret PIN/password maathikalam
const STORAGE_KEY = "marinefix_admin_session";

export function checkIsAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "authenticated";
}

export function authenticateAdmin(passcode: string): boolean {
  if (passcode.trim() === ADMIN_PASSCODE) {
    localStorage.setItem(STORAGE_KEY, "authenticated");
    window.dispatchEvent(new Event("admin_session_changed"));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("admin_session_changed"));
}
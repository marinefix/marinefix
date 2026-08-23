import type { GuideWithRelations } from "../types";

const OFFLINE_GUIDES_KEY = "marine_offline_guides_data";

export function saveGuideOffline(guide: GuideWithRelations): void {
  try {
    const existing = getOfflineGuides();
    existing[guide.id] = {
      ...guide,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(OFFLINE_GUIDES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to cache guide offline:", err);
  }
}

export function removeGuideOffline(guideId: string): void {
  try {
    const existing = getOfflineGuides();
    delete existing[guideId];
    localStorage.setItem(OFFLINE_GUIDES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to remove offline guide:", err);
  }
}

export function getOfflineGuides(): Record<string, GuideWithRelations & { savedAt?: string }> {
  try {
    const raw = localStorage.getItem(OFFLINE_GUIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getOfflineGuideById(guideId: string): GuideWithRelations | null {
  const guides = getOfflineGuides();
  return guides[guideId] || null;
}
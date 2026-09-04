import type { GuideWithRelations } from "../types";

const OFFLINE_GUIDES_KEY = "marine_offline_guides_data";
const OFFLINE_CACHE_NAME = "marine-fix-offline-guides-v1";

type OfflineGuide = GuideWithRelations & {
  savedAt?: string;
};

function getAttachmentUrls(guide: GuideWithRelations): string[] {
  const urls: string[] = [];

  const addUrl = (value: any) => {
    if (typeof value === "string" && value.trim()) {
      urls.push(value.trim());
      return;
    }

    if (value && typeof value === "object") {
      const url =
        value.url ||
        value.image_url ||
        value.image ||
        value.publicUrl ||
        "";

      if (typeof url === "string" && url.trim()) {
        urls.push(url.trim());
      }
    }
  };

  // Overall guide attachments
  if (Array.isArray(guide.images)) {
    guide.images.forEach(addUrl);
  }

  // Step attachments
  if (Array.isArray(guide.steps)) {
    guide.steps.forEach((step: any) => {
      let raw = step?.images || step?.step_images || [];

      if (typeof raw === "string") {
        try {
          raw = JSON.parse(raw);
        } catch {
          raw = [];
        }
      }

      if (Array.isArray(raw)) {
        raw.forEach(addUrl);
      }
    });
  }

  return [...new Set(urls)];
}

async function cacheAttachment(url: string): Promise<void> {
  try {
    // Data URLs are already self-contained.
    if (url.startsWith("data:")) {
      return;
    }

    // Only same-origin resources can safely be cached by this app.
    const parsed = new URL(url, window.location.origin);

    if (parsed.origin !== window.location.origin) {
      console.warn("Skipping external offline attachment:", url);
      return;
    }

    const cache = await caches.open(OFFLINE_CACHE_NAME);

    const existing = await cache.match(parsed.href);
    if (existing) {
      return;
    }

    const response = await fetch(parsed.href, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.warn(
        `Failed to cache attachment (${response.status}):`,
        parsed.href
      );
      return;
    }

    await cache.put(parsed.href, response.clone());
  } catch (err) {
    console.warn("Failed to cache offline attachment:", url, err);
  }
}

async function cacheGuideAttachments(
  guide: GuideWithRelations
): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  const urls = getAttachmentUrls(guide);

  await Promise.all(urls.map((url) => cacheAttachment(url)));
}

export async function saveGuideOffline(
  guide: GuideWithRelations
): Promise<void> {
  try {
    const existing = getOfflineGuides();

    existing[guide.id] = {
      ...guide,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      OFFLINE_GUIDES_KEY,
      JSON.stringify(existing)
    );

    // Cache all guide photos/PDFs for offline use.
    await cacheGuideAttachments(guide);
  } catch (err) {
    console.error("Failed to cache guide offline:", err);
  }
}

export async function removeGuideOffline(
  guideId: string
): Promise<void> {
  try {
    const existing = getOfflineGuides();

    delete existing[guideId];

    localStorage.setItem(
      OFFLINE_GUIDES_KEY,
      JSON.stringify(existing)
    );

    // Keep the implementation simple here.
    // Old cached attachments are harmless and can be reused.
  } catch (err) {
    console.error("Failed to remove offline guide:", err);
  }
}

export function getOfflineGuides(): Record<string, OfflineGuide> {
  try {
    const raw = localStorage.getItem(OFFLINE_GUIDES_KEY);

    if (!raw) {
      return {};
    }

    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read offline guides:", err);
    return {};
  }
}

export function getOfflineGuideById(
  guideId: string
): GuideWithRelations | null {
  const guides = getOfflineGuides();

  return guides[guideId] || null;
}

export function isGuideSavedOffline(guideId: string): boolean {
  const guides = getOfflineGuides();

  return Boolean(guides[guideId]);
}

export async function clearOfflineGuides(): Promise<void> {
  try {
    localStorage.removeItem(OFFLINE_GUIDES_KEY);

    if (typeof window !== "undefined" && "caches" in window) {
      await caches.delete(OFFLINE_CACHE_NAME);
    }
  } catch (err) {
    console.error("Failed to clear offline guides:", err);
  }
}
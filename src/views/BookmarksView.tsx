import { useEffect, useState } from "react";
import {
  Bookmark,
  ChevronRight,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { GuideWithRelations } from "../types";
import { fetchBookmarkedGuides, removeBookmark } from "../lib/queries";
import { navigate } from "../lib/router";

type Props = {
  onBookmarkChange: (id: string, saved: boolean) => void;
};

export function BookmarksView({ onBookmarkChange }: Props) {
  const [guides, setGuides] = useState<GuideWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBookmarkedGuides()
      .then((g) => active && setGuides(g))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function remove(guideId: string) {
    try {
      await removeBookmark(guideId);
      setGuides((prev) => prev.filter((g) => g.id !== guideId));
      onBookmarkChange(guideId, false);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="animate-fade-in px-6 py-8 lg:px-10 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-marine-accent/15 text-marine-accent">
          <Bookmark className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-marine-text">
            Saved Bookmarks
          </h1>
          <p className="text-marine-muted text-sm">
            Guides you've saved for offline reference in the engine room.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-marine-muted">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading bookmarks...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-marine-error text-sm p-4 rounded-lg bg-marine-error/10 border border-marine-error/30 mb-6">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {!loading && !error && guides.length === 0 && (
        <div className="text-center py-20 rounded-xl border border-dashed border-marine-border">
          <Bookmark className="h-12 w-12 text-marine-muted mx-auto mb-4 opacity-50" />
          <p className="text-marine-muted mb-1">No saved guides yet.</p>
          <p className="text-sm text-marine-muted">
            Open any troubleshooting guide and tap "Save Offline" to bookmark
            it here.
          </p>
        </div>
      )}

      {!loading && !error && guides.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((g) => (
            <div
              key={g.id}
              className="group rounded-xl border border-marine-border bg-marine-card p-5 hover:border-marine-accent/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => navigate({ name: "guide", id: g.id })}
                  className="text-left flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-marine-text group-hover:text-marine-accent transition leading-snug line-clamp-2">
                    {g.title}
                  </h3>
                  {g.equipment && (
                    <div className="text-xs text-marine-accent mt-1">
                      {g.equipment.name}
                    </div>
                  )}
                  {g.symptom && (
                    <p className="text-sm text-marine-muted mt-2 line-clamp-2">
                      {g.symptom}
                    </p>
                  )}
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => navigate({ name: "guide", id: g.id })}
                    className="p-2 rounded-lg text-marine-muted hover:text-marine-accent hover:bg-marine-hover transition"
                    title="Open guide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(g.id)}
                    className="p-2 rounded-lg text-marine-muted hover:text-marine-error hover:bg-marine-error/10 transition"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

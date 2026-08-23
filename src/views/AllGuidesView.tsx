import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, BookOpen, ChevronRight, Loader2, ShieldAlert, Wrench, Filter } from "lucide-react";
import { fetchGuides } from "../lib/queries";
import { navigate } from "../lib/router";
import type { Guide, Equipment, Category } from "../types";

type Props = {
  categories?: Category[];
  equipment?: Equipment[];
};

export function AllGuidesView({ categories = [], equipment = [] }: Props = {}) {
  const [guides, setGuides] = useState<(Guide & { equipment?: Equipment })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState<string>("all");

  useEffect(() => {
    async function fetchAllGuides() {
      try {
        setLoading(true);
        const data = await fetchGuides();
        setGuides((data || []) as (Guide & { equipment?: Equipment })[]);
      } catch (err) {
        console.error("Error fetching all guides:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllGuides();
  }, []);

  const filteredGuides = useMemo(() => {
    if (selectedCatId === "all") return guides;
    return guides.filter((g) => {
      const eq = equipment.find((e) => e.id === g.equipment_id);
      return eq?.category_id === selectedCatId || g.category_id === selectedCatId;
    });
  }, [guides, selectedCatId, equipment]);

  return (
    <div className="animate-fade-in px-6 py-8 lg:px-10 max-w-5xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1.5 text-sm text-marine-muted hover:text-marine-accent transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-marine-border pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-marine-accent/15 text-marine-accent flex items-center justify-center border border-marine-accent/20 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-marine-text">All Troubleshooting Guides</h1>
            <p className="text-xs text-marine-muted mt-0.5">
              Browsing {filteredGuides.length} published guides across vessel machinery &amp; electrical systems.
            </p>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-marine-muted shrink-0" />
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-marine-card border border-marine-border text-xs text-marine-text focus:border-marine-accent outline-none"
            >
              <option value="all">All Departments ({guides.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-marine-muted">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-marine-accent" /> Loading guides list...
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-marine-card border border-dashed border-marine-border text-marine-muted">
          No published guides available in this category yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGuides.map((guide) => (
            <button
              key={guide.id}
              type="button"
              onClick={() => navigate({ name: "guide", id: guide.id })}
              className="group text-left rounded-xl border border-marine-border bg-marine-card p-5 hover:border-marine-accent/60 hover:bg-marine-hover/40 transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {guide.equipment && (
                    <span className="text-xs font-semibold text-marine-accent bg-marine-accent/10 border border-marine-accent/20 px-2.5 py-0.5 rounded-md inline-block">
                      {guide.equipment.name}
                    </span>
                  )}
                  <h3 className="font-semibold text-marine-text group-hover:text-marine-accent transition leading-snug text-base">
                    {guide.title}
                  </h3>
                </div>
                <ChevronRight className="h-5 w-5 text-marine-muted group-hover:text-marine-accent group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>

              {guide.symptom && (
                <p className="text-sm text-marine-muted mt-2 line-clamp-2 leading-relaxed">
                  <strong>Symptom:</strong> {guide.symptom}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-marine-border/50">
                {guide.safety_ppe && guide.safety_ppe.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-marine-warn/10 text-marine-warn border border-marine-warn/30 font-medium">
                    <ShieldAlert className="h-3 w-3" />
                    {guide.safety_ppe.length} PPE items
                  </span>
                )}
                {guide.tools_required && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-marine-accent/10 text-marine-accent border border-marine-accent/30 font-medium">
                    <Wrench className="h-3 w-3" />
                    {Array.isArray(guide.tools_required) ? guide.tools_required.length : "Available"} tools
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
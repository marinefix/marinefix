import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Box, FolderTree, Loader2 } from "lucide-react";
import type { Category, Equipment } from "../types";
import { navigate } from "../lib/router";
import { fetchGuides } from "../lib/queries";

type Props = {
  category?: Category;
  categories?: Category[];
  equipment?: Equipment[];
};

export function CategoryView({ category, categories = [], equipment = [] }: Props) {
  const [equipmentCounts, setEquipmentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchGuidesCounts() {
      try {
        const guides = await fetchGuides();
        const counts: Record<string, number> = {};
        guides.forEach((g) => {
          if (g.equipment_id) {
            counts[g.equipment_id] = (counts[g.equipment_id] || 0) + 1;
          }
        });
        setEquipmentCounts(counts);
      } catch (err) {
        console.error("Error fetching equipment guide counts:", err);
      }
    }

    fetchGuidesCounts();
  }, [category]);

  const parentCategory = useMemo(() => {
    if (!category || !category.parent_id || !categories.length) return null;
    return categories.find((c) => c.id === category.parent_id);
  }, [category, categories]);

  const subCategories = useMemo(() => {
    if (!category || !categories.length) return [];
    return categories
      .filter((c) => c.parent_id === category.id)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [category, categories]);

  const sortedEquipment = useMemo(() => {
    if (!category || !equipment.length) return [];

    const childCategoryIds = categories
      .filter((c) => c.parent_id === category.id)
      .map((c) => c.id);

    const list = equipment.filter(
      (e) => e.category_id === category.id || childCategoryIds.includes(e.category_id)
    );

    const uniqueMap = new Map<string, Equipment>();
    list.forEach((item) => uniqueMap.set(item.id, item));
    const uniqueList = Array.from(uniqueMap.values());

    return uniqueList.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      if (nameA === "others") return 1;
      if (nameB === "others") return -1;
      return nameA.localeCompare(nameB);
    });
  }, [category, categories, equipment]);

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-marine-muted">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading department data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <button
        onClick={() => {
          if (parentCategory) {
            navigate({ name: "category", id: parentCategory.id });
          } else {
            navigate({ name: "home" });
          }
        }}
        className="inline-flex items-center gap-2 text-sm text-marine-muted hover:text-marine-accent transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-marine-accent/15 flex items-center justify-center text-marine-accent border border-marine-accent/20">
          <Box className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-marine-text">{category.name}</h1>
          {parentCategory && (
            <p className="text-sm text-marine-muted mt-0.5">{parentCategory.name}</p>
          )}
        </div>
      </div>

      {subCategories.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-marine-text flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-marine-accent" />
            Sub-Categories ({subCategories.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => navigate({ name: "category", id: sub.id })}
                className="group flex items-center justify-between p-4 rounded-xl bg-marine-card border border-marine-border hover:border-marine-accent/50 hover:bg-marine-hover/50 transition text-left"
              >
                <span className="font-medium text-marine-text group-hover:text-marine-accent transition">
                  {sub.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-marine-text">
          Equipment ({sortedEquipment.length})
        </h2>
        {sortedEquipment.length === 0 ? (
          <p className="text-sm text-marine-muted bg-marine-card/40 border border-marine-border p-6 rounded-xl">
            No equipment listed under this department yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEquipment.map((eq) => {
              const count = equipmentCounts[eq.id] || 0;
              return (
                <div
                  key={eq.id}
                  onClick={() => navigate({ name: "equipment", id: eq.id })}
                  className="group relative overflow-hidden rounded-xl bg-marine-card border border-marine-border p-6 hover:border-marine-accent/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-lg bg-marine-dark/60 flex items-center justify-center text-marine-muted group-hover:text-marine-accent transition">
                        <Box className="h-6 w-6" />
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          count > 0
                            ? "bg-marine-accent/15 text-marine-accent border border-marine-accent/30"
                            : "bg-marine-dark text-marine-muted border border-marine-border"
                        }`}
                      >
                        {count} {count === 1 ? "guide" : "guides"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-marine-text group-hover:text-marine-accent transition">
                      {eq.name}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-marine-border/50 flex items-center justify-between text-xs text-marine-accent">
                    <span>View guides</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
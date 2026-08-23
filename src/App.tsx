import { useEffect, useState, useMemo } from "react";
import { useRoute } from "./lib/router";
import { fetchCategories, fetchEquipment, fetchGuides, fetchBookmarkIds } from "./lib/queries";
import type { Category, Equipment, Guide } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { HomeView } from "./views/HomeView";
import { CategoryView } from "./views/CategoryView";
import { EquipmentView } from "./views/EquipmentView";
import { GuideView } from "./views/GuideView";
import { BookmarksView } from "./views/BookmarksView";
import { AddGuideView } from "./views/AddGuideView";
import { AdminPendingView } from "./views/AdminPendingView";
import { AllGuidesView } from "./views/AllGuidesView";

export function App() {
  const route = useRoute();
  const [categories, setCategories] = useState<Category[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    fetchEquipment().then(setEquipment).catch(console.error);
    fetchGuides().then(setGuides).catch(console.error);
    fetchBookmarkIds().then(setBookmarkIds).catch(console.error);
  }, []);

  const guidesCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    guides.forEach((g) => {
      if (g.equipment_id) {
        counts[g.equipment_id] = (counts[g.equipment_id] || 0) + 1;
      }
    });
    return counts;
  }, [guides]);

  const handleBookmarkChange = (guideId: string, saved: boolean) => {
    setBookmarkIds((prev) =>
      saved ? (prev.includes(guideId) ? prev : [...prev, guideId]) : prev.filter((id) => id !== guideId)
    );
  };

  const selectedCategory =
    route.name === "category"
      ? categories.find((c) => c.id === (route as any).id)
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-marine-base text-marine-text font-sans antialiased selection:bg-marine-accent selection:text-marine-base">
      <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      {/* Main Container - relative with flex stretch */}
      <div className="flex-1 flex w-full relative items-stretch">
        {/* Department Sidebar with Sleek Scrollable Container */}
        <div className="hidden md:block shrink-0 border-r border-marine-border bg-marine-card/50">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
            <Sidebar 
              categories={categories} 
              equipment={equipment} 
              guidesCounts={guidesCounts}
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className="md:hidden">
          <Sidebar 
            categories={categories} 
            equipment={equipment} 
            guidesCounts={guidesCounts}
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Primary Main Content View */}
        <main className="flex-1 min-w-0 pb-12">
          {route.name === "home" && (
            <HomeView
              categories={categories}
              equipment={equipment}
              totalGuides={guides.length}
            />
          )}

          {route.name === "category" && (
            <CategoryView 
              category={selectedCategory} 
              categories={categories}
              equipment={equipment}
            />
          )}

          {route.name === "equipment" && (
            <EquipmentView
              equipmentId={(route as any).id}
              categories={categories}
            />
          )}

          {route.name === "guide" && (
            <GuideView
              guideId={(route as any).id}
              isBookmarked={bookmarkIds.includes((route as any).id)}
              onBookmarkChange={handleBookmarkChange}
            />
          )}

          {route.name === "bookmarks" && (
            <BookmarksView onBookmarkChange={handleBookmarkChange} />
          )}

          {route.name === "add-guide" && (
            <AddGuideView
              equipmentId={(route as any).equipmentId}
              categories={categories}
              equipment={equipment}
            />
          )}

          {route.name === "admin-pending" && (
            <AdminPendingView
              categories={categories}
              equipment={equipment}
            />
          )}

          {route.name === "all-guides" && (
            <AllGuidesView
              categories={categories}
              equipment={equipment}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
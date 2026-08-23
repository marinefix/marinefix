import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, FolderTree, X } from "lucide-react";
import type { Category, Equipment } from "../types";
import { getIcon } from "../lib/icons";
import { navigate } from "../lib/router";

type Props = {
  categories: Category[];
  equipment: Equipment[];
  guidesCounts?: Record<string, number>;
  activeCategoryId?: string;
  activeEquipmentId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
  onSelect?: () => void;
};

type TreeNode = Category & { children: TreeNode[] };

export function Sidebar({
  categories,
  equipment,
  guidesCounts = {},
  activeCategoryId,
  activeEquipmentId,
  isOpen = false,
  onClose,
  onNavigate,
  onSelect,
}: Props) {
  const tree = useMemo(() => buildTree(categories), [categories]);

  const initialExpanded = useMemo(() => {
    const set = new Set<string>();
    if (activeCategoryId) {
      let currentId: string | null | undefined = activeCategoryId;
      while (currentId) {
        const current = categories.find((c) => c.id === currentId);
        if (!current) break;
        set.add(current.id);
        currentId = current.parent_id;
      }
    }
    if (activeEquipmentId) {
      const eq = equipment.find((e) => e.id === activeEquipmentId);
      if (eq) {
        set.add(eq.category_id);
        let parentId: string | null = eq.category_id;
        while (parentId) {
          set.add(parentId);
          const parent = categories.find((c) => c.id === parentId);
          parentId = parent?.parent_id ?? null;
        }
      }
    }
    return set;
  }, [categories, equipment, activeCategoryId, activeEquipmentId]);

  const [expanded, setExpanded] = useState<Set<string>>(initialExpanded);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function equipmentFor(catId: string): Equipment[] {
    return equipment
      .filter((e) => e.category_id === catId)
      .sort((a, b) => {
        if (a.name.toLowerCase() === "others") return 1;
        if (b.name.toLowerCase() === "others") return -1;
        return a.name.localeCompare(b.name);
      });
  }

  function getCategoryGuideCount(catId: string): number {
    const directEquip = equipment.filter((e) => e.category_id === catId);
    let total = directEquip.reduce((sum, eq) => sum + (guidesCounts[eq.id] || 0), 0);

    const childCats = categories.filter((c) => c.parent_id === catId);
    childCats.forEach((child) => {
      total += getCategoryGuideCount(child.id);
    });

    return total;
  }

  const handleItemSelect = () => {
    onClose?.();
    onNavigate?.();
    onSelect?.();
  };

  const navContent = (
    <nav className="h-full overflow-y-auto scrollbar-marine py-4">
      <div className="px-4 mb-3 flex items-center justify-between text-marine-muted text-xs uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-marine-accent" />
          <span>Departments</span>
        </div>
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="md:hidden p-1 text-marine-muted hover:text-marine-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <ul className="space-y-1 px-2">
        {tree.map((node) => (
          <DepartmentNode
            key={node.id}
            node={node}
            categories={categories}
            expanded={expanded}
            onToggle={toggle}
            activeCategoryId={activeCategoryId}
            activeEquipmentId={activeEquipmentId}
            equipmentFor={equipmentFor}
            guidesCounts={guidesCounts}
            getCategoryGuideCount={getCategoryGuideCount}
            onSelect={handleItemSelect}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-72 shrink-0 border-r border-marine-border bg-marine-card/30 hidden md:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)]">
          {navContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={onClose} 
          />
          <div className="relative w-80 max-w-[80vw] bg-marine-base border-r border-marine-border h-full z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

function DepartmentNode({
  node,
  categories,
  expanded,
  onToggle,
  activeCategoryId,
  activeEquipmentId,
  equipmentFor,
  guidesCounts,
  getCategoryGuideCount,
  onSelect,
  depth,
}: {
  node: TreeNode;
  categories: Category[];
  expanded: Set<string>;
  onToggle: (id: string) => void;
  activeCategoryId?: string;
  activeEquipmentId?: string;
  equipmentFor: (catId: string) => Equipment[];
  guidesCounts: Record<string, number>;
  getCategoryGuideCount: (catId: string) => number;
  onSelect?: () => void;
  depth: number;
}) {
  const isOpen = expanded.has(node.id);
  const isActive = activeCategoryId === node.id;
  const Icon = getIcon(node.icon, node.name);
  const childNodes = node.children;
  const items = equipmentFor(node.id);

  const hasChildren = childNodes.length > 0 || items.length > 0;
  const catTotalGuides = getCategoryGuideCount(node.id);

  const handleCategoryClick = () => {
    if (hasChildren && !isOpen) {
      onToggle(node.id);
    }
    navigate({ name: "category", id: node.id });
    onSelect?.();
  };

  return (
    <li>
      <div
        className={`group flex items-center gap-1 rounded-lg transition ${
          isActive
            ? "bg-marine-accent/15 text-marine-accent font-semibold"
            : "hover:bg-marine-hover text-marine-text"
        }`}
        style={{ paddingLeft: `${depth * 10 + 6}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="p-1 text-marine-muted hover:text-marine-accent shrink-0 rounded cursor-pointer"
            title="Expand / Collapse"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}

        <button
          type="button"
          onClick={handleCategoryClick}
          className="flex items-center gap-2 flex-1 py-2 pr-2 text-left min-w-0 cursor-pointer"
          title={node.name}
        >
          <Icon className="h-4 w-4 text-marine-accent shrink-0" />
          <span className="text-xs font-medium truncate leading-tight flex-1">{node.name}</span>
          
          {catTotalGuides > 0 && (
            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-marine-accent/15 text-marine-accent border border-marine-accent/30">
              {catTotalGuides}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-0.5 space-y-0.5 animate-slide-down">
          {childNodes.map((child) => (
            <DepartmentNode
              key={child.id}
              node={child}
              categories={categories}
              expanded={expanded}
              onToggle={onToggle}
              activeCategoryId={activeCategoryId}
              activeEquipmentId={activeEquipmentId}
              equipmentFor={equipmentFor}
              guidesCounts={guidesCounts}
              getCategoryGuideCount={getCategoryGuideCount}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
          {items.map((eq) => {
            const count = guidesCounts[eq.id] || 0;
            return (
              <li
                key={eq.id}
                className={`group flex items-center rounded-lg transition ${
                  activeEquipmentId === eq.id
                    ? "bg-marine-accent/15 text-marine-accent font-semibold"
                    : "hover:bg-marine-hover text-marine-text"
                }`}
                style={{ paddingLeft: `${(depth + 1) * 10 + 18}px` }}
              >
                <button
                  type="button"
                  onClick={() => {
                    navigate({ name: "equipment", id: eq.id });
                    onSelect?.();
                  }}
                  className="flex items-center justify-between flex-1 py-1.5 pr-2 text-left text-xs min-w-0 cursor-pointer"
                  title={eq.name}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${count > 0 ? "bg-marine-accent" : "bg-marine-muted"}`} />
                    <span className="truncate">{eq.name}</span>
                  </div>

                  {count > 0 && (
                    <span className="ml-1 shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-marine-accent text-marine-base">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function buildTree(categories: Category[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  categories.forEach((c) =>
    byId.set(c.id, { ...c, children: [] })
  );
  const roots: TreeNode[] = [];
  byId.forEach((node) => {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  byId.forEach((node) =>
    node.children.sort((a, b) => a.order_index - b.order_index)
  );
  roots.sort((a, b) => a.order_index - b.order_index);
  return roots;
}
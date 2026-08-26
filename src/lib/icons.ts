import {
  Anchor,
  Cog,
  Zap,
  Snowflake,
  Shield,
  Gauge,
  Flame,
  Wrench,
  Wind,
  Fan,
  Home,
  Compass,
  Layers,
  LucideIcon,
} from "lucide-react";

export function getIcon(iconName?: string | null, categoryName?: string): LucideIcon {
  const name = (categoryName || iconName || "").toLowerCase();

  if (name.includes("main engine") || name.includes("auxiliary engine") || name.includes("engine")) return Cog;
  if (name.includes("ballast")) return Compass;
  if (name.includes("purifier")) return Wrench;
  if (name.includes("boiler")) return Flame;
  if (name.includes("compressor")) return Wind;
  if (name.includes("pump")) return Fan;
  if (name.includes("power") || name.includes("generator") || name.includes("distribution")) return Zap;
  if (name.includes("instrument") || name.includes("control") || name.includes("ams")) return Gauge;
  if (name.includes("safety") || name.includes("fire")) return Shield;
  if (name.includes("accommo") || name.includes("domestic")) return Home;
  if (name.includes("reefer")) return Snowflake;
  if (name.includes("other") || name.includes("general")) return Layers;

  return Anchor; // Default fallback icon
}
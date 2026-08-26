import { onRequestDelete as __api_bookmarks_ts_onRequestDelete } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\bookmarks.ts"
import { onRequestGet as __api_bookmarks_ts_onRequestGet } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\bookmarks.ts"
import { onRequestPost as __api_bookmarks_ts_onRequestPost } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\bookmarks.ts"
import { onRequestGet as __api_categories_ts_onRequestGet } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\categories.ts"
import { onRequestGet as __api_equipment_ts_onRequestGet } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\equipment.ts"
import { onRequestDelete as __api_guides_ts_onRequestDelete } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\guides.ts"
import { onRequestGet as __api_guides_ts_onRequestGet } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\guides.ts"
import { onRequestPatch as __api_guides_ts_onRequestPatch } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\guides.ts"
import { onRequestPost as __api_guides_ts_onRequestPost } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\guides.ts"
import { onRequestGet as __api_search_ts_onRequestGet } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\search.ts"
import { onRequestGet as __api_upload_ts_onRequestGet } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\upload.ts"
import { onRequestPost as __api_upload_ts_onRequestPost } from "D:\\MY 1ST PROJECT MARINE FIX\\marinefix-main\\functions\\api\\upload.ts"

export const routes = [
    {
      routePath: "/api/bookmarks",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_bookmarks_ts_onRequestDelete],
    },
  {
      routePath: "/api/bookmarks",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_bookmarks_ts_onRequestGet],
    },
  {
      routePath: "/api/bookmarks",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_bookmarks_ts_onRequestPost],
    },
  {
      routePath: "/api/categories",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_categories_ts_onRequestGet],
    },
  {
      routePath: "/api/equipment",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_equipment_ts_onRequestGet],
    },
  {
      routePath: "/api/guides",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_guides_ts_onRequestDelete],
    },
  {
      routePath: "/api/guides",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_guides_ts_onRequestGet],
    },
  {
      routePath: "/api/guides",
      mountPath: "/api",
      method: "PATCH",
      middlewares: [],
      modules: [__api_guides_ts_onRequestPatch],
    },
  {
      routePath: "/api/guides",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_guides_ts_onRequestPost],
    },
  {
      routePath: "/api/search",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_search_ts_onRequestGet],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_upload_ts_onRequestGet],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_upload_ts_onRequestPost],
    },
  ]
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/bookmarks.ts
var onRequestGet = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const idsOnly = url.searchParams.get("ids_only") === "true";
  try {
    if (idsOnly) {
      const { results: results2 } = await context.env.DB.prepare(
        "SELECT guide_id FROM bookmarks ORDER BY created_at DESC"
      ).all();
      const ids = (results2 || []).map((row) => row.guide_id);
      return Response.json({ ids });
    }
    const { results } = await context.env.DB.prepare(
      `SELECT g.*, 
              json_object('id', e.id, 'name', e.name, 'slug', e.slug, 'image_url', e.image_url) as equipment 
       FROM bookmarks b 
       JOIN guides g ON b.guide_id = g.id 
       LEFT JOIN equipment e ON g.equipment_id = e.id 
       ORDER BY b.created_at DESC`
    ).all();
    const formatted = (results || []).map((g) => ({
      ...g,
      equipment: typeof g.equipment === "string" ? JSON.parse(g.equipment) : g.equipment,
      safety_ppe: g.safety_ppe ? typeof g.safety_ppe === "string" ? JSON.parse(g.safety_ppe) : g.safety_ppe : [],
      tools_required: g.tools_required ? typeof g.tools_required === "string" ? JSON.parse(g.tools_required) : g.tools_required : []
    }));
    return Response.json(formatted);
  } catch (err) {
    return Response.json(idsOnly ? { ids: [] } : [], { status: 200 });
  }
}, "onRequestGet");
var onRequestPost = /* @__PURE__ */ __name(async (context) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const guide_id = body.guide_id;
    if (!guide_id) {
      return new Response(JSON.stringify({ error: "Missing guide_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await context.env.DB.prepare(
      "INSERT OR IGNORE INTO bookmarks (id, guide_id) VALUES (?, ?)"
    ).bind(crypto.randomUUID(), guide_id).run();
    return Response.json({ success: true, guide_id });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
var onRequestDelete = /* @__PURE__ */ __name(async (context) => {
  try {
    const url = new URL(context.request.url);
    const guideId = url.searchParams.get("guide_id");
    if (!guideId) {
      return new Response(JSON.stringify({ error: "Missing guide_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await context.env.DB.prepare("DELETE FROM bookmarks WHERE guide_id = ?").bind(guideId).run();
    return Response.json({ success: true, guide_id: guideId });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestDelete");

// api/categories.ts
var onRequestGet2 = /* @__PURE__ */ __name(async (context) => {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
    return Response.json(results);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}, "onRequestGet");

// api/equipment.ts
var onRequestGet3 = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const categoryId = url.searchParams.get("category_id");
  const equipmentId = url.searchParams.get("id");
  try {
    if (equipmentId) {
      const result = await context.env.DB.prepare(
        "SELECT * FROM equipment WHERE id = ?"
      ).bind(equipmentId).first();
      if (!result) {
        return new Response("Equipment not found", { status: 404 });
      }
      return Response.json(result);
    }
    if (categoryId) {
      const { results: results2 } = await context.env.DB.prepare(
        "SELECT * FROM equipment WHERE category_id = ? ORDER BY name ASC"
      ).bind(categoryId).all();
      return Response.json(results2 || []);
    }
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM equipment ORDER BY name ASC"
    ).all();
    return Response.json(results || []);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}, "onRequestGet");

// api/guides.ts
var onRequestGet4 = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const equipmentId = url.searchParams.get("equipment_id");
  const guideId = url.searchParams.get("id");
  const pendingOnly = url.searchParams.get("pending") === "true";
  try {
    if (guideId) {
      const guide = await context.env.DB.prepare(
        `SELECT g.*, 
                json_object('id', e.id, 'name', e.name, 'slug', e.slug, 'image_url', e.image_url) as equipment 
         FROM guides g 
         LEFT JOIN equipment e ON g.equipment_id = e.id 
         WHERE g.id = ?`
      ).bind(guideId).first();
      if (!guide) return new Response("Guide not found", { status: 404 });
      const { results: steps } = await context.env.DB.prepare(
        "SELECT * FROM guide_steps WHERE guide_id = ? ORDER BY step_number ASC"
      ).bind(guideId).all();
      const { results: images } = await context.env.DB.prepare(
        "SELECT * FROM guide_images WHERE guide_id = ? ORDER BY order_index ASC"
      ).bind(guideId).all();
      const formatted2 = {
        ...guide,
        equipment: typeof guide.equipment === "string" ? JSON.parse(guide.equipment) : guide.equipment,
        safety_ppe: guide.safety_ppe ? typeof guide.safety_ppe === "string" ? JSON.parse(guide.safety_ppe) : guide.safety_ppe : [],
        tools_required: guide.tools_required ? typeof guide.tools_required === "string" ? JSON.parse(guide.tools_required) : guide.tools_required : [],
        steps: (steps || []).map((st) => ({
          ...st,
          images: st.images ? typeof st.images === "string" ? JSON.parse(st.images) : st.images : []
        })),
        images: images || []
      };
      return Response.json(formatted2);
    }
    if (pendingOnly) {
      const { results: results2 } = await context.env.DB.prepare(
        `SELECT g.*, 
                json_object('id', e.id, 'name', e.name, 'slug', e.slug) as equipment 
         FROM guides g 
         LEFT JOIN equipment e ON g.equipment_id = e.id 
         WHERE g.status = 'pending' AND g.is_approved = 0
         ORDER BY g.created_at DESC`
      ).all();
      const formatted2 = (results2 || []).map((g) => ({
        ...g,
        equipment: typeof g.equipment === "string" ? JSON.parse(g.equipment) : g.equipment,
        safety_ppe: g.safety_ppe ? typeof g.safety_ppe === "string" ? JSON.parse(g.safety_ppe) : g.safety_ppe : [],
        tools_required: g.tools_required ? typeof g.tools_required === "string" ? JSON.parse(g.tools_required) : g.tools_required : []
      }));
      return Response.json(formatted2);
    }
    if (equipmentId) {
      const { results: results2 } = await context.env.DB.prepare(
        "SELECT * FROM guides WHERE equipment_id = ? AND is_approved = 1 ORDER BY created_at DESC"
      ).bind(equipmentId).all();
      const formatted2 = (results2 || []).map((g) => ({
        ...g,
        safety_ppe: g.safety_ppe ? typeof g.safety_ppe === "string" ? JSON.parse(g.safety_ppe) : g.safety_ppe : [],
        tools_required: g.tools_required ? typeof g.tools_required === "string" ? JSON.parse(g.tools_required) : g.tools_required : []
      }));
      return Response.json(formatted2);
    }
    const { results } = await context.env.DB.prepare(
      `SELECT g.*, 
              json_object('id', e.id, 'name', e.name, 'slug', e.slug) as equipment 
       FROM guides g 
       LEFT JOIN equipment e ON g.equipment_id = e.id 
       WHERE g.is_approved = 1 
       ORDER BY g.created_at DESC`
    ).all();
    const formatted = (results || []).map((g) => ({
      ...g,
      equipment: typeof g.equipment === "string" ? JSON.parse(g.equipment) : g.equipment,
      safety_ppe: g.safety_ppe ? typeof g.safety_ppe === "string" ? JSON.parse(g.safety_ppe) : g.safety_ppe : [],
      tools_required: g.tools_required ? typeof g.tools_required === "string" ? JSON.parse(g.tools_required) : g.tools_required : []
    }));
    return Response.json(formatted);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}, "onRequestGet");
var onRequestPost2 = /* @__PURE__ */ __name(async (context) => {
  try {
    const data = await context.request.json();
    const guideId = crypto.randomUUID();
    const ppeJson = JSON.stringify(data.safety_ppe || []);
    const toolsJson = JSON.stringify(data.tools_required || []);
    await context.env.DB.prepare(
      `INSERT INTO guides (
        id, equipment_id, title, author_email, author_phone, 
        symptom, safety_ppe, tools_required, introduction, 
        status, is_approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0)`
    ).bind(
      guideId,
      data.equipment_id,
      data.title,
      data.author_email || null,
      data.author_phone || null,
      data.symptom || null,
      ppeJson,
      toolsJson,
      data.introduction || null
    ).run();
    if (data.steps && Array.isArray(data.steps)) {
      for (let i = 0; i < data.steps.length; i++) {
        const step = data.steps[i];
        await context.env.DB.prepare(
          `INSERT INTO guide_steps (
            id, guide_id, step_number, title, instruction, warning, images
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          crypto.randomUUID(),
          guideId,
          step.step_number || i + 1,
          step.title || `Step ${i + 1}`,
          step.instruction || "",
          step.warning || null,
          JSON.stringify(step.images || [])
        ).run();
      }
    }
    if (data.image_urls && Array.isArray(data.image_urls)) {
      for (let i = 0; i < data.image_urls.length; i++) {
        const img = data.image_urls[i];
        const imgUrl = typeof img === "string" ? img : img.url;
        if (imgUrl) {
          await context.env.DB.prepare(
            `INSERT INTO guide_images (
              id, guide_id, caption, url, order_index
            ) VALUES (?, ?, ?, ?, ?)`
          ).bind(crypto.randomUUID(), guideId, img.name || img.caption || null, imgUrl, i).run();
        }
      }
    }
    return Response.json({ success: true, id: guideId });
  } catch (err) {
    console.error("Guide creation error:", err);
    return new Response(err.message, { status: 500 });
  }
}, "onRequestPost");
var onRequestPatch = /* @__PURE__ */ __name(async (context) => {
  try {
    const { id, action } = await context.request.json();
    if (!id || !action) {
      return new Response("Missing id or action", { status: 400 });
    }
    if (action === "approve") {
      await context.env.DB.prepare(
        "UPDATE guides SET is_approved = 1, status = 'approved' WHERE id = ?"
      ).bind(id).run();
      return Response.json({ success: true, message: "Guide approved" });
    }
    if (action === "reject") {
      await context.env.DB.prepare("DELETE FROM guide_steps WHERE guide_id = ?").bind(id).run();
      await context.env.DB.prepare("DELETE FROM guide_images WHERE guide_id = ?").bind(id).run();
      await context.env.DB.prepare("DELETE FROM bookmarks WHERE guide_id = ?").bind(id).run();
      await context.env.DB.prepare("DELETE FROM guides WHERE id = ?").bind(id).run();
      return Response.json({ success: true, message: "Guide rejected and permanently deleted from database" });
    }
    return new Response("Invalid action", { status: 400 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}, "onRequestPatch");
var onRequestDelete2 = /* @__PURE__ */ __name(async (context) => {
  try {
    const url = new URL(context.request.url);
    const guideId = url.searchParams.get("id");
    if (!guideId) {
      return new Response("Missing guide ID", { status: 400 });
    }
    await context.env.DB.prepare("DELETE FROM guide_steps WHERE guide_id = ?").bind(guideId).run();
    await context.env.DB.prepare("DELETE FROM guide_images WHERE guide_id = ?").bind(guideId).run();
    await context.env.DB.prepare("DELETE FROM bookmarks WHERE guide_id = ?").bind(guideId).run();
    await context.env.DB.prepare("DELETE FROM guides WHERE id = ?").bind(guideId).run();
    return Response.json({ success: true, message: "Guide deleted permanently" });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response(err.message, { status: 500 });
  }
}, "onRequestDelete");

// api/search.ts
var onRequestGet5 = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const q = url.searchParams.get("q")?.trim() || "";
  if (!q) {
    return Response.json({ guides: [], equipment: [] });
  }
  const like = `%${q}%`;
  try {
    const { results: guides } = await context.env.DB.prepare(
      `SELECT g.*, 
                json_object('id', e.id, 'name', e.name, 'slug', e.slug, 'image_url', e.image_url) as equipment 
         FROM guides g 
         LEFT JOIN equipment e ON g.equipment_id = e.id 
         WHERE (g.status = 'approved' OR g.is_approved = 1) 
           AND (LOWER(g.title) LIKE LOWER(?1) OR LOWER(COALESCE(g.symptom, '')) LIKE LOWER(?1))
         ORDER BY g.created_at DESC 
         LIMIT 10`
    ).bind(like).all();
    const formattedGuides = (guides || []).map((g) => ({
      ...g,
      equipment: typeof g.equipment === "string" ? JSON.parse(g.equipment) : g.equipment
    }));
    const { results: equipment } = await context.env.DB.prepare(
      `SELECT id, category_id, name, slug, description, image_url 
         FROM equipment 
         WHERE LOWER(name) LIKE LOWER(?1) OR LOWER(COALESCE(description, '')) LIKE LOWER(?1) 
         ORDER BY name ASC 
         LIMIT 10`
    ).bind(like).all();
    return Response.json({
      guides: formattedGuides,
      equipment: equipment || []
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, guides: [], equipment: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/upload.ts
var onRequestPost3 = /* @__PURE__ */ __name(async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get("file");
    if (!file) return new Response("No file uploaded", { status: 400 });
    const key = `${Date.now()}-${file.name}`;
    await context.env.STORAGE.put(key, file.stream(), {
      httpMetadata: { contentType: file.type }
    });
    return Response.json({ key, url: `/api/upload?key=${encodeURIComponent(key)}` });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}, "onRequestPost");
var onRequestGet6 = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");
  if (!key) return new Response("Key missing", { status: 400 });
  const object = await context.env.STORAGE.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}, "onRequestGet");

// ../.wrangler/tmp/pages-MSfrEV/functionsRoutes-0.6188011091196435.mjs
var routes = [
  {
    routePath: "/api/bookmarks",
    mountPath: "/api",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/bookmarks",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/bookmarks",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/categories",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/equipment",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/guides",
    mountPath: "/api",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/guides",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/guides",
    mountPath: "/api",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/guides",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/search",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/upload",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/upload",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};

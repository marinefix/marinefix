interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const idsOnly = url.searchParams.get("ids_only") === "true";

  try {
    if (idsOnly) {
      const { results } = await context.env.DB.prepare(
        "SELECT guide_id FROM bookmarks ORDER BY created_at DESC"
      ).all();
      const ids = (results || []).map((row: any) => row.guide_id);
      return Response.json({ ids });
    }

    // Full bookmarked guides with equipment details
    const { results } = await context.env.DB.prepare(
      `SELECT g.*, 
              json_object('id', e.id, 'name', e.name, 'slug', e.slug, 'image_url', e.image_url) as equipment 
       FROM bookmarks b 
       JOIN guides g ON b.guide_id = g.id 
       LEFT JOIN equipment e ON g.equipment_id = e.id 
       ORDER BY b.created_at DESC`
    ).all();

    const formatted = (results || []).map((g: any) => ({
      ...g,
      equipment: typeof g.equipment === "string" ? JSON.parse(g.equipment) : g.equipment,
      safety_ppe: g.safety_ppe ? (typeof g.safety_ppe === "string" ? JSON.parse(g.safety_ppe) : g.safety_ppe) : [],
      tools_required: g.tools_required ? (typeof g.tools_required === "string" ? JSON.parse(g.tools_required) : g.tools_required) : [],
    }));

    return Response.json(formatted);
  } catch (err: any) {
    return Response.json(idsOnly ? { ids: [] } : [], { status: 200 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json().catch(() => ({}))) as any;
    const guide_id = body.guide_id;

    if (!guide_id) {
      return new Response(JSON.stringify({ error: "Missing guide_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await context.env.DB.prepare(
      "INSERT OR IGNORE INTO bookmarks (id, guide_id) VALUES (?, ?)"
    )
      .bind(crypto.randomUUID(), guide_id)
      .run();

    return Response.json({ success: true, guide_id });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const guideId = url.searchParams.get("guide_id");

    if (!guideId) {
      return new Response(JSON.stringify({ error: "Missing guide_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await context.env.DB.prepare("DELETE FROM bookmarks WHERE guide_id = ?")
      .bind(guideId)
      .run();

    return Response.json({ success: true, guide_id: guideId });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
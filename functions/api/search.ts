interface Env {
    DB: D1Database;
  }
  
  export const onRequestGet: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url);
    const q = url.searchParams.get("q")?.trim() || "";
  
    if (!q) {
      return Response.json({ guides: [], equipment: [] });
    }
  
    const like = `%${q}%`;
  
    try {
      // 1. Fetch Guides with Equipment JSON object (safe columns only)
      const { results: guides } = await context.env.DB.prepare(
        `SELECT g.*, 
                json_object('id', e.id, 'name', e.name, 'slug', e.slug, 'image_url', e.image_url) as equipment 
         FROM guides g 
         LEFT JOIN equipment e ON g.equipment_id = e.id 
         WHERE (g.status = 'approved' OR g.is_approved = 1) 
           AND (LOWER(g.title) LIKE LOWER(?1) OR LOWER(COALESCE(g.symptom, '')) LIKE LOWER(?1))
         ORDER BY g.created_at DESC 
         LIMIT 10`
      )
        .bind(like)
        .all();
  
      const formattedGuides = (guides || []).map((g: any) => ({
        ...g,
        equipment: typeof g.equipment === "string" ? JSON.parse(g.equipment) : g.equipment,
      }));
  
      // 2. Fetch Equipment (safe columns & COALESCE for NULL description)
      const { results: equipment } = await context.env.DB.prepare(
        `SELECT id, category_id, name, slug, description, image_url 
         FROM equipment 
         WHERE LOWER(name) LIKE LOWER(?1) OR LOWER(COALESCE(description, '')) LIKE LOWER(?1) 
         ORDER BY name ASC 
         LIMIT 10`
      )
        .bind(like)
        .all();
  
      return Response.json({
        guides: formattedGuides,
        equipment: equipment || [],
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message, guides: [], equipment: [] }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  };
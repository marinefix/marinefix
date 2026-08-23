interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const categoryId = url.searchParams.get("category_id");
  const equipmentId = url.searchParams.get("id");

  try {
    // 1. Single Equipment by ID fetch panna
    if (equipmentId) {
      const result = await context.env.DB.prepare(
        "SELECT * FROM equipment WHERE id = ?"
      )
        .bind(equipmentId)
        .first();

      if (!result) {
        return new Response("Equipment not found", { status: 404 });
      }
      return Response.json(result);
    }

    // 2. Equipment by Category ID fetch panna
    if (categoryId) {
      const { results } = await context.env.DB.prepare(
        "SELECT * FROM equipment WHERE category_id = ? ORDER BY name ASC"
      )
        .bind(categoryId)
        .all();
      return Response.json(results || []);
    }

    // 3. All Equipment fetch panna
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM equipment ORDER BY name ASC"
    ).all();
    return Response.json(results || []);
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
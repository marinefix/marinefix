interface Env {
    DB: D1Database;
  }
  
  export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
      const { results } = await context.env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
      return Response.json(results);
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  };
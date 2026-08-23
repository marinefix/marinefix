interface Env {
    STORAGE: R2Bucket;
  }
  
  export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
      const formData = await context.request.formData();
      const file = formData.get("file") as File;
      if (!file) return new Response("No file uploaded", { status: 400 });
  
      const key = `${Date.now()}-${file.name}`;
      await context.env.STORAGE.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });
  
      return Response.json({ key, url: `/api/upload?key=${encodeURIComponent(key)}` });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  };
  
  export const onRequestGet: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url);
    const key = url.searchParams.get("key");
    if (!key) return new Response("Key missing", { status: 400 });
  
    const object = await context.env.STORAGE.get(key);
    if (!object) return new Response("Not found", { status: 404 });
  
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    return new Response(object.body, { headers });
  };
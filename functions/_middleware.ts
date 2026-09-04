const ALLOWED_ORIGINS = new Set([
    "https://marinefixapp.pages.dev",
    "https://localhost",
    "http://localhost",
    "capacitor://localhost",
  ]);
  
  export const onRequest: PagesFunction = async (context) => {
    const origin = context.request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : null;
  
    if (context.request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...(allowedOrigin
            ? {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": "true",
                "Vary": "Origin",
              }
            : {}),
        },
      });
    }
  
    const response = await context.next();
  
    const headers = new Headers(response.headers);
    if (allowedOrigin) {
      headers.set("Access-Control-Allow-Origin", allowedOrigin);
      headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type");
      headers.set("Access-Control-Allow-Credentials", "true");
      headers.set("Vary", "Origin");
    }
  
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
export async function onRequest(context) { const url = new URL(context.request.url); const asset = await context.env.ASSETS.fetch(new URL('/MarineFix.apk', url.origin)); return asset; }

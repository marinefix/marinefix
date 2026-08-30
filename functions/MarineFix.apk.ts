export async function onRequest(context: any) {
    const url = new URL(context.request.url);
    const asset = await context.env.ASSETS.fetch(new URL("/MarineFix.apk", url.origin));
  
    return new Response(asset.body, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="MarineFix.apk"',
      },
    });
  }
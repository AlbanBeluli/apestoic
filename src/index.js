export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Default to index.html for root
    if (path === "/") {
      path = "/index.html";
    }

    // Try to get the asset
    const asset = await env.ASSETS.fetch(new Request(new URL(path, url.origin)));

    if (asset.status === 404) {
      // Fallback to index.html for SPA-like behavior (optional)
      return env.ASSETS.fetch(new Request(new URL("/index.html", url.origin)));
    }

    return asset;
  }
};
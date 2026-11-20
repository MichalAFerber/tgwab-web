// The @astrojs/sitemap options every live site shares, so each live site's
// astro.config.mjs makes one `sitemap(sitemapOptions(...))` call. kj4dia.me is
// lapsing and keeps its own inline options.
//
// DS §11: the sitemap MUST carry `lastmod`, and §11 does not say what the date
// must mean. A page with a date of its own gets that date from `lastmodFor(url)`,
// which returns a Date or null; michalferber.me passes its posts' filename date.
// Every other page gets the build time. That is not a per-page edit date: every
// deploy restamps it, so Google may discount it.
export function sitemapOptions({ lastmodFor } = {}) {
  return {
    // /search/ is noindex (SharedSearchPage.astro), so it stays out.
    filter: (page) => !page.endsWith("/search/"),
    lastmod: new Date(),
    ...(lastmodFor && {
      serialize: (item) => {
        const date = lastmodFor(item.url);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  };
}

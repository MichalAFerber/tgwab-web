// A post's date lives only in its filename: `2026-04-01-slug.md` is dated
// 2026-04-01, at midnight UTC (docs/content-workflow.md). The blog index, each
// post page, and /rss.xml all read it here. A post without the prefix, or with
// one that is not a real date, has no date.
export function parseDateFromSlug(slug: string): Date | null {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!match) return null;
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

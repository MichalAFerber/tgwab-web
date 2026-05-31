# `packages/ui/src/Head.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title,
  description = "TechGuyWithABeard — IT, tools, and opinions by Michal Ferber.",
  ogImage = "/og-default.png",
  canonical,
} = Astro.props;

const canonicalURL = canonical || Astro.url.href;
---

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:type" content="website" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@techguywithabeard" />

<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

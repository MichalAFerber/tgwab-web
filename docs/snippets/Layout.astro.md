# `packages/ui/src/Layout.astro`

```astro
---
import "@tgwab/design-tokens/tokens.css";
import "@tgwab/design-tokens/base.css";
import Head from "./Head.astro";
import Nav from "./Nav.astro";
import Footer from "./Footer.astro";

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  productName?: string;
  showNav?: boolean;
}

const {
  title,
  description,
  ogImage,
  productName,
  showNav = true,
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <Head title={title} description={description} ogImage={ogImage} />
  </head>
  <body>
    {showNav && <Nav currentPath={Astro.url.pathname} />}
    <main>
      <slot />
    </main>
    <Footer productName={productName} />
  </body>
</html>
```

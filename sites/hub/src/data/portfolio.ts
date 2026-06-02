export type PortfolioCategory =
  | "chrome-extension"
  | "script"
  | "website"
  | "service"
  | "other";

export type PortfolioStatus = "live" | "beta" | "planning" | "paused";

export interface PortfolioEntry {
  name: string;
  tagline?: string;
  description?: string;
  url: string;
  status?: PortfolioStatus;
  tier?: number;
  category: PortfolioCategory;
  categoryLabel: string;
  featured?: boolean;
  revenue?: string;
}

export const portfolio: PortfolioEntry[] = [
  {
    name: "ResizeWizard",
    tagline: "Quick, anchored window resizing for Chrome — free plus Pro",
    description: "Quick, anchored window resizing for Chrome — free plus Pro",
    url: "https://resizewizard.app",
    status: "live",
    tier: 1,
    category: "chrome-extension",
    categoryLabel: "Chrome Extensions",
    featured: true,
    revenue: "Pro $12/yr",
  },
  {
    name: "MyKK.us",
    tagline: "Browser dashboard + Chrome extension — start page done right",
    description: "Browser dashboard + Chrome extension — start page done right",
    url: "https://mykk.us",
    status: "live",
    tier: 1,
    category: "chrome-extension",
    categoryLabel: "Chrome Extensions",
    featured: true,
    revenue: "Pro $12/yr",
  },
  {
    name: "CopyWizard",
    tagline: "Intelligent form-field mapper, local-only storage",
    description: "Intelligent form-field mapper, local-only storage",
    url: "https://copywizard.us",
    status: "planning",
    tier: 2,
    category: "chrome-extension",
    categoryLabel: "Chrome Extensions",
  },
  {
    name: "AutoMockup",
    tagline: "Full-page screenshots auto-framed with OS/browser chrome",
    description: "Full-page screenshots auto-framed with OS/browser chrome",
    url: "https://automockup.app",
    status: "planning",
    tier: 2,
    category: "chrome-extension",
    categoryLabel: "Chrome Extensions",
  },
  {
    name: "GitHub Tree Browser",
    tagline: "Browse any public GitHub repo's file tree without cloning",
    description: "Single-file client-side web tool for browsing public GitHub repos with inline previews and one-click raw/CDN URL copy.",
    url: "https://michalaferber.github.io/github-tree-browser/",
    status: "live",
    tier: 1,
    category: "script",
    categoryLabel: "Scripts",
  },
  {
    name: "BrokeDNS",
    tagline: "Freelance DNS repair and migration consulting",
    description: "Freelance DNS repair and migration consulting",
    url: "https://brokedns.com",
    status: "planning",
    tier: 1,
    category: "website",
    categoryLabel: "Websites",
    revenue: "$4.4k/mo target",
  },
  {
    name: "de-google.us",
    tagline: "Privacy-first Proton affiliate site — get Google out of your life",
    description: "Privacy-first Proton affiliate site — get Google out of your life. Astro 5 static site, self-hosted fonts (no Google Fonts on the de-Google site).",
    url: "https://de-google.us",
    status: "live",
    tier: 1,
    category: "website",
    categoryLabel: "Websites",
    revenue: "Proton affiliate",
  },
  {
    name: "IP Cow",
    tagline: "IP lookup and network tools — running since 2005",
    description: "IP lookup and network tools — running since 2005",
    url: "https://ipcow.com",
    status: "live",
    tier: 2,
    category: "website",
    categoryLabel: "Websites",
  },
  {
    name: "El San Jose",
    tagline: "Marketing site for a family-owned Mexican restaurant — Lake City, SC",
    description: "Marketing site for a family-owned Mexican restaurant — Lake City, SC",
    url: "https://elsanjose.com",
    status: "live",
    tier: 3,
    category: "website",
    categoryLabel: "Websites",
  },
  {
    name: "Project Omega",
    tagline: "E2E-encrypted ebook viewer — paused",
    description: "E2E-encrypted ebook viewer — paused",
    url: "https://techguywithabeard.com/",
    status: "paused",
    tier: 3,
    category: "website",
    categoryLabel: "Websites",
  },
];

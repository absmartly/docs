import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";
import { themes } from "prism-react-renderer";
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const config: Config = {
  title: "The ABsmartly Docs",
  tagline:
    "Booking.com and Netflix's experimentation culture without the big investment.",
  url: "https://docs.absmartly.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "ABsmartly",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/absmartly/docs",
          docItemComponent: "@theme/ApiItem",
        },
        theme: {
          customCss: "./src/scss/custom.scss",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config: {
          collector: {
            specPath: "api-spec.yaml", // Path to designated spec file
            outputDir: "docs/SDK-API", // Output directory for generated .mdx docs
            sidebarOptions: {
              sidebarCollapsible: false,
              sidebarCollapsed: false,
            },
            hideSendButton: true,
          } satisfies OpenApiPlugin.Options,
          nodeapi: {
            specPath: "nodeapi-spec.yaml",
            outputDir: "docs/Web-Console-API", // Output directory for generated .mdx docs
            sidebarOptions: {
              sidebarCollapsible: false,
              sidebarCollapsed: false,
            },
            hideSendButton: true,
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],

  themeConfig: {
    algolia: {
      appId: "A47TZVJSFX",
      apiKey: "3b31040c2db84765897ab2b3d77208b2",
      indexName: "docs_absmartly",
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
    },
    navbar: {
      title: "ABsmartly Docs",
      logo: {
        alt: "The A B Smartly logo",
        src: "img/logo.svg",
        style: {
          width: "3rem",
        },
      },
      items: [
        {
          to: "docs/web-console-docs/tutorial",
          position: "left",
          label: "Web Console Tutorial",
        },
        {
          to: "docs/sdk-documentation",
          position: "left",
          label: "SDK Docs",
        },
        {
          to: "docs/SDK-API/absmartly-collector-api",
          position: "left",
          label: "SDK API",
        },
        {
          to: "docs/Web-Console-API/absmartly-web-console-api",
          position: "left",
          label: "Web Console API",
        },
        {
          to: "https://absmartly.com/blog",
          position: "left",
          label: "Blog",
        },
        {
          to: "https://github.com/absmartly",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "SDK Docs",
              to: "/docs/sdk-Documentation",
            },
            {
              label: "API Docs",
              to: "/docs/SDK-API/absmartly-collector-api",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Homepage",
              href: "https://absmartly.com",
            },
            {
              label: "Blog",
              href: "https://www.absmartly.com/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/absmartly",
            },
          ],
        },
        {
          title: "Social Media",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/absmartly",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/absmartly",
            },
          ],
        },
      ],
      copyright: `&copy; Copyright ${new Date().getFullYear()} ABsmartly B.V.`,
      logo: {
        src: "img/logo.svg",
        alt: "The A B Smartly Logo",
        style: { width: "3rem" },
      },
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: [
        "dart",
        "php",
        "go",
        "go-module",
        "java",
        "scala",
        "gradle",
        "ruby",
        "python",
        "swift",
        "csharp",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

module.exports = config;

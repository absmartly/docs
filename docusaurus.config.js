// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "The A/B Smartly Docs",
  tagline:
    "Booking.com and Netflix's experimentation culture without the big investment.",
  url: "https://docs.absmartly.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://bitbucket.com/absmartly/docs/src/master",
          docLayoutComponent: "@theme/DocPage",
          docItemComponent: "@theme/ApiItem",
        },
        theme: {
          customCss: require.resolve("./src/scss/custom.scss"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
      }),
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
            outputDir: "docs/SDK API", // Output directory for generated .mdx docs
            sidebarOptions: {
              sidebarCollapsible: false,
              sidebarCollapsed: false,
            },
          },
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
        title: "A/B Smartly Docs",
        logo: {
          alt: "The A B Smartly logo",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "docs/Web Console Docs/tutorial",
            position: "left",
            label: "Web Console Tutorial",
          },
          {
            to: "docs/SDK Documentation",
            position: "left",
            label: "SDK Docs",
          },
          {
            to: "docs/SDK API/a-b-smartly-collector",
            position: "left",
            label: "API Docs",
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
                to: "/docs/SDK Documentation",
              },
              {
                label: "API Docs",
                to: "/docs/SDK%20API/a-b-smartly-collector",
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
        copyright: `&copy; Copyright ${new Date().getFullYear()} A/B Smartly B.V.`,
        logo: { src: "img/logo.svg", alt: "The A B Smartly Logo" },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "scala", "gradle", "ruby", "swift"],
      },
    }),
};

module.exports = config;

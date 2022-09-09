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
      }),
    ],
  ],

  plugins: [
    "docusaurus-plugin-sass",
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config: {
          collector: {
            specPath: "spec.yaml", // Path to designated spec file
            outputDir: "docs/API", // Output directory for generated .mdx docs
            sidebarOptions: {
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
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: true,
        title: "A/B Smartly Docs",
        logo: {
          alt: "The A B Smartly logo",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "docs/sdk-documentation",
            position: "left",
            label: "Docs",
          },
          {
            type: "dropdown",
            label: "API",
            position: "left",
            items: [
              {
                to: "docs/API/a-b-smartly-collector",
                label: "Introduction",
              },
              {
                to: "docs/API/collector-health-check",
                label: "Collector Health Check",
              },
              {
                to: "docs/API/context-create",
                label: "Create a Context",
              },
              {
                to: "docs/API/context-get",
                label: "Get Experiment Data",
              },
              {
                to: "docs/API/context-publish",
                label: "Publish Experiment Events",
              },
              {
                to: "docs/API/experiment-get",
                label: "Get Experiment Info",
              },
            ],
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
                to: "/docs/sdk-documentation",
              },
              {
                label: "API Docs",
                to: "/docs/API/a-b-smartly-collector",
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
                label: "GitHub",
                href: "https://github.com/absmartly",
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

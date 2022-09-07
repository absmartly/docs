// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "A/B Smartly Documentation",
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
            // Note: petstore key is treated as the <id> and can be used to specify an API doc instance when using CLI commands
            specPath: "spec.yaml", // Path to designated spec file
            outputDir: "docs/API", // Output directory for generated .mdx docs
            sidebarOptions: {
              //groupPathsBy: "tag",
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
      navbar: {
        title: "A/B Smartly Docs",
        logo: {
          alt: "The A B Smartly logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "sdk-documentation",
            position: "left",
            label: "Docs",
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
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/getting-started",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/absmartly",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} A/B Smartly.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "scala", "gradle", "ruby", "swift"],
      },
    }),
};

module.exports = config;

import siteConfig from "@generated/docusaurus.config";

// Swizzled from @docusaurus/theme-classic to keep the Prism instance on
// globalThis: prism-liquid looks up Prism.hooks while highlighting, not only
// when it is loaded, so removing the global breaks every page with a code block.
export default function prismIncludeLanguages(PrismObject) {
  const {
    themeConfig: { prism },
  } = siteConfig;
  const { additionalLanguages } = prism;

  globalThis.Prism = PrismObject;
  additionalLanguages.forEach((lang) => {
    if (lang === "php") {
      require("prismjs/components/prism-markup-templating.js");
    }
    require(`prismjs/components/prism-${lang}`);
  });
}

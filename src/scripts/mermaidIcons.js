import { icons } from "@iconify-json/mdi";

if (typeof window !== "undefined") {
  import("mermaid").then(({ default: mermaid }) => {
    mermaid.registerIconPacks([{ name: icons.prefix, icons }]);
  });
}

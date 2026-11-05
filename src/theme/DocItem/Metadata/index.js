// Wraps the doc page <head> metadata to advertise the Markdown version of the
// page (generated at build time by @signalwire/docusaurus-plugin-llms-txt),
// so agents reading the HTML can discover it.
import React from "react";
import Head from "@docusaurus/Head";
import Metadata from "@theme-original/DocItem/Metadata";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

export default function MetadataWrapper(props) {
  const { metadata } = useDoc();
  const mdHref = `${metadata.permalink.replace(/\/+$/, "")}.md`;
  return (
    <>
      <Metadata {...props} />
      <Head>
        <link rel="alternate" type="text/markdown" href={mdHref} />
      </Head>
    </>
  );
}

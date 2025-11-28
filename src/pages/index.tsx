import React, { FC } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import ThemedImage from "@theme/ThemedImage"

import styles from "./index.module.scss";

const HomepageHeader: FC<{}> = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <ThemedImage
            alt="The A B Smartly Logo"
            sources={{
                light: "img/white_logo.png",
                dark: "img/logo.png",
            }}
            className={styles.heroLogo}
            />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="styles"></div>
        <div className={styles.buttons}>
          <Link
            to="docs/get-started"
            className="button button--dark button--lg"
          >
            Knowledge Base
          </Link>
          <Link
            to="/docs/APIs-and-SDKs/SDK-Documentation"
            className="button button--light button--lg"
          >
            SDK Documentation
          </Link>
        </div>
      </div>
    </header>
  );
};

const Home: FC<{}> = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="The complete documentation for ABsmartly's SDK suite'"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
};

export default Home;

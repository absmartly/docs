import React from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<"svg">>;
  webp?: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Unlimited Potential for Growth",
    webp: require("@site/static/img/unlimited.webp").default,
    description: (
      <>
        Run thousands of simultaneous A/B tests across your entire
        infrastructure with reliable results. ABsmartly helps you plan to
        avoid experiment interactions and detects interactions for you when they
        happen.
      </>
    ),
  },
  {
    title: "No Flickering, No Lags",
    webp: require("@site/static/img/noflickering.webp").default,
    description: (
      <>
        Third-party platforms can result in performance issues like flickering
        or lags. It's very difficult to experiment if the process harms some of
        your key conversion drivers — user experience and page load times.
      </>
    ),
  },
  {
    title: "Democratize Experimentation",
    webp: require("@site/static/img/democratize.webp").default,
    description: (
      <>
        Let your designers, engineers or complete product teams be in control of
        A/B testing. Run tests across the entire infrastructure, from apps to
        websites to email to ML models and beyond.
      </>
    ),
  },
];

function Feature({ title, Svg, description, webp }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      {Svg ? (
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
      ) : (
        <div className="text--center">
          <img src={webp} alt="example" />
        </div>
      )}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

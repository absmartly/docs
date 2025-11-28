import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { FC } from "react";


const Home: FC<{}> = () => {
  const { siteConfig } = useDocusaurusContext();
  React.useEffect(() => {
    window.location.href = 'https://deploy-preview-238--absmartly-docs.netlify.app/docs/get-started';
  }, []);
  return null;
};

export default Home;

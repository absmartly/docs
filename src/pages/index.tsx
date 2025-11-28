import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { FC } from "react";


function Home() {
  React.useEffect(() => {
    window.location.href = useBaseUrl('/docs/get-started');
  }, []);
  return null;
}



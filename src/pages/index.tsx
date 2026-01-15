import { Redirect } from "@docusaurus/router";
import React, { FC } from "react";

const Home: FC<{}> = () => {
  return <Redirect to="/docs/get-started" />;
};

export default Home;

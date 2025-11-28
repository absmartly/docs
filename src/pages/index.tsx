import React, { FC } from "react";


const Home: FC<{}> = () => {
  React.useEffect(() => {
    window.location.href = '/docs/get-started';
  }, []);
  return null;
};

export default Home;

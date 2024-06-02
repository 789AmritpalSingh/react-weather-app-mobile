import { CssBaseline, GlobalStyles } from "@mui/material";
import React from 'react';
import Weather from "./components/weatherComponent";

const App = () => {
  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          },
          html: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
          },
          "#root": {
            width: "100%",
            height: "100%",
          },
        }}
      />
      <Weather />
    </>
  );
};

export default App;

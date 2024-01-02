import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { CoursesProvider } from "./context/CoursesContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <CoursesProvider>
        <App />
      </CoursesProvider>
    </ChakraProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { UserCoursesProvider } from "./context/userCoursesContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <UserCoursesProvider>
        <App />
      </UserCoursesProvider>
    </ChakraProvider>
  </React.StrictMode>
);

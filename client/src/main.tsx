import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "rebyb-redux";
import { initialState } from "./Store.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider initialState={initialState}>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Importar
import "./index.css";
import AppWithAuth from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  </StrictMode>,
);

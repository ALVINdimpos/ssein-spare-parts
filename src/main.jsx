import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MaterialTailwindControllerProvider } from "./dashboard/context";
import "../public/css/tailwind.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MaterialTailwindControllerProvider>
      <App />
    </MaterialTailwindControllerProvider>
  </React.StrictMode>,
);

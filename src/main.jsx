import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // 👈 THIS IS REQUIRED

ReactDOM.createRoot(document.getElementById("root")).render(
<HashRouter>
  <App />
</HashRouter>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker Registration with Auto-Update Check
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Build maarum bothu pudhiya sw.js-ah force update check pannum
        reg.update();
        console.log("Service Worker Registered Successfully:", reg.scope);
      })
      .catch((err) => console.error("Service Worker Registration Failed:", err));
  });
}
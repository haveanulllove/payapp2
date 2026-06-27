import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (window.location.protocol === "file:" || window.PayAppCreditReport || isMobileDevice) {
  document.documentElement.classList.add("android-webview");

  // 让 CSS viewport 宽度等于原生 dp 宽度，保证 cqw 单位与原生布局一致
  if (window.PayAppCreditReport && typeof window.PayAppCreditReport.getScreenDpWidth === "function") {
    try {
      const dpWidth = window.PayAppCreditReport.getScreenDpWidth();
      if (dpWidth > 0) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute("content", `width=${dpWidth}, initial-scale=1.0, viewport-fit=cover`);
        }
      }
    } catch (e) {
      console.error("Failed to set viewport dp width", e);
    }
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) document.body.classList.add("scrolled");
  else document.body.classList.remove("scrolled");
});

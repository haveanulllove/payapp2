import React from "react";
import { assetPath } from "../assetPath";

export default function CapturedTabPage({ image, label, topColor = "#fff" }) {
  return (
    <section className="tab-page captured-tab-page" aria-label={label} style={{ "--captured-top-color": topColor }}>
      <img className="captured-tab-image" src={assetPath(`assets/tab-captures/${image}`)} alt="" />
    </section>
  );
}

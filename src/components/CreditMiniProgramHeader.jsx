import React from "react";
import { Ellipsis } from "lucide-react";
import { assetPath } from "../assetPath";

export default function CreditMiniProgramHeader({ title = "信用报告", onClose }) {
  return (
    <header className="credit-mini-header">
      <h1>{title}</h1>

      <div className="credit-mini-actions">
        <button type="button" className="credit-mini-action-button" aria-label="更多">
          <Ellipsis size={22} strokeWidth={3} />
        </button>
        <span className="credit-mini-action-divider" aria-hidden="true" />
        <button type="button" className="credit-mini-action-button" aria-label="关闭小程序" onClick={onClose}>
          <img src={assetPath("assets/credit-report/close-original.png")} alt="" className="credit-mini-close-icon" />
        </button>
      </div>
    </header>
  );
}

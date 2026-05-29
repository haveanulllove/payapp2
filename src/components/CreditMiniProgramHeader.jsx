import React from "react";
import { ChevronLeft, Ellipsis, X } from "lucide-react";

export default function CreditMiniProgramHeader({ onBack, onClose }) {
  return (
    <header className="credit-mini-header">
      <button type="button" className="credit-mini-back-button" aria-label="返回" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2.6} />
      </button>

      <h1>信用报告</h1>

      <div className="credit-mini-actions">
        <button type="button" className="credit-mini-action-button" aria-label="更多">
          <Ellipsis size={22} strokeWidth={3} />
        </button>
        <span className="credit-mini-action-divider" aria-hidden="true" />
        <button type="button" className="credit-mini-action-button" aria-label="关闭小程序" onClick={onClose}>
          <span className="credit-mini-close-circle">
            <X size={12} strokeWidth={3.2} />
          </span>
        </button>
      </div>
    </header>
  );
}

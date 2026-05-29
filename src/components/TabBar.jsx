import React from "react";
import { assetPath } from "../assetPath";

const tabs = [
  { id: "home", label: "首页", icon: assetPath("tabs/home_unselected.png"), activeIcon: assetPath("tabs/home_selected.png") },
  { id: "promo", label: "优惠", icon: assetPath("tabs/promo_unselected.png"), activeIcon: assetPath("tabs/promo_selected.png") },
  { id: "card", label: "卡包", icon: assetPath("tabs/card_unselected.png"), activeIcon: assetPath("tabs/card_selected.png") },
  { id: "fortune", label: "财富", icon: assetPath("tabs/finance_unselected.png"), activeIcon: assetPath("tabs/finance_selected.png") },
  { id: "mine", label: "我的", icon: assetPath("tabs/mine_unselected.png"), activeIcon: assetPath("tabs/mine_selected.png") },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tab-bar">
      {tabs.map((t) => {
        const isActive = active === t.id;

        return (
          <button
            key={t.id}
            type="button"
            className={`tab-item${isActive ? " active" : ""}`}
            onClick={() => onChange(t.id)}
          >
            <img src={isActive ? t.activeIcon : t.icon} alt="" className="tab-icon" />
            <span className="tab-label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

import React from "react";

const tabs = [
  { id: "home", label: "首页", icon: "/tabs/home_unselected.png", activeIcon: "/tabs/home_selected.png" },
  { id: "promo", label: "优惠", icon: "/tabs/promo_unselected.png", activeIcon: "/tabs/promo_selected.png" },
  { id: "card", label: "卡包", icon: "/tabs/card_unselected.png", activeIcon: "/tabs/card_selected.png" },
  { id: "fortune", label: "财富", icon: "/tabs/finance_unselected.png", activeIcon: "/tabs/finance_selected.png" },
  { id: "mine", label: "我的", icon: "/tabs/mine_unselected.png", activeIcon: "/tabs/mine_selected.png" },
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

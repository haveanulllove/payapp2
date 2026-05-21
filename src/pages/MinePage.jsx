import React from "react";
import { ChevronRight, Settings, Bell, CreditCard, FileText, HelpCircle, LogOut } from "lucide-react";

const menuGroups = [
  {
    items: [
      { icon: <CreditCard size={20} />, label: "我的银行卡", badge: "3张" },
      { icon: <FileText size={20} />, label: "我的订单" },
    ],
  },
  {
    items: [
      { icon: <Bell size={20} />, label: "消息中心", badge: "2" },
      { icon: <Settings size={20} />, label: "设置" },
      { icon: <HelpCircle size={20} />, label: "帮助与客服" },
    ],
  },
];

export default function MinePage() {
  return (
    <section className="tab-page mine-page">
      <header className="mine-header">
        <div className="mine-user-row">
          <div className="mine-avatar">
            <span>张</span>
          </div>
          <div className="mine-user-info">
            <strong>张*巍</strong>
            <p>187****0537</p>
          </div>
          <ChevronRight size={22} color="#999" />
        </div>
      </header>

      <section className="mine-stats">
        <div className="mine-stat-item">
          <strong>3</strong>
          <span>银行卡</span>
        </div>
        <div className="mine-stat-item">
          <strong>5</strong>
          <span>优惠券</span>
        </div>
        <div className="mine-stat-item">
          <strong>128</strong>
          <span>积分</span>
        </div>
      </section>

      {menuGroups.map((g, gi) => (
        <section key={gi} className="mine-menu-group">
          {g.items.map((item, ii) => (
            <button key={ii} type="button" className="mine-menu-item">
              <span className="mine-menu-icon">{item.icon}</span>
              <span className="mine-menu-label">{item.label}</span>
              <span className="mine-menu-right">
                {item.badge && <span className="mine-badge">{item.badge}</span>}
                <ChevronRight size={18} color="#ccc" />
              </span>
            </button>
          ))}
        </section>
      ))}

      <section className="mine-footer">
        <button type="button" className="mine-logout">
          <LogOut size={18} />
          <span>退出登录</span>
        </button>
      </section>
    </section>
  );
}

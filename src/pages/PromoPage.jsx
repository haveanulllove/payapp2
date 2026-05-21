import React from "react";
import { ChevronRight, Ticket, Gift, Store } from "lucide-react";

const categories = [
  { icon: <Ticket size={24} />, label: "优惠券", color: "#ff6b6b" },
  { icon: <Gift size={24} />, label: "红包", color: "#ffa94d" },
  { icon: <Store size={24} />, label: "商户优惠", color: "#51cf66" },
];

const promos = [
  { title: "满100减20 餐饮优惠券", shop: "星巴克", expiry: "2026.05.15", tag: "餐饮" },
  { title: "新用户专享5元红包", shop: "云闪付", expiry: "2026.05.30", tag: "红包" },
  { title: "加油满200减15", shop: "中国石化", expiry: "2026.06.01", tag: "出行" },
  { title: "超市满50减8", shop: "大润发", expiry: "2026.05.20", tag: "购物" },
];

export default function PromoPage() {
  return (
    <section className="tab-page promo-page">
      <header className="promo-header">
        <h1>优惠</h1>
      </header>

      <section className="promo-categories">
        {categories.map((c) => (
          <button key={c.label} type="button" className="promo-cat-btn">
            <span className="promo-cat-icon" style={{ background: c.color }}>{c.icon}</span>
            <span className="promo-cat-label">{c.label}</span>
          </button>
        ))}
      </section>

      <section className="promo-section">
        <div className="promo-section-header">
          <h2>热门优惠</h2>
          <button type="button" className="promo-more">
            更多 <ChevronRight size={16} />
          </button>
        </div>

        {promos.map((p, i) => (
          <article key={i} className="promo-card">
            <div className="promo-card-left">
              <span className="promo-tag">{p.tag}</span>
            </div>
            <div className="promo-card-body">
              <strong>{p.title}</strong>
              <p>{p.shop}</p>
              <p className="promo-expiry">有效期至 {p.expiry}</p>
            </div>
            <button type="button" className="promo-claim-btn">领取</button>
          </article>
        ))}
      </section>
    </section>
  );
}

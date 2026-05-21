import React from "react";
import { ChevronRight, TrendingUp, Shield, PiggyBank, Eye, EyeOff } from "lucide-react";

const products = [
  { name: "活期宝+", rate: "2.15%", type: "活期", tag: "灵活存取", icon: <PiggyBank size={22} /> },
  { name: "稳健理财90天", rate: "3.85%", type: "定期", tag: "稳健收益", icon: <Shield size={22} /> },
  { name: "成长基金A", rate: "+12.6%", type: "基金", tag: "高风险", icon: <TrendingUp size={22} /> },
];

export default function FortunePage() {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <section className="tab-page fortune-page">
      <header className="fortune-header">
        <div className="fortune-header-bg">
          <h1>财富</h1>
          <div className="fortune-total">
            <span>总资产(元)</span>
            <button type="button" className="eye-toggle eye-toggle-light" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <strong className="fortune-amount">{showBalance ? "52,360.80" : "****"}</strong>
          <div className="fortune-stats">
            <div>
              <span>昨日收益</span>
              <strong>{showBalance ? "+3.26" : "****"}</strong>
            </div>
            <div>
              <span>累计收益</span>
              <strong>{showBalance ? "+1,286.50" : "****"}</strong>
            </div>
          </div>
        </div>
      </header>

      <section className="fortune-products">
        <div className="fortune-section-header">
          <h2>理财精选</h2>
          <button type="button" className="fortune-more">
            更多 <ChevronRight size={16} />
          </button>
        </div>

        {products.map((p, i) => (
          <article key={i} className="fortune-product-card">
            <div className="fortune-product-icon">{p.icon}</div>
            <div className="fortune-product-info">
              <strong>{p.name}</strong>
              <p>{p.type} | {p.tag}</p>
            </div>
            <div className="fortune-product-rate">
              <strong>{p.rate}</strong>
              <span>七日年化</span>
            </div>
          </article>
        ))}
      </section>

      <section className="fortune-tools">
        <button type="button" className="fortune-tool-item">
          <span>风险评估</span>
          <ChevronRight size={18} />
        </button>
        <button type="button" className="fortune-tool-item">
          <span>交易记录</span>
          <ChevronRight size={18} />
        </button>
      </section>
    </section>
  );
}

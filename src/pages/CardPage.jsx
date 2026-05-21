import React from "react";
import { Plus, ChevronRight, Eye, EyeOff } from "lucide-react";

const cards = [
  { bank: "工商银行", type: "储蓄卡", tail: "8888", balance: "12,560.00", color: "#c0392b" },
  { bank: "招商银行", type: "信用卡", tail: "6666", balance: "15,000.00", color: "#2980b9" },
  { bank: "建设银行", type: "储蓄卡", tail: "1234", balance: "3,280.50", color: "#1a5276" },
];

export default function CardPage() {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <section className="tab-page card-page">
      <header className="card-header">
        <h1>卡包</h1>
        <button type="button" className="card-add-btn">
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </header>

      <section className="card-balance-bar">
        <div className="card-balance-info">
          <span>总资产(元)</span>
          <button type="button" className="eye-toggle" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        <strong className="card-balance-amount">{showBalance ? "30,840.50" : "****"}</strong>
      </section>

      <section className="card-list">
        {cards.map((c, i) => (
          <article key={i} className="bank-card" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}dd)` }}>
            <div className="bank-card-top">
              <strong className="bank-card-name">{c.bank}</strong>
              <span className="bank-card-type">{c.type}</span>
            </div>
            <div className="bank-card-number">
              **** **** **** {c.tail}
            </div>
            <div className="bank-card-bottom">
              <div>
                <span className="bank-card-label">余额</span>
                <span className="bank-card-val">{showBalance ? `¥${c.balance}` : "****"}</span>
              </div>
              <ChevronRight size={22} color="rgba(255,255,255,0.7)" />
            </div>
          </article>
        ))}
      </section>

      <section className="card-actions">
        <button type="button" className="card-action-item">
          <span>添加银行卡</span>
          <ChevronRight size={18} />
        </button>
        <button type="button" className="card-action-item">
          <span>交易记录</span>
          <ChevronRight size={18} />
        </button>
      </section>
    </section>
  );
}

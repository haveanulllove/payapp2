import React from "react";

const topActions = [
  { icon: "/current-app-icons/top/pay.png", label: "收付款" },
  { icon: "/current-app-icons/top/travel.png", label: "出行" },
  { icon: "/current-app-icons/top/scan.png", label: "扫一扫" },
  { icon: "/current-app-icons/top/transfer.png", label: "转账" },
];

const serviceIconBase = "/assets/service-icons-normalized";
const serviceIconVersion = "20260522-3";
const iconPath = (name) => `${serviceIconBase}/${name}.png?v=${serviceIconVersion}`;

const serviceItems = [
  { id: "transfer", icon: iconPath("transfer"), label: "转账" },
  { id: "gov-consume", icon: iconPath("gov-consume"), label: "政府促消费" },
  { id: "colorful-season", icon: iconPath("colorful-season"), label: "五彩消费季" },
  { id: "credit-repay", icon: iconPath("credit-repay"), label: "信用卡还款" },
  { id: "earn", icon: iconPath("earn"), label: "赚钱中心" },
  { id: "bank-card", icon: iconPath("bank-card"), label: "查银行卡" },
  { id: "mobile-recharge", icon: iconPath("mobile-recharge"), label: "手机充值" },
  { id: "loan", icon: iconPath("loan"), label: "借款" },
  { id: "apply-card", icon: iconPath("apply-card"), label: "申请信用卡" },
  { id: "life-payment", icon: iconPath("life-payment"), label: "生活缴费" },
  { id: "public-service", icon: iconPath("public-service"), label: "政务民生" },
  { id: "payment-guard", icon: iconPath("payment-guard"), label: "支付守护" },
  { id: "benefits", icon: iconPath("benefits"), label: "权益精选" },
  { id: "mini-programs", icon: iconPath("mini-programs"), label: "我的小程序" },
  { id: "more", icon: iconPath("more"), label: "更多" },
];

export default function HomePage({ onNavigate }) {
  return (
    <section className="tab-page home-page">
      <header className="home-hero">
        <div className="fake-status">
          <span>00:42</span>
          <span>5G 48</span>
        </div>

        <div className="home-nav">
          <button type="button" className="home-location">
            <span>鞍山</span>
            <img src="/current-app-icons/top-small/city-chevron.png" alt="" className="nav-inline-icon city-chevron" />
          </button>

          <div className="home-search-bar">
            <img src="/current-app-icons/top-small/search.png" alt="" className="nav-inline-icon search-icon" />
            <span>62VIP华住会特权</span>
            <b>搜索</b>
          </div>

          <button type="button" className="hero-round-btn" aria-label="消息">
            <img src="/current-app-icons/top-small/message.png" alt="" className="hero-round-icon" />
          </button>
          <button type="button" className="hero-round-btn" aria-label="添加">
            <img src="/current-app-icons/top-small/plus.png" alt="" className="hero-round-icon" />
          </button>
        </div>

        <div className="home-top-actions">
          {topActions.map((item) => (
            <button key={item.label} type="button" className="top-action">
              <img src={item.icon} alt="" />
              <span className="top-action-label">{item.label}</span>
            </button>
          ))}
        </div>

        <section className="hero-promo-card">
          <div className="hero-panda" aria-hidden="true">
            <span className="panda-head" />
            <span className="panda-body" />
            <span className="panda-bowl" />
          </div>
          <div className="hero-promo-copy">
            <p>抽最高620元立减券</p>
            <strong>新增绑定 一张银行卡</strong>
          </div>
          <button type="button">查看</button>
        </section>
      </header>

      <section className="home-services-panel">
        <div className="service-grid">
          {serviceItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`service-item service-${item.id}`}
              onClick={() => {
                if (item.id === "credit-repay") onNavigate("credit-report");
                if (item.id === "mini-programs") onNavigate("mini-programs");
              }}
            >
              <span className="service-icon-wrap">
                <img src={item.icon} alt="" />
              </span>
              <span className="service-label">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="message-card">
        <div>
          <p>
            <strong>优惠助手：</strong>
            <span>为你推荐</span>
            <em>4月26日</em>
          </p>
          <p>
            <strong>服务助手：</strong>
            <span>银行卡绑定提醒</span>
            <em>4月26日</em>
          </p>
        </div>
        <img src="/current-app-icons/misc/message-dot.png" alt="" className="message-dot-icon" />
        <img src="/current-app-icons/misc/message-arrow.png" alt="" className="message-arrow-icon" />
      </section>

      <section className="travel-ad">
        <div>
          <h2>五一出境 <b>带上银联卡</b></h2>
          <p>汇率补贴至高超1000元</p>
        </div>
        <div className="travel-panda" aria-hidden="true" />
        <button type="button">签到</button>
      </section>

      <section className="home-two-cards">
        <article>
          <h2>专属推荐</h2>
          <div className="mini-recommend">
            <span />
            <div>
              <strong>玩赚中心</strong>
              <p>点我抽奖 ›</p>
            </div>
          </div>
        </article>
        <article>
          <h2>本地精彩</h2>
          <div className="local-feature">
            <img src="/current-app-icons/misc/local-gas.png" alt="" className="local-feature-icon" />
            <div>
              <strong>加油享优惠</strong>
              <p>中石油中石化活动</p>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}

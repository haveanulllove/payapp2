import React, { useEffect, useMemo, useRef, useState } from "react";
import { assetPath } from "../assetPath";
import { formatHomeNoticeTime, loadCreditReportNotices, mergeNotices } from "../serviceNoticeData";

const topActions = [
  { icon: assetPath("current-app-icons/top/pay.png"), label: "收付款" },
  { icon: assetPath("current-app-icons/top/travel.png"), label: "出行" },
  { icon: assetPath("current-app-icons/top/scan.png"), label: "扫一扫" },
  { icon: assetPath("current-app-icons/top/transfer.png"), label: "转账" },
];

const searchPrompts = ["银联优惠日", "政府以旧换新补贴"];
const carouselImages = [
  "unionpay-youth-card.png",
  "shenyang-ticket.png",
  "installment-card.png",
];

const serviceIconBase = assetPath("assets/service-icons-normalized");
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
  const topPromoImage = assetPath("assets/home/top-promo-custom-20260526-215926.png");
  const hongbaoImage = assetPath("assets/home/hongbao-20260526.png");
  const carouselRef = useRef(null);
  const [creditReportNotices, setCreditReportNotices] = useState([]);
  const noticeBriefs = useMemo(() => mergeNotices(10, creditReportNotices).slice(0, 2), [creditReportNotices]);

  useEffect(() => {
    let ignore = false;
    loadCreditReportNotices().then((items) => {
      if (!ignore) setCreditReportNotices(items);
    });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return undefined;
    const timer = window.setInterval(() => {
      const step = carousel.querySelector("img")?.getBoundingClientRect().width || carousel.clientWidth;
      const next = carousel.scrollLeft + step >= carousel.scrollWidth - step / 2 ? 0 : carousel.scrollLeft + step;
      carousel.scrollTo({ left: next, behavior: "smooth" });
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="tab-page home-page">
      <header className="home-hero">
        <img
          src={topPromoImage}
          alt=""
          aria-hidden="true"
          className="home-hero-bg"
        />

        <div className="home-nav">
          <button type="button" className="home-location">
            <span>鞍山</span>
            <img src={assetPath("current-app-icons/top-small/city-chevron.png")} alt="" className="nav-inline-icon city-chevron" />
          </button>

          <button type="button" className="home-search-bar" onClick={() => onNavigate("search")}>
            <img src={assetPath("current-app-icons/top-small/search.png")} alt="" className="nav-inline-icon search-icon" />
            <span className="home-search-rotator" aria-label={searchPrompts.join("、")}>
              <span className="home-search-rotator-track">
                {searchPrompts.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
            </span>
            <b>搜索</b>
          </button>

          <button type="button" className="hero-round-btn" aria-label="消息">
            <img src={assetPath("current-app-icons/top-small/message.png")} alt="" className="hero-round-icon" />
          </button>
          <button type="button" className="hero-round-btn" aria-label="添加">
            <img src={assetPath("current-app-icons/top-small/plus.png")} alt="" className="hero-round-icon" />
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

      <button type="button" className="message-card" onClick={() => onNavigate("service-notices")}>
        <div>
          {noticeBriefs.map((notice) => (
            <p key={notice.id}>
              <strong>{notice.account}：</strong>
              <span>{notice.title}</span>
              <em>{formatHomeNoticeTime(notice.timestamp)}</em>
            </p>
          ))}
        </div>
        <img src={assetPath("current-app-icons/misc/message-dot.png")} alt="" className="message-dot-icon" />
        <img src={assetPath("current-app-icons/misc/message-arrow.png")} alt="" className="message-arrow-icon" />
      </button>

      <section className="home-carousel" aria-label="活动轮播" ref={carouselRef}>
        {carouselImages.map((image) => (
          <img key={image} src={assetPath(`assets/home/carousel/${image}`)} alt="" />
        ))}
      </section>

      <section className="home-two-cards">
        <article>
          <h2>专属推荐</h2>
          <div className="mini-recommend">
            <img src={hongbaoImage} alt="" aria-hidden="true" className="home-bottom-card-icon" />
            <div>
              <strong>玩赚中心</strong>
              <p>点我抽奖 ›</p>
            </div>
          </div>
        </article>
        <article>
          <h2>本地精彩</h2>
          <div className="local-feature">
            <img src={assetPath("current-app-icons/misc/local-gas.png")} alt="" className="local-feature-icon" />
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

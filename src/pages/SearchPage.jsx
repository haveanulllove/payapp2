import React, { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { assetPath } from "../assetPath";

const discoverItems = [
  "会员618特惠",
  "政府以旧换新补贴",
  "玩赚中心",
  "会员中心",
  "充值缴费",
  "余额查询",
  "一键查卡",
  "生活缴费",
  "出行",
  "权益精选",
];

const creditReportSearchChars = ["征", "信", "用", "报", "告"];
const defaultHistoryItems = ["征信", "报告", "信用报告查询", "鞍山消费券", "加油券", "加油", "政务民生"];

function shouldOpenCreditReport(keyword) {
  return creditReportSearchChars.some((char) => keyword.includes(char));
}

export default function SearchPage({ onBack, onOpenCreditReport }) {
  const [keyword, setKeyword] = useState("");
  const [showCreditResult, setShowCreditResult] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [historyItems, setHistoryItems] = useState(defaultHistoryItems);

  const handleSearch = () => {
    if (shouldOpenCreditReport(keyword)) {
      setShowCreditResult(true);
    }
  };

  const handleHistoryClick = (item) => {
    setKeyword(item);
    if (shouldOpenCreditReport(item)) {
      setShowCreditResult(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="app-shell">
      <section className="mobile-page search-page">
        <header className={`search-page-header${showCreditResult ? " is-result" : ""}`}>
          <button type="button" className="search-back-button" aria-label="返回" onClick={onBack}>
            <ChevronLeft strokeWidth={2} />
          </button>

          <label className="search-input-shell">
            <Search size={22} strokeWidth={2.4} />
            <input
              type="text"
              value={keyword}
              autoFocus
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>

          {!showCreditResult && (
            <button type="button" className="search-submit-button" onClick={handleSearch}>
              搜索
            </button>
          )}
        </header>

        {showCreditResult ? (
          <section className="search-result-page">
            <nav className="search-result-tabs" aria-label="搜索结果分类">
              <button type="button" className={activeTab === "all" ? "is-active" : ""} onClick={() => setActiveTab("all")}>
                全部
              </button>
              <button type="button" className={activeTab === "mini" ? "is-active" : ""} onClick={() => setActiveTab("mini")}>
                小程序
              </button>
            </nav>

            <h2>小程序</h2>
            <div className="search-credit-card-shell">
              <img src={assetPath("assets/search-credit-report-card.png")} alt="" className="search-credit-card-image" />
              <button type="button" className="search-credit-card-button" aria-label="信用报告查询" onClick={onOpenCreditReport} />
            </div>
          </section>
        ) : (
          <>
            <section className="search-history-section">
              <div className="search-section-head">
                <h2>历史记录</h2>
                <button type="button" aria-label="清空历史记录" onClick={() => setHistoryItems([])}>
                  <img src={assetPath("assets/search-trash-current.png")} alt="" className="search-trash-icon" />
                </button>
              </div>
              <div className="search-history-list">
                {historyItems.map((item) => (
                  <button type="button" key={item} className="search-history-chip" onClick={() => handleHistoryClick(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="search-discover-panel">
              <h2>
                <Search size={20} strokeWidth={3} />
                <span>搜索发现</span>
              </h2>
              <div className="search-discover-list">
                {discoverItems.map((item) => (
                  <button type="button" key={item}>
                    <span aria-hidden="true">•</span>
                    <strong>{item}</strong>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

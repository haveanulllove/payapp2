import React, { useState } from "react";
import { ChevronLeft, Search, Trash2 } from "lucide-react";

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

function shouldOpenCreditReport(keyword) {
  return creditReportSearchChars.some((char) => keyword.includes(char));
}

export default function SearchPage({ onBack, onOpenCreditReport }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (shouldOpenCreditReport(keyword)) {
      onOpenCreditReport?.();
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
        <header className="search-page-header">
          <button type="button" className="search-back-button" aria-label="返回" onClick={onBack}>
            <ChevronLeft size={17} strokeWidth={2.8} />
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

          <button type="button" className="search-submit-button" onClick={handleSearch}>
            搜索
          </button>
        </header>

        <section className="search-history-section">
          <div className="search-section-head">
            <h2>历史记录</h2>
            <button type="button" aria-label="清空历史记录">
              <Trash2 size={26} strokeWidth={2.2} />
            </button>
          </div>
          <button type="button" className="search-history-chip" onClick={onOpenCreditReport}>
            征信
          </button>
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
      </section>
    </main>
  );
}

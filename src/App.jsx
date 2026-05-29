import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import TabBar from "./components/TabBar";
import CreditMiniProgramHeader from "./components/CreditMiniProgramHeader";
import RemotePdfViewer from "./components/RemotePdfViewer";
import CardPage from "./pages/CardPage";
import CreditReportQueryPage from "./pages/CreditReportQueryPage";
import FortunePage from "./pages/FortunePage";
import HomePage from "./pages/HomePage";
import MinePage from "./pages/MinePage";
import MiniProgramsPage from "./pages/MiniProgramsPage";
import PromoPage from "./pages/PromoPage";
import SearchPage from "./pages/SearchPage";
import { getCreditReportQueryRecord, parseRecordDate } from "./creditReportRecord";

const PDF_URL = "http://120.71.7.165:9724/xybg.pdf";

function formatCurrentDate() {
  return formatDate(new Date());
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function createLocalDate(year, monthIndex, day) {
  return new Date(year, monthIndex, day, 12, 0, 0, 0);
}

function getMonthRuleDate(year, monthIndex) {
  const lastDay = createLocalDate(year, monthIndex + 1, 0);
  const weekDay = lastDay.getDay();

  if (weekDay === 0 || weekDay === 6) {
    return lastDay;
  }

  return createLocalDate(year, lastDay.getMonth(), lastDay.getDate() + (6 - weekDay));
}

function getPreviousRuleDates(count, referenceDate = new Date()) {
  const result = [];
  const today = createLocalDate(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  let year = today.getFullYear();
  let monthIndex = today.getMonth();

  while (result.length < count) {
    const candidate = getMonthRuleDate(year, monthIndex);
    if (candidate < today) {
      result.push(formatDate(candidate));
    }

    monthIndex -= 1;
    if (monthIndex < 0) {
      monthIndex = 11;
      year -= 1;
    }
  }

  return result;
}

function isRecordExpired(queryDate, referenceDate = new Date()) {
  const recordDate = parseRecordDate(queryDate);
  if (!recordDate) {
    return false;
  }

  const today = createLocalDate(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  return today.getTime() - recordDate.getTime() >= 7 * 24 * 60 * 60 * 1000;
}

function App() {
  const [tab, setTab] = useState("home");
  const [page, setPage] = useState("home");
  const [creditReportBackPage, setCreditReportBackPage] = useState("home");
  const historyReadyRef = useRef(false);

  useEffect(() => {
    window.history.replaceState({ appPage: "home" }, "");
    historyReadyRef.current = true;

    const handlePopState = (event) => {
      const nextPage = event.state?.appPage || "home";
      setPage(nextPage);
      if (nextPage === "home") {
        setTab("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openPage = (target) => {
    if (historyReadyRef.current) {
      window.history.pushState({ appPage: target }, "");
    }
    setPage(target);
  };

  const navigate = (target) => {
    if (target === "credit-report") {
      setCreditReportBackPage("home");
      openPage("credit-report");
    }
    if (target === "mini-programs") {
      openPage("mini-programs");
    }
    if (target === "search") {
      openPage("search");
    }
  };

  const openCreditReportFromMiniPrograms = () => {
    setCreditReportBackPage("mini-programs");
    openPage("credit-report");
  };

  const goHome = () => {
    setPage("home");
    setTab("home");
  };

  const goBackFromNestedPage = () => {
    if (window.history.state?.appPage && window.history.state.appPage !== "home") {
      window.history.back();
      return;
    }
    goHome();
  };

  const closeCreditReport = () => {
    if (creditReportBackPage === "mini-programs") {
      setPage("mini-programs");
      return;
    }
    goHome();
  };

  if (page === "credit-report") {
    return (
      <CreditReportQueryPage
        onBack={closeCreditReport}
        onClose={closeCreditReport}
        onHistory={() => setPage("history")}
        onView={() => setPage("viewer")}
      />
    );
  }

  if (page === "history") {
    return (
      <CreditReportHistoryPage
        onBack={() => setPage("credit-report")}
        onClose={closeCreditReport}
        onView={() => setPage("viewer")}
      />
    );
  }

  if (page === "viewer") {
    return <CreditReportViewer onBack={() => setPage("history")} onClose={closeCreditReport} />;
  }

  if (page === "mini-programs") {
    return <MiniProgramsPage onBack={goHome} onOpenCreditReport={openCreditReportFromMiniPrograms} />;
  }

  if (page === "search") {
    return <SearchPage onBack={goBackFromNestedPage} onOpenCreditReport={() => navigate("credit-report")} />;
  }

  return (
    <main className="app-shell">
      <section className="mobile-page with-tab-bar">
        {tab === "home" && <HomePage onNavigate={navigate} />}
        {tab === "promo" && <PromoPage />}
        {tab === "card" && <CardPage />}
        {tab === "fortune" && <FortunePage />}
        {tab === "mine" && <MinePage />}
        <TabBar active={tab} onChange={setTab} />
      </section>
    </main>
  );
}

function CreditReportHistoryPage({ onBack, onClose, onView }) {
  const queryRecord = getCreditReportQueryRecord();
  const activeQueryDate = queryRecord?.queryDate && !isRecordExpired(queryRecord.queryDate) ? queryRecord.queryDate : null;
  const expiredRecordDate = queryRecord?.queryDate && isRecordExpired(queryRecord.queryDate) ? queryRecord.queryDate : null;
  const expiredDates = [...new Set([expiredRecordDate, ...getPreviousRuleDates(4)].filter(Boolean))];

  return (
    <main className="app-shell">
      <section className="mobile-page history-page">
        <CreditMiniProgramHeader onBack={onBack} onClose={onClose} />

        <section className="history-body">
          <div className="history-year-switch">
            <span>2026</span>
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>

          {activeQueryDate && <h2 className="history-group-title">未过期</h2>}

          {activeQueryDate && (
            <article className="history-card current">
              <span className="report-icon" aria-hidden="true">
                <span />
              </span>
              <div className="history-card-main">
                <strong>个人信用报告（张*巍）</strong>
                <p>生成时间：{activeQueryDate}</p>
                <div className="history-card-actions">
                  <button type="button">邮箱保存</button>
                  <button type="button" onClick={onView}>
                    查看报告
                  </button>
                </div>
              </div>
              <em>7日后到期</em>
            </article>
          )}

          <h2 className={`history-group-title${activeQueryDate ? " expired-title" : ""}`}>已过期</h2>

          {expiredDates.map((date) => (
            <article key={date} className="history-card expired">
              <span className="report-icon" aria-hidden="true">
                <span />
              </span>
              <div className="history-card-main">
                <strong>个人信用报告（张*巍）</strong>
                <p>生成时间：{date}</p>
              </div>
              <em>已过期</em>
            </article>
          ))}
        </section>

        <footer className="history-footer-notes">
          <p>
            <span className="note-icon">i</span>
            信用报告将在24小时内（最快4小时内）返回查询结果。为了您的信息安全，信用报告仅保存7日，到期将自动删除，请注意保存。
          </p>
          <p>
            <span className="note-icon">i</span>
            在线查看报告前需验证您的支付密码，若输入密码后报错请您检查是否设置支付密码或者支付密码是否输入正确。
          </p>
        </footer>
      </section>
    </main>
  );
}

function CreditReportViewer({ onBack, onClose }) {
  return (
    <main className="app-shell">
      <section className="mobile-page viewer-page">
        <CreditMiniProgramHeader onBack={onBack} onClose={onClose} />
        <RemotePdfViewer src={PDF_URL} />
      </section>
    </main>
  );
}

export default App;

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
import ServiceNoticePage from "./pages/ServiceNoticePage";
import { getServerCreditReportQueryRecords, parseRecordDate } from "./creditReportRecord";
import { prefetchPdfData } from "./pdfCache";

const PDF_URL = "http://120.71.7.165:9724/xybg.pdf";

function parseRecordTime(record) {
  const parsed = record.readyTime ? new Date(record.readyTime) : null;
  const fallback = parseRecordDate(record.queryDate);
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : fallback;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getRecordViewState(record, referenceDate) {
  const recordTime = parseRecordTime(record);
  if (!recordTime) {
    return { state: "expired", daysLeft: 0 };
  }

  if (referenceDate.getTime() < recordTime.getTime()) {
    return { state: "pending", daysLeft: 7 };
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const elapsedDays = Math.floor((startOfLocalDay(referenceDate).getTime() - startOfLocalDay(recordTime).getTime()) / dayMs);
  if (elapsedDays <= 7) {
    return { state: "valid", daysLeft: Math.max(1, 7 - elapsedDays) };
  }

  return { state: "expired", daysLeft: 0 };
}

function getRecordYear(record) {
  return String(record?.queryDate || record?.applyTime || "").slice(0, 4);
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

  useEffect(() => {
    prefetchPdfData(PDF_URL);
    if (window.PayAppCreditReport && typeof window.PayAppCreditReport.getStatusBarHeight === "function") {
      try {
        const height = window.PayAppCreditReport.getStatusBarHeight();
        if (height > 0) {
          document.documentElement.style.setProperty('--android-statusbar-height', `${height}px`);
        }
      } catch (e) {
        console.error("Failed to get status bar height", e);
      }
    }
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
    if (target === "service-notices") {
      openPage("service-notices");
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
        onHome={goHome}
        onHistory={() => setPage("history")}
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
    return <SearchPage onBack={goHome} onOpenCreditReport={() => navigate("credit-report")} />;
  }

  if (page === "service-notices") {
    return <ServiceNoticePage onBack={goHome} onOpenCreditReport={() => navigate("credit-report")} />;
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
  const [queryRecords, setQueryRecords] = useState([]);
  const [serverTime, setServerTime] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    let ignore = false;

    getServerCreditReportQueryRecords()
      .then((result) => {
        if (!ignore) {
          setQueryRecords(result.records);
          setServerTime(result.serverTime);
          setSelectedYear(new Date(result.serverTime).getFullYear().toString());
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!ignore) {
          setLoadError(error.message || "查询记录接口不可用");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const parsedServerTime = serverTime ? new Date(serverTime) : null;
  const referenceDate = parsedServerTime && !Number.isNaN(parsedServerTime.getTime()) ? parsedServerTime : null;
  const currentYear = referenceDate ? referenceDate.getFullYear().toString() : new Date().getFullYear().toString();
  const yearOptions = Array.from(new Set([currentYear, ...queryRecords.map(getRecordYear).filter(Boolean)])).sort((a, b) => Number(b) - Number(a));
  const activeYear = selectedYear || currentYear;
  const records = referenceDate
    ? queryRecords
    .filter((record) => record?.queryDate)
        .filter((record) => getRecordYear(record) === activeYear)
        .map((record) => ({ ...record, viewState: getRecordViewState(record, referenceDate) }))
        .sort((a, b) => (parseRecordTime(b)?.getTime() || 0) - (parseRecordTime(a)?.getTime() || 0))
    : [];
  const activeRecords = records.filter((record) => record.viewState.state !== "expired");
  const expiredRecords = records.filter((record) => record.viewState.state === "expired").slice(0, 6);

  return (
    <main className="app-shell">
      <section className="mobile-page history-page">
        <CreditMiniProgramHeader onBack={onBack} onClose={onClose} />

        <section className="history-body">
          <label className="history-year-switch">
            <select value={activeYear} onChange={(event) => setSelectedYear(event.target.value)}>
              {yearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown size={24} strokeWidth={2.5} />
          </label>

          {loadError && (
            <article className="history-card history-error">
              <div className="history-card-main">
                <strong>查询记录加载失败</strong>
                <p>{loadError}</p>
              </div>
            </article>
          )}

          {activeRecords.length > 0 && <h2 className="history-group-title">未过期</h2>}

          {activeRecords.map((record) => (
            <article
              key={record.id || record.applyTime || record.queryDate}
              className={`history-card current ${record.viewState.state}`}
            >
              <span className="report-icon" aria-hidden="true">
                <span />
              </span>
              <div className="history-card-main">
                <strong>个人信用报告（张*巍）</strong>
                <p>生成时间：{record.queryDate}</p>
                {record.viewState.state === "valid" && (
                  <div className="history-card-actions">
                    <button type="button">邮箱保存</button>
                    <button type="button" onClick={onView}>
                      查看报告
                    </button>
                  </div>
                )}
              </div>
              <em>{record.viewState.state === "pending" ? "查询中" : `${record.viewState.daysLeft}日后到期`}</em>
            </article>
          ))}

          {expiredRecords.length > 0 && (
            <h2 className={`history-group-title${activeRecords.length > 0 ? " expired-title" : ""}`}>已过期</h2>
          )}

          {expiredRecords.map((record) => (
            <article key={record.id || record.applyTime || record.queryDate} className="history-card expired">
              <span className="report-icon" aria-hidden="true">
                <span />
              </span>
              <div className="history-card-main">
                <strong>个人信用报告（张*巍）</strong>
                <p>生成时间：{record.queryDate}</p>
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

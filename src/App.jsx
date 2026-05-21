import React, { useState } from "react";
import { ChevronDown, ChevronLeft, Ellipsis, Search, X } from "lucide-react";
import TabBar from "./components/TabBar";
import HomePage from "./pages/HomePage";
import PromoPage from "./pages/PromoPage";
import CardPage from "./pages/CardPage";
import FortunePage from "./pages/FortunePage";
import MinePage from "./pages/MinePage";
import MiniProgramsPage from "./pages/MiniProgramsPage";

const expiredDates = ["2026.04.04", "2026.03.01", "2026.02.07"];

function App() {
  const [tab, setTab] = useState("home");
  const [page, setPage] = useState("home");
  const [creditReportBackPage, setCreditReportBackPage] = useState("home");

  const navigate = (target) => {
    if (target === "credit-report") {
      setCreditReportBackPage("home");
      setPage("credit-report");
    }
    if (target === "mini-programs") {
      setPage("mini-programs");
    }
  };

  const openCreditReportFromMiniPrograms = () => {
    setCreditReportBackPage("mini-programs");
    setPage("credit-report");
  };

  const goHome = () => {
    setPage("home");
    setTab("home");
  };

  const goBackFromCreditReport = () => {
    if (creditReportBackPage === "mini-programs") {
      setPage("mini-programs");
      return;
    }

    goHome();
  };

  if (page === "credit-report") {
    return <CreditReportPage onBack={goBackFromCreditReport} onHistory={() => setPage("history")} onView={() => setPage("viewer")} />;
  }

  if (page === "history") {
    return <CreditReportHistoryPage onBack={() => setPage("credit-report")} onView={() => setPage("viewer")} />;
  }

  if (page === "viewer") {
    return <CreditReportViewer onBack={() => setPage("history")} />;
  }

  if (page === "mini-programs") {
    return <MiniProgramsPage onBack={goHome} onOpenCreditReport={openCreditReportFromMiniPrograms} />;
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

function CreditReportPage({ onBack, onHistory, onView }) {
  return (
    <main className="app-shell">
      <section className="mobile-page credit-page">
        <PageHeader title="信用报告" onBack={onBack} />

        <section className="credit-hero">
          <div className="credit-hero-copy">
            <h2>个人信用报告</h2>
            <p>快捷查询&nbsp;&nbsp;安全可靠</p>
          </div>
          <div className="credit-hero-figure" aria-hidden="true">
            <span className="phone-frame">
              <span className="phone-badge">信</span>
            </span>
            <span className="person-head" />
            <span className="person-body" />
            <span className="person-arm-left" />
            <span className="person-arm-right" />
            <span className="person-phone" />
          </div>
        </section>

        <section className="identity-card">
          <div className="identity-card-head">
            <strong>身份信息</strong>
            <span className="support-icon" aria-hidden="true">
              <span className="support-head" />
              <span className="support-mouth" />
            </span>
          </div>

          <div className="identity-user">
            <h3>张*巍</h3>
            <p>2103**********0610</p>
          </div>

          <div className="verify-row">
            <span className="verify-label">验证码</span>
            <span className="verify-placeholder">请输入</span>
            <button type="button" className="verify-send">
              发送验证码
            </button>
          </div>
        </section>

        <p className="phone-tip">验证码将会发送到您的注册手机号187****0537</p>

        <button type="button" className="primary-query-button" onClick={onView}>
          <Search size={24} strokeWidth={3} />
          <span>免费申请查询</span>
        </button>

        <button type="button" className="history-entry" onClick={onHistory}>
          查询记录
        </button>

        <section className="notice-section">
          <div className="notice-header">
            <h3>查询须知</h3>
            <button type="button" className="agreement-link">
              查看协议
            </button>
          </div>
          <ol className="notice-list">
            <li>除了信息提供机构，任何其他机构无权处理您个人信用报告上的不良记录，请警惕以处理不良信用记录为诱饵的诈骗活动。</li>
            <li>个人信用报告涉及您的个人隐私，为确保隐私安全，该报告仅限本人查询，查询成功后请妥善保管您的报告。</li>
            <li>过于频繁查询信用报告可能会影响您的信用卡及贷款申请额度和进度，具体以放款机构规则为准。</li>
            <li>查询成功后您的信用报告仅保留7天，7天后自动删除，请您收到报告生成短信后及时查看报告。</li>
            <li>本功能提供的个人信用报告为简版，与人民银行征信中心官网一致，仅供本人了解自身征信情况，如需详细版征信报告，可通过线下自助渠道打印。</li>
          </ol>
        </section>
      </section>
    </main>
  );
}

function CreditReportHistoryPage({ onBack, onView }) {
  return (
    <main className="app-shell">
      <section className="mobile-page history-page">
        <PageHeader title="查询记录" onBack={onBack} />

        <section className="history-body">
          <div className="history-year-switch">
            <span>2026</span>
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>

          <h2 className="history-group-title">未过期</h2>

          <article className="history-card current">
            <span className="report-icon" aria-hidden="true">
              <span />
            </span>
            <div className="history-card-main">
              <strong>个人信用报告（张*巍）</strong>
              <p>生成时间：2026.05.01</p>
              <div className="history-card-actions">
                <button type="button">邮箱保存</button>
                <button type="button" onClick={onView}>
                  查看报告
                </button>
              </div>
            </div>
            <em>3日后到期</em>
          </article>

          <h2 className="history-group-title expired-title">已过期</h2>

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

function CreditReportViewer({ onBack }) {
  return (
    <main className="app-shell">
      <section className="mobile-page viewer-page">
        <PageHeader title="信用报告" onBack={onBack} rightText="下载" />

        <section className="viewer-sheet">
          <div className="viewer-sheet-head">
            <span className="viewer-stamp">示例</span>
            <h2>个人信用报告</h2>
            <p>报告编号：UP202605012028</p>
            <p>生成时间：2026-05-01 20:28</p>
          </div>

          <div className="viewer-summary">
            <div>
              <strong>0</strong>
              <span>逾期记录</span>
            </div>
            <div>
              <strong>3</strong>
              <span>账户概览</span>
            </div>
            <div>
              <strong>2</strong>
              <span>查询记录</span>
            </div>
          </div>

          <section className="viewer-block">
            <h3>基本信息</h3>
            <p>
              <b>姓名</b>
              <span>张*巍</span>
            </p>
            <p>
              <b>证件号码</b>
              <span>2103**********0610</span>
            </p>
            <p>
              <b>报告状态</b>
              <span>已生成</span>
            </p>
          </section>

          <section className="viewer-block">
            <h3>信贷概要</h3>
            <p>
              <b>信用卡账户</b>
              <span>2个，状态正常</span>
            </p>
            <p>
              <b>贷款账户</b>
              <span>1个，状态正常</span>
            </p>
            <p>
              <b>当前逾期</b>
              <span>无</span>
            </p>
          </section>

          <section className="viewer-block">
            <h3>查询记录</h3>
            <p>
              <b>2026-05-01</b>
              <span>本人查询</span>
            </p>
            <p>
              <b>2026-04-30</b>
              <span>贷后管理</span>
            </p>
          </section>
        </section>
      </section>
    </main>
  );
}

function PageHeader({ title, onBack, rightText }) {
  return (
    <header className="page-header">
      <div className="page-header-left">
        {onBack ? (
          <button type="button" className="back-button" aria-label="返回" onClick={onBack}>
            <ChevronLeft size={34} strokeWidth={2.5} />
          </button>
        ) : (
          <span className="back-placeholder" aria-hidden="true" />
        )}
      </div>

      <h1>{title}</h1>

      <div className="page-header-actions">
        <button type="button" className="action-pill-button" aria-label="更多">
          <Ellipsis size={28} strokeWidth={2.7} />
        </button>
        <span className="action-divider" aria-hidden="true" />
        <button type="button" className="action-pill-button" aria-label={rightText || "关闭"}>
          {rightText ? <span className="download-text">{rightText}</span> : <X size={26} strokeWidth={2.7} />}
        </button>
      </div>
    </header>
  );
}

export default App;

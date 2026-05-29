import React from "react";
import { ChevronLeft, Search } from "lucide-react";
import { assetPath } from "../assetPath";

const creditIcon = assetPath("assets/mini-programs/credit-report-recent.png");

const followPrograms = [
  { name: "信用报告...", icon: creditIcon, type: "image", iconClassName: "credit-report-icon" },
  { name: "招商银行...", icon: assetPath("assets/mini-programs/cmb.png"), type: "image" },
  { name: "出行助手", type: "travel" },
  { name: "银联大连", icon: assetPath("assets/mini-programs/unionpay-dalian.jpg"), type: "image" },
];

export default function MiniProgramsPage({ onBack, onOpenCreditReport }) {
  return (
    <main className="app-shell">
      <section className="mobile-page mini-program-page">
        <header className="mini-page-header">
          <button type="button" aria-label="返回" onClick={onBack}>
            <ChevronLeft size={34} strokeWidth={2.8} />
          </button>
          <h1>我的小程序</h1>
          <button type="button" className="discover-btn">发现</button>
        </header>

        <section className="mini-search">
          <Search size={22} strokeWidth={2.5} />
          <span>搜索小程序</span>
        </section>

        <section className="mini-section recent-section">
          <h2>最近使用</h2>
          <div className="mini-row single">
            <MiniProgramIcon
              name="信用报告..."
              icon={creditIcon}
              type="image"
              iconClassName="credit-report-icon"
              onClick={onOpenCreditReport}
            />
          </div>
        </section>

        <section className="mini-section follow-section">
          <h2>我的关注</h2>
          <div className="mini-row">
            {followPrograms.map((program) => (
              <MiniProgramIcon
                key={program.name}
                {...program}
                onClick={program.name === "信用报告..." ? onOpenCreditReport : undefined}
              />
            ))}
          </div>
        </section>

        <span className="mini-scroll-handle" aria-hidden="true" />
      </section>
    </main>
  );
}

function MiniProgramIcon({ name, icon, type, iconClassName = "", onClick }) {
  return (
    <button type="button" className="mini-program-icon" onClick={onClick}>
      {type === "travel" ? (
        <span className="travel-helper-icon" aria-hidden="true">
          <i />
        </span>
      ) : (
        <img src={icon} alt="" className={iconClassName} />
      )}
      <span>{name}</span>
    </button>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, UserRoundCheck } from "lucide-react";
import { loadCreditReportNotices, mergeNotices } from "../serviceNoticeData";

export default function ServiceNoticePage({ onBack, onOpenCreditReport }) {
  const [dayCount, setDayCount] = useState(10);
  const [creditReportNotices, setCreditReportNotices] = useState([]);
  const notices = useMemo(() => mergeNotices(dayCount, creditReportNotices), [creditReportNotices, dayCount]);

  useEffect(() => {
    let ignore = false;
    loadCreditReportNotices().then((items) => {
      if (!ignore) setCreditReportNotices(items);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 360) {
      setDayCount((current) => Math.min(current + 10, 180));
    }
  };

  return (
    <main className="app-shell">
      <section className="mobile-page service-notice-page">
        <header className="service-notice-header">
          <button type="button" className="service-notice-back" aria-label="返回" onClick={onBack}>
            <ChevronLeft size={16} strokeWidth={2.8} />
          </button>
          <div className="service-notice-search">
            <Search size={26} strokeWidth={2.8} />
            <span>搜索消息号</span>
          </div>
          <button type="button" className="service-notice-user" aria-label="消息管理">
            <UserRoundCheck size={16} strokeWidth={2.6} />
          </button>
        </header>

        <nav className="service-notice-tabs" aria-label="消息分类">
          <button type="button" className="is-active">服务通知</button>
          <button type="button">支付消息</button>
          <button type="button">精彩动态</button>
        </nav>

        <section className="service-notice-list" onScroll={handleScroll}>
          {notices.map((notice) => (
            <article key={notice.id} className="service-notice-item">
              <time>{notice.time}</time>
              {notice.type === "credit-report" ? (
                <section className="service-notice-card credit-report-notice-card" onClick={onOpenCreditReport}>
                  <header className="credit-report-notice-head">
                    <button type="button" aria-label="更多" className="notice-card-more">
                      <MoreHorizontal size={18} strokeWidth={2.4} />
                    </button>
                  </header>

                  <div className="credit-report-notice-body">
                    <h2>{notice.title}</h2>
                    <p>
                      尊敬的用户，您的个人信用报告查询申请已反馈结果，报告有效期为7天，请及时登录云闪付APP信用报告应用进行查看，并可将报告发送至邮箱进行永久保存。
                    </p>
                    <dl>
                      <div>
                        <dt>报告生成时间</dt>
                        <dd>{notice.generatedDate}</dd>
                      </div>
                      <div>
                        <dt>报告到期时间</dt>
                        <dd>{notice.expireDate}</dd>
                      </div>
                    </dl>
                  </div>

                  <footer className="notice-card-foot">
                    <span>查看详情</span>
                    <ChevronRight size={22} strokeWidth={2.6} />
                  </footer>
                </section>
              ) : (
                <section className="service-notice-card">
                  <header className="notice-card-head">
                    <span className={`notice-card-icon notice-card-icon-${notice.icon}`} aria-hidden="true">
                      {notice.icon === "earn" ? "赚" : ""}
                    </span>
                    <strong>{notice.account}</strong>
                    <button type="button" aria-label="更多" className="notice-card-more">
                      <MoreHorizontal size={18} strokeWidth={2.4} />
                    </button>
                  </header>

                  <div className="notice-card-body">
                    <h2>{notice.title}</h2>
                    <div className="notice-card-content">
                      {notice.rows.map(([label, value], index) => (
                        <React.Fragment key={`${label}-${index}`}>
                          {label ? <span className="notice-card-label">{label}</span> : <span aria-hidden="true" />}
                          <p className={label ? undefined : "notice-card-line-full"}>{value}</p>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <footer className="notice-card-foot">
                    <span>查看详情</span>
                    <ChevronRight size={22} strokeWidth={2.6} />
                  </footer>
                </section>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

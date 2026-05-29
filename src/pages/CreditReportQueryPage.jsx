import React, { useEffect, useState } from "react";
import { assetPath } from "../assetPath";
import CreditMiniProgramHeader from "../components/CreditMiniProgramHeader";
import { saveCreditReportQueryDate } from "../creditReportRecord";

const assetVersion = "20260524-6";

const noticeItems = [
  "除了信息提供机构，任何其他机构无权处理您个人信用报告上的不良记录，请警惕以处理不良信用记录为诱饵的诈骗活动。",
  "个人信用报告涉及您的个人隐私，为确保隐私安全，该报告仅限本人查询，查询成功后请妥善保管您的报告。",
  "过于频繁查询信用报告可能会影响您的信用卡及贷款申请额度和进度，具体以放款机构规则为准。",
  "查询成功后您的信用报告仅保留7天，7天后自动删除，请您收到报告生成短信后及时查看报告。",
  "本功能提供的个人信用报告为简版，与人民银行征信中心官网一致，仅供本人了解自身征信情况，如需详细版征信报告，可通过线下自助渠道打印。",
];

export default function CreditReportQueryPage({ onBack, onClose, onHistory, onView }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const isVerificationReady = /^\d{6}$/.test(verificationCode);

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (countdown > 0) {
      return;
    }

    setCountdown(5);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleApplyQuery = () => {
    if (!isVerificationReady) {
      return;
    }

    saveCreditReportQueryDate();
    onView();
  };

  return (
    <main className="app-shell">
      <section className="mobile-page credit-page">
        <CreditMiniProgramHeader onBack={onBack} onClose={onClose} />

        <section className="credit-hero">
          <img src={assetPath("assets/credit-report/hero-bg.png")} alt="" className="credit-hero-image" />
        </section>

        <section className="identity-card">
          <div className="identity-card-head">
            <strong>身份信息</strong>
            <img
              src={assetPath(`assets/credit-report/support-icon.png?v=${assetVersion}`)}
              alt=""
              className="support-icon-image"
              style={{ width: "6.1cqw", minWidth: "6.1cqw", transform: "translateY(0.62cqw)" }}
            />
          </div>

          <div className="identity-user">
            <h3>张*巍</h3>
            <p>2103**********0610</p>
          </div>

          <div className="verify-row">
            <label className="verify-label" htmlFor="verification-code">
              验证码
            </label>
            <input
              id="verification-code"
              className="verify-input"
              inputMode="numeric"
              maxLength={6}
              placeholder="请输入"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
            <button
              type="button"
              className={`verify-send${countdown > 0 ? " is-counting" : ""}`}
              onClick={handleSendCode}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown} s` : "发送验证码"}
            </button>
          </div>
        </section>

        <p className="phone-tip">验证码将会发送到您的注册手机号187****0537</p>

        <button
          type="button"
          className="primary-query-button image-button"
          onClick={handleApplyQuery}
          disabled={!isVerificationReady}
        >
          <img
            src={assetPath(
              `assets/credit-report/${isVerificationReady ? "query-button-ready.png" : "query-button.png"}?v=${assetVersion}`,
            )}
            alt="免费申请查询"
            className="primary-query-image"
            style={{ width: "35.8cqw", transform: "translateY(0.58cqw)" }}
          />
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
            {noticeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  );
}

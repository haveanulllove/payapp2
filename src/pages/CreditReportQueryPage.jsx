import React, { useEffect, useState } from "react";
import { assetPath } from "../assetPath";
import CreditMiniProgramHeader from "../components/CreditMiniProgramHeader";
import {
  createServerCreditReportQueryRecord,
  getServerCreditReportQueryRecords,
  saveCreditReportQueryDate,
} from "../creditReportRecord";

const assetVersion = "20260524-6";

const noticeItems = [
  "除了信息提供机构，任何其他机构无权处理您个人信用报告上的不良记录，请警惕以处理不良信用记录为诱饵的诈骗活动。",
  "个人信用报告涉及您的个人隐私，为确保隐私安全，该报告仅限本人查询，查询成功后请妥善保管您的报告。",
  "过于频繁查询信用报告可能会影响您的信用卡及贷款申请额度和进度，具体以放款机构规则为准。",
  "查询成功后您的信用报告仅保留7天，7天后自动删除，请您收到报告生成短信后及时查看报告。",
  "本功能提供的个人信用报告为简版，与人民银行征信中心官网一致，仅供本人了解自身征信情况，如需详细版征信报告，可通过线下自助渠道打印。",
];

const agreementItems = [
  { type: "title", text: "个人信用报告查询授权及服务协议" },
  {
    text: "用户（以下称“您”）通过中国银联云闪付App（以下或简称“我们”）向中国人民银行征信中心（以下称“征信中心”）申请查询本人信用报告时，按照征信中心要求，您需与中国银联签署《个人信用报告查询授权及服务协议》（以下简称“本协议”）。",
  },
  {
    type: "strong",
    text: "您通过云闪付App信用报告服务页面勾选本协议并点击“同意”，即表示您充分理解、同意并接受本协议的全部内容，本协议既已生效。如您不同意接受本协议的任意内容，或者无法准确理解相关条款含义的，请不要勾选本协议及进行后续操作。",
  },
  { text: "本协议正文条款如下：" },
  {
    text: "1. 您确认您登录云闪付App使用信用报告服务提交信用报告查询申请及查看、下载信用报告等行为，均为您本人的真实意愿，您保证在使用信用报告服务时提供的信息是您本人的信息，并保证该等信息的真实、准确、完整，否则由此引起的后果由您本人自行承担。",
  },
  {
    text: "2. 您授权并同意通过云闪付App提交本人信用报告查询申请后，中国银联可以将您的信用报告查询申请代为提交给中国人民银行征信中心。中国银联在接收到征信中心返回的个人信用报告后，将及时（不承诺实时）通知您，您可以通过云闪付App--信用报告小程序查询或下载您的个人信用报告。",
  },
  {
    text: "3. 您知悉并同意您的个人信用报告结果从征信中心到达中国银联系统之日起，超过7个自然日后将被中国银联系统删除，不再留存，即您仅可在前述有效期内查看报告结果。中国银联承诺不得查看、使用、解析或截留您的个人信用报告信息。",
  },
  {
    text: "4. 您授权并同意在授权申请查询过程中，中国银联可以将您在云闪付App预留的姓名、身份证件号提供给征信中心，用于征信中心检索并向您反馈个人信用报告结果。中国银联可以向您在云闪付App预留的手机号发送动态验证码以完成验证，同时银联还会通过短信向您发送相关通知。中国银联可以收集您的面部识别特征并验证您的人脸信息及身份信息。如您不提供前述个人信息，则无法使用个人信用报告查询服务。",
  },
  {
    text: "如您需要通过电子邮件方式接收您的个人信用报告，中国银联还会收集您的电子邮箱信息，如您不提供前述个人信息，则无法通过电子邮件方式接收您的个人信用报告。",
  },
  {
    text: "为了保障您的个人信用报告仅可由您本人查看，在您查看个人信用报告前，您需要提供您的云闪付App支付密码用以验证您的身份，如您不提供前述个人信息，则无法查看个人信用报告。",
  },
  { text: "个人信用报告的查看路径：云闪付App--信用报告--查询记录--查看报告。" },
  {
    text: "5. 您知悉并同意对您的个人证件信息、短信验证码、个人邮箱、云闪付App登录密码及支付密码等个人身份认证要素负有妥善保管的义务，如因您泄露、遗失或转借他人使用相关密码、证件等要素，或其他由本人自身原因导致其个人信用报告被他人查询、下载、泄露或用作其他用途的，中国银联不承担任何责任。",
  },
  {
    text: "6. 如因通讯网络故障等导致您未能正常提交个人信用报告的查询申请、无法查阅或下载个人信用报告，中国银联不承担任何责任。",
  },
  {
    text: "7. 您的查询申请能否获得征信中心的确认并反馈相应的查询结果，中国银联不提供任何承诺或保证；查询结果的信用报告内容均来自于征信中心，您如有任何疑问，请自行咨询征信中心，全国统一征信客服电话：400-810-8866。",
  },
  {
    text: "8. 中国银联重视对您的信息保护，遵循合法、正当、必要的原则，依照法律法规与《云闪付APP隐私政策》的规定，严格保护您的信息。在未经您同意和确认的情况下，除国家法律法规或者有权机关依法要求提供之外，中国银联不会向其他任何公司、组织和个人披露您的个人信息。",
  },
  {
    text: "9. 如您对本协议存在任何疑问，或任何相关的投诉、意见，请联系中国银联客服热线95516，受理您的问题后，我们会及时、妥善处理。",
  },
  { text: "10. 其他未尽事宜，将适用《银联用户服务协议》《云闪付APP隐私政策》相关约定。" },
];

export default function CreditReportQueryPage({ onBack, onClose, onHome, onHistory }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showAgreementPage, setShowAgreementPage] = useState(false);
  const [showFaceAuthDialog, setShowFaceAuthDialog] = useState(false);
  const [showFaceRecognitionPage, setShowFaceRecognitionPage] = useState(false);
  const [showAuthorizationPage, setShowAuthorizationPage] = useState(false);
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

  useEffect(() => {
    getServerCreditReportQueryRecords().catch((error) => {
      console.error("Failed to preload credit report query records", error);
    });
  }, []);

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
    if (!isVerificationReady || isSubmitting) {
      return;
    }

    setShowAgreementPage(true);
  };

  const handleConfirmAgreement = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const record = await createServerCreditReportQueryRecord();
      saveCreditReportQueryDate(record.queryDate);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to record credit report query time", error);
      window.alert?.("查询记录保存失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFaceAuthConfirm = () => {
    setShowFaceAuthDialog(false);
    setShowAuthorizationPage(true);
  };

  const handleAuthorizationConfirm = () => {
    setShowAuthorizationPage(false);
    setShowFaceRecognitionPage(true);
  };

  const handleFaceRecognitionNext = () => {
    setShowFaceRecognitionPage(false);
    handleConfirmAgreement();
  };

  if (showAgreementPage) {
    if (showFaceRecognitionPage) {
      return (
        <main className="app-shell">
          <section className="mobile-page face-recognition-page">
            <img
              src={assetPath("assets/credit-report/face-recognition-page-20260624.jpg")}
              alt=""
              className="face-recognition-image"
            />
            <button
              type="button"
              className="face-recognition-hit face-recognition-close"
              aria-label="关闭人脸识别"
              onClick={() => {
                setShowFaceRecognitionPage(false);
                setShowAuthorizationPage(true);
              }}
            />
            <button
              type="button"
              className="face-recognition-hit face-recognition-next"
              aria-label="下一步"
              onClick={handleFaceRecognitionNext}
              disabled={isSubmitting}
            />
          </section>
        </main>
      );
    }

    if (showAuthorizationPage) {
      return (
        <main className="app-shell">
          <section className="mobile-page authorization-page">
            <CreditMiniProgramHeader
              title="授权提示"
              onBack={() => setShowAuthorizationPage(false)}
              onClose={onClose}
            />

            <section className="authorization-hero" aria-hidden="true">
              <div className="authorization-circle authorization-app">
                <span>云闪付</span>
                <small>UnionPay</small>
              </div>
              <span className="authorization-arrows">⇄</span>
              <div className="authorization-circle authorization-id">
                <span />
              </div>
            </section>

            <section className="authorization-copy">
              <p>
                您同意使用云闪付<strong>人像认证</strong>并授权
                <strong> 信用报告查询 </strong>获取您在<strong>人像验证</strong>中以下信息为您提供相关服务
              </p>
            </section>

            <section className="authorization-permission">照片、视频</section>

            <div className="authorization-actions">
              <button type="button" className="authorization-deny" onClick={() => setShowAuthorizationPage(false)}>
                暂不授权
              </button>
              <button type="button" className="authorization-confirm" onClick={handleAuthorizationConfirm} disabled={isSubmitting}>
                确认授权
              </button>
            </div>

            {showSuccessDialog && (
              <div className="credit-success-mask" role="dialog" aria-modal="true" aria-label="已提交查询申请">
                <section className="credit-success-card">
                  <div className="credit-success-check" aria-hidden="true">
                    <span />
                  </div>
                  <h2>已为您提交查询申请</h2>
                  <p>
                    您的个人信用报告查询申请将在24小时内反馈
                    <br />
                    查询结果，请留意短信通知
                  </p>
                  <div className="credit-success-actions">
                    <button type="button" className="credit-success-home" onClick={onHome}>
                      回到首页
                    </button>
                    <button type="button" className="credit-success-records" onClick={onHistory}>
                      查看记录
                    </button>
                  </div>
                </section>
              </div>
            )}
          </section>
        </main>
      );
    }

    return (
      <main className="app-shell">
        <section className="mobile-page credit-agreement-page">
          <CreditMiniProgramHeader
            title="查看协议"
            onBack={() => setShowAgreementPage(false)}
            onClose={onClose}
          />

          <section className="credit-agreement-body">
            <article className="credit-agreement-card">
              {agreementItems.map((item) => (
                <p key={item.text} className={item.type ? `agreement-${item.type}` : undefined}>
                  {item.text}
                </p>
              ))}
            </article>
          </section>

          <footer className="credit-agreement-footer">
            <strong>您需向下滑动页面并完整阅读本协议，方可进入下一步</strong>
            <div className="credit-agreement-actions">
              <button type="button" className="credit-agreement-reject" onClick={() => setShowAgreementPage(false)}>
                拒绝
              </button>
              <button
                type="button"
                className="credit-agreement-next"
                onClick={() => setShowFaceAuthDialog(true)}
                disabled={isSubmitting}
              >
                同意，下一步
              </button>
            </div>
          </footer>

          {showFaceAuthDialog && (
            <div className="face-auth-mask" role="dialog" aria-modal="true" aria-label="请完成人脸认证">
              <div className="face-auth-dialog">
                <img
                  src={assetPath("assets/credit-report/face-auth-dialog-20260624.png")}
                  alt=""
                  className="face-auth-dialog-image"
                />
                <button
                  type="button"
                  className="face-auth-hit face-auth-cancel"
                  aria-label="取消"
                  onClick={() => setShowFaceAuthDialog(false)}
                />
                <button
                  type="button"
                  className="face-auth-hit face-auth-confirm"
                  aria-label="人脸识别"
                  onClick={handleFaceAuthConfirm}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {showSuccessDialog && (
            <div className="credit-success-mask" role="dialog" aria-modal="true" aria-label="已提交查询申请">
              <section className="credit-success-card">
                <div className="credit-success-check" aria-hidden="true">
                  <span />
                </div>
                <h2>已为您提交查询申请</h2>
                <p>
                  您的个人信用报告查询申请将在24小时内反馈
                  <br />
                  查询结果，请留意短信通知
                </p>
                <div className="credit-success-actions">
                  <button type="button" className="credit-success-home" onClick={onHome}>
                    回到首页
                  </button>
                  <button type="button" className="credit-success-records" onClick={onHistory}>
                    查看记录
                  </button>
                </div>
              </section>
            </div>
          )}
        </section>
      </main>
    );
  }

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
          disabled={!isVerificationReady || isSubmitting}
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
            <button type="button" className="agreement-link" onClick={() => setShowAgreementPage(true)}>
              查看协议
            </button>
          </div>
          <ol className="notice-list">
            {noticeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        {showSuccessDialog && (
          <div className="credit-success-mask" role="dialog" aria-modal="true" aria-label="已提交查询申请">
            <section className="credit-success-card">
              <div className="credit-success-check" aria-hidden="true">
                <span />
              </div>
              <h2>已为您提交查询申请</h2>
              <p>
                您的个人信用报告查询申请将在24小时内反馈
                <br />
                查询结果，请留意短信通知
              </p>
              <div className="credit-success-actions">
                <button type="button" className="credit-success-home" onClick={onHome}>
                  回到首页
                </button>
                <button type="button" className="credit-success-records" onClick={onHistory}>
                  查看记录
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

import { getServerCreditReportQueryRecords } from "./creditReportRecord";

export const noticeTemplates = [
  {
    account: "玩赚中心",
    icon: "earn",
    title: "活动邀请",
    rows: [
      ["活动标题", "您有1张620元立减券待抽取!"],
      ["活动内容", "连签2天可以最高抽620元立减券，试试手气>>"],
    ],
  },
  {
    account: "信用卡申请",
    icon: "card",
    title: "优惠通知",
    rows: [
      ["", "申卡享150元立减大礼包，更可领全年最高返现1200元!"],
    ],
  },
  {
    account: "玩赚中心",
    icon: "earn",
    title: "活动邀请",
    rows: [
      ["活动标题", "连签2天最高抽620元!"],
      ["活动内容", "每天点一下！连签3、7天额外得双倍"],
    ],
  },
];

export function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatNoticeDateTime(target, today = new Date()) {
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((startOfLocalDay(today).getTime() - startOfLocalDay(target).getTime()) / dayMs);
  const time = `${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}`;

  if (diffDays === 0) return `今天 ${time}`;
  if (diffDays === 1) return `昨天 ${time}`;
  return `${target.getFullYear()}年${String(target.getMonth() + 1).padStart(2, "0")}月${String(target.getDate()).padStart(2, "0")}日 ${time}`;
}

export function formatHomeNoticeTime(timestamp, today = new Date()) {
  const target = new Date(timestamp);
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((startOfLocalDay(today).getTime() - startOfLocalDay(target).getTime()) / dayMs);

  if (diffDays === 0) {
    return `${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}`;
  }
  return `${target.getMonth() + 1}月${target.getDate()}日`;
}

export function formatDateOnly(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatNoticeTime(date, hour, today) {
  return formatNoticeDateTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0), today);
}

export function buildNoticeItems(dayCount) {
  const today = new Date();
  const items = [];

  for (let dayOffset = 0; dayOffset < dayCount; dayOffset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOffset);
    [16, 8].forEach((hour, timeIndex) => {
      const template = noticeTemplates[(dayOffset + timeIndex) % noticeTemplates.length];
      items.push({
        id: `${date.toISOString()}-${hour}`,
        timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0).getTime(),
        time: formatNoticeTime(date, hour, today),
        ...template,
      });
    });
  }

  return items;
}

export function buildCreditReportNotice(record, now = new Date()) {
  const readyTime = record?.readyTime ? new Date(record.readyTime) : null;
  if (!readyTime || Number.isNaN(readyTime.getTime())) return null;
  if (readyTime.getTime() > now.getTime()) return null;

  return {
    id: `credit-report-${record.id || record.readyTime}`,
    type: "credit-report",
    account: "信用报告",
    timestamp: readyTime.getTime(),
    time: formatNoticeDateTime(readyTime),
    title: "信用报告生成提醒",
    generatedDate: formatDateOnly(readyTime),
    expireDate: formatDateOnly(new Date(readyTime.getFullYear(), readyTime.getMonth(), readyTime.getDate() + 7)),
  };
}

export async function loadCreditReportNotices() {
  const now = new Date();
  try {
    const { records } = await getServerCreditReportQueryRecords();
    return records.map((record) => buildCreditReportNotice(record, now)).filter(Boolean);
  } catch {
    return [];
  }
}

export function mergeNotices(dayCount, creditReportNotices) {
  return [...buildNoticeItems(dayCount), ...creditReportNotices].sort((a, b) => b.timestamp - a.timestamp);
}

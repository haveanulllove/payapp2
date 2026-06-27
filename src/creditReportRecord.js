const STORAGE_KEY = "payapp2.creditReportQueryRecord";
const SERVER_RECORD_URL = "http://120.71.7.165:9724/api/credit-report-record?user_key=demo";
const SERVER_RECORDS_URL = "http://120.71.7.165:9724/api/credit-report-records";
const DEFAULT_REPORT_URL = "http://120.71.7.165:9724/xybg.pdf";

export function formatRecordDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function parseRecordDate(dateText) {
  const match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(dateText || "");
  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
}

export function saveCreditReportQueryDate(queryDate = formatRecordDate()) {
  const record = { queryDate };

  try {
    window.PayAppCreditReport?.saveQueryDate(queryDate);
  } catch {
    // Browser preview and older APKs fall back to localStorage below.
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage may be unavailable in restricted preview contexts.
  }

  return record;
}

export function getCreditReportQueryRecord() {
  try {
    const nativeRecord = window.PayAppCreditReport?.getQueryRecord();
    if (nativeRecord) {
      return JSON.parse(nativeRecord);
    }
  } catch {
    // Fall through to browser/local fallback.
  }

  try {
    const storedRecord = window.localStorage.getItem(STORAGE_KEY);
    return storedRecord ? JSON.parse(storedRecord) : null;
  } catch {
    return null;
  }
}

export async function getServerCreditReportQueryRecord() {
  const response = await fetch(SERVER_RECORD_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`credit report record request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok) {
    throw new Error(data?.error || "credit report record request failed");
  }

  return data.record || null;
}

export async function getServerCreditReportQueryRecords() {
  const response = await fetch(`${SERVER_RECORDS_URL}?user_key=demo&limit=50`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`credit report records request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok || !Array.isArray(data.records) || typeof data.serverTime !== "string") {
    throw new Error(data?.error || "credit report records request failed");
  }

  return { serverTime: data.serverTime, records: data.records };
}

export async function createServerCreditReportQueryRecord() {
  const response = await fetch(SERVER_RECORDS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userKey: "demo", reportUrl: DEFAULT_REPORT_URL }),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`credit report record create failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok || !data.record || typeof data.record.applyTime !== "string") {
    throw new Error(data?.error || "credit report record create failed");
  }

  return data.record;
}

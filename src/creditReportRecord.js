const STORAGE_KEY = "payapp2.creditReportQueryRecord";

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

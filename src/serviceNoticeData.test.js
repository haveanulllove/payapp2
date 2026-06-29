import assert from "node:assert/strict";
import { buildCreditReportNotice, buildNoticeItems, mergeNotices } from "./serviceNoticeData.js";

const beforeFour = buildNoticeItems(1, new Date("2026-06-28T15:30:00+08:00"));
assert.equal(beforeFour.some((item) => item.time === "今天 16:00"), false);
assert.equal(beforeFour.some((item) => item.time === "今天 08:00"), true);

const afterFour = buildNoticeItems(1, new Date("2026-06-28T16:01:00+08:00"));
assert.equal(afterFour.some((item) => item.time === "今天 16:00"), true);

const creditNotice = buildCreditReportNotice(
  { id: 1, readyTime: "2026-06-27T09:30:00+08:00" },
  new Date("2026-06-28T16:01:00+08:00"),
);
assert.equal(creditNotice.time, "昨天 09:30");
assert.equal(creditNotice.generatedDate, "2026-06-27");
assert.equal(creditNotice.expireDate, "2026-07-04");

const futureCreditNotice = buildCreditReportNotice(
  { id: 2, readyTime: "2026-06-28T17:00:00+08:00" },
  new Date("2026-06-28T16:01:00+08:00"),
);
assert.equal(futureCreditNotice, null);

const merged = mergeNotices(1, [creditNotice]);
assert.equal(merged.some((item) => item.type === "credit-report"), true);

# PayApp2 服务器信息

## 服务器

- 用途：信用报告查询记录日期、过期状态、报告地址的服务端数据库验证。
- 公网 IP：`120.71.7.165`
- SSH 端口：`22`
- SSH 用户：`root`
- SSH 密码：见本地私密副本 `docs/server_info.local.md`
- SSH 验证状态：`2026-05-31` 已验证可登录。
- 远端主机名：`o6iie7pccp1v5bzb.novalocal`
- 系统版本：`Ubuntu 24.04.2 LTS`

## MySQL

- MySQL 版本：`8.0.45`
- 监听地址：`0.0.0.0:3306`
- 公网连接地址：`120.71.7.165:3306`
- 数据库：`payapp2`
- 数据库用户：`payapp2`
- 数据库密码：见本地私密副本 `docs/server_info.local.md`

连接示例：

```bash
mysql -h 120.71.7.165 -P 3306 -u payapp2 -p payapp2
```

## 信用报告记录表

表名：`credit_report_record`

字段：

- `id`
- `user_key`
- `apply_time`
- `ready_time`
- `expire_time`
- `query_date`
- `expire_date`
- `status`
- `report_url`
- `created_at`
- `updated_at`

当前示例数据：

```text
user_key: demo
apply_time: 2026-05-30 00:00:00
ready_time: 2026-05-30 00:10:00
expire_time: 2026-06-06 00:10:00
query_date: 2026-05-30
expire_date: 2026-06-06
status: valid
report_url: http://120.71.7.165:9724/xybg.pdf
```

当前建表 SQL：

```sql
CREATE TABLE IF NOT EXISTS credit_report_record (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_key VARCHAR(64) NOT NULL,
  apply_time DATETIME NOT NULL,
  ready_time DATETIME NOT NULL,
  expire_time DATETIME NOT NULL,
  query_date DATE NOT NULL,
  expire_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'valid',
  report_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_status_expire (status, expire_date),
  KEY idx_user_apply (user_key, apply_time DESC, id DESC),
  KEY idx_effective_time (ready_time, expire_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## HTTP 查询记录接口

- 服务名：`payapp2-api.service`
- 服务文件：`/etc/systemd/system/payapp2-api.service`
- 程序路径：`/opt/payapp2_api/server.py`
- 本机监听：`127.0.0.1:9725`
- Nginx 外部路由：
  - `GET http://120.71.7.165:9724/api/credit-report-record?user_key=demo`
  - `GET http://120.71.7.165:9724/api/credit-report-records?user_key=demo&limit=50`
  - `POST http://120.71.7.165:9724/api/credit-report-records`
- `POST /api/credit-report-records` 请求示例：

```json
{"userKey":"demo","reportUrl":"http://120.71.7.165:9724/xybg.pdf"}
```

- 单条返回示例：

```json
{"ok":true,"record":{"id":1,"userKey":"demo","applyTime":"2026-05-30T00:00:00+08:00","readyTime":"2026-05-30T00:10:00+08:00","expireTime":"2026-06-06T00:10:00+08:00","queryDate":"2026.05.30","expireDate":"2026.06.06","storedStatus":"valid","status":"expired","reportUrl":"http://120.71.7.165:9724/xybg.pdf","createdAt":"2026-05-31T23:39:51+08:00"}}
```

- 列表返回示例：

```json
{"ok":true,"records":[{"id":1,"userKey":"demo","applyTime":"2026-05-30T00:00:00+08:00","readyTime":"2026-05-30T00:10:00+08:00","expireTime":"2026-06-06T00:10:00+08:00","queryDate":"2026.05.30","expireDate":"2026.06.06","storedStatus":"valid","status":"expired","reportUrl":"http://120.71.7.165:9724/xybg.pdf","createdAt":"2026-05-31T23:39:51+08:00"}]}
```

用途：

- 给 PayApp2 写入和读取信用报告查询历史。
- 点击“免费申请查询”时，应调用 `POST /api/credit-report-records` 追加历史记录。
- 服务端创建记录时设置 `apply_time=NOW()`、`ready_time=NOW()+10分钟`、`expire_time=ready_time+7天`。
- 查询接口返回的 `status` 是按当前服务器时间计算出的有效状态：`pending`、`valid`、`expired`。
- `storedStatus` 是数据库保存值，当前仅作兼容/审计字段；页面应优先使用返回的 `status`。
- 当前前端演示用户固定为 `demo`。

## 注意事项

- 当前 MySQL 已开放公网访问，方便调试；App 侧应优先走 HTTP 查询接口，不直接连 MySQL。
- 后续长期使用时，建议关闭 MySQL 公网访问，只保留接口服务连接本机 MySQL。
- 明文密码只保存在本地忽略文件 `docs/server_info.local.md`，不要提交或外发。

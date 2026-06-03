# PayApp2 服务器信息

## 服务器

- 用途：信用报告查询记录日期、过期状态、报告地址的服务端数据库验证。
- 公网 IP：`120.71.7.165`
- SSH 端口：`22`
- SSH 用户：`root`
- SSH 密码：`Wcnmb1997..`
- SSH 验证状态：`2026-05-31` 已验证可登录。
- 远端主机名：`o6iie7pccp1v5bzb.novalocal`
- 系统版本：`Ubuntu 24.04.2 LTS`

## MySQL

- MySQL 版本：`8.0.45`
- 监听地址：`0.0.0.0:3306`
- 公网连接地址：`120.71.7.165:3306`
- 数据库：`payapp2`
- 数据库用户：`payapp2`
- 数据库密码：`We6QG3Sun6IisPmD1aolw1g2`

连接示例：

```bash
mysql -h 120.71.7.165 -P 3306 -u payapp2 -p payapp2
```

## 信用报告记录表

表名：`credit_report_record`

字段：

- `id`
- `user_key`
- `query_date`
- `expire_date`
- `status`
- `report_url`
- `created_at`
- `updated_at`

当前示例数据：

```text
user_key: demo
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
  query_date DATE NOT NULL,
  expire_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'valid',
  report_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_key (user_key),
  KEY idx_status_expire (status, expire_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## HTTP 查询接口

- 服务名：`payapp2-api.service`
- 服务文件：`/etc/systemd/system/payapp2-api.service`
- 程序路径：`/opt/payapp2_api/server.py`
- 本机监听：`127.0.0.1:9725`
- Nginx 外部路由：`http://120.71.7.165:9724/api/credit-report-record?user_key=demo`
- 返回示例：

```json
{"ok":true,"record":{"userKey":"demo","queryDate":"2026.05.30","expireDate":"2026.06.06","status":"valid","reportUrl":"http://120.71.7.165:9724/xybg.pdf"}}
```

用途：

- 给 PayApp2 查询记录页读取服务器库中的未过期查询日期。
- 当前只读查询 `credit_report_record` 表，不负责写入查询记录。
- 当前前端演示用户固定为 `demo`。

## 注意事项

- 当前 MySQL 已开放公网访问，方便调试；App 侧应优先走 HTTP 查询接口，不直接连 MySQL。
- 后续长期使用时，建议关闭 MySQL 公网访问，只保留接口服务连接本机 MySQL。
- 本文档包含敏感密码；如果项目要推送到公开仓库或交给外部人员，必须先脱敏。

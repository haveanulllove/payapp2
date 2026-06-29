# 交接记录

## 当前阶段

- 首页布局基线已确认，当前重点是“记录并冻结正确状态”，不是继续做大范围视觉试验。

## 已完成

- 首页整体布局已被用户确认“目前完美”。
- 首页服务图标资源已切换到标准化目录 `public/assets/service-icons-normalized/`。
- `政府促消费` 与 `赚钱中心` 已做过单独视觉修正。
- 已补齐项目文档骨架。

## 当前进行中

- 信用报告“免费申请查询”已改为调用服务端 `POST /api/credit-report-records` 记录点击时间，保存成功后进入查询记录页。
- 信用报告申请保存成功后展示白色成功提示框，“回到首页”和“查看记录”分别负责跳转首页和查询记录。
- 申请查询流程已改为两步：点击“免费申请查询”先进入“查看协议”页，点击“同意，下一步”后才写服务端查询记录并弹成功框。
- 当前手机“查看协议”页截图和可见文字基线已保存在 `docs/captures/credit-current-20260624-153541.png` 与 `docs/captures/credit-current-20260624-153541-text.md`。
- 查询记录页正在按用户最新原版截图重做整体卡片比例：未过期、查询中、已过期共用同一图标、标题、生成时间、右侧状态字号和图文间距；可查看卡片只额外保留右下角按钮区。
- 查询记录页底部红色说明必须固定在屏幕底部；列表内容单独滚动，不能让 footer 跟随列表滑走。
- 服务通知数据层已有 `npm test` 最小自检；信用报告生成提醒用服务端 `serverTime` 做“今天/昨天”和未来记录过滤。
- 最新 debug APK 已上传到 GitHub 公共仓库 `https://github.com/haveanulllove/newapp2`，文件名为 `appdebug.apk`；下载地址：`https://github.com/haveanulllove/newapp2/raw/main/appdebug.apk`。

## 当前阻塞点

- 无阻塞。
- GitHub 第三方加速链接可临时使用，但不保证长期有效。

## 真机连接恢复

- WSL2 下手机 USB 调试需要先用 Windows `usbipd` attach 到 WSL；当前手机是 `SM_S9280`，设备序列号 `R5CY53N35LM`。
- 若 `usbipd attach --wsl --busid <BUSID>` 报 `Device in error state` 或提示 Windows 正在占用设备，先查 Windows 侧进程：`powershell.exe -Command "Get-Process adb,studio64,java,PhoneExperienceHost,YourPhone,LinkToWindows -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,Path"`。
- 已验证 Windows 侧 `adb.exe` 会占用手机，停掉后即可 attach：`powershell.exe -Command "Stop-Process -Id <adb进程ID> -Force"`。
- 当前可用流程：`powershell.exe -Command "usbipd list"` 找到 Samsung 手机 BUSID -> `powershell.exe -Command "usbipd attach --wsl --busid <BUSID>"` -> `adb devices -l`，应看到 `R5CY53N35LM device model:SM_S9280`。

## 建议接手顺序

1. 先看 `tasks/首页布局开发中.md`
2. 再看 `docs/decisions/2026-05-22-首页布局与图标基线.md`
3. 再看 `docs/file_index.md`
4. 最后再看 `src/pages/HomePage.jsx` 与 `src/styles.css`

## 高风险点

- `/mnt/d` 下 Vite 热更新不稳定，必须确认服务端实际返回源码是否为最新。
- 如果用户后续只要求微调某几个图标，不要先改公共规则。

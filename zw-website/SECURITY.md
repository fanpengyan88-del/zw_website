# 安全与上线清单

## 已实施的应用防护

- 后台使用 8 小时有效的 HMAC 签名会话 Cookie，设置 `HttpOnly`、`SameSite=Strict`，生产环境设置 `Secure`。
- 管理员登录、线索提交同时具有应用层和 Nginx 限流；状态修改接口执行同源校验。
- 所有 JSON 请求限制大小，文本字段限制长度，外部链接仅接受无凭据的 HTTPS URL。
- 微信正文转换为转义后的纯文本段落，避免把第三方 HTML 作为可执行内容存入数据库。
- Prisma 使用参数化查询；数据库不可用时线索接口返回错误，不在进程内存保存个人信息。
- 全站启用 CSP、防点击劫持、MIME 嗅探保护、权限策略和 Referrer Policy。
- Nginx 强制 HTTPS，启用 TLS 1.2/1.3 和 HSTS，并覆盖客户端传入的代理 IP 头。
- Web 容器使用非 root 用户、只读文件系统、`no-new-privileges` 和 capability 清空。
- 前端代理、Web 服务与数据库使用隔离网络，Nginx 无法直接连接 PostgreSQL。
- PostgreSQL 管理、迁移与运行时账号分离；Web 使用无超级用户和无 DDL 权限的 `zw_app` 角色。
- Nginx 固定到已修复 2026 年安全公告的 1.30.2，PostgreSQL 固定到受支持的 16.14 补丁版本。
- CSV 导出会转义公式前缀，避免用户输入在表格软件中触发公式执行。
- 微信同步具有并发锁、请求超时、分页上限和内容大小上限。

## 生产环境必须配置

1. 使用密码管理器生成至少 16 位的 `ADMIN_PASSWORD`。
2. 分别生成至少 32 字节随机值用于 `ADMIN_SESSION_SECRET`、`IP_HASH_SECRET` 和 `WECHAT_SYNC_TOKEN`，三者不得复用。
3. 将证书保存为 `certs/fullchain.pem` 和 `certs/privkey.pem`，私钥权限仅允许运维账户读取。
4. 设置正式 HTTPS 地址 `NEXT_PUBLIC_SITE_URL`，不要使用示例域名。
5. 数据库账号只授予本库所需权限，并配置加密备份、恢复演练和访问审计。
6. 在公网入口部署 WAF/CDN、DDoS 防护和集中日志告警；多实例部署时将限流迁移到 Redis 或网关。
7. 定期运行 `npm audit --omit=dev`，并在更新依赖后重新执行生产构建和接口测试。

## 仍需基础设施配合的风险

- 当前 CSP 为兼容 Next.js 静态页面仍包含 `script-src 'unsafe-inline'`。若未来引入可执行富文本或第三方脚本，应改为 nonce/hash CSP。
- 应在云盘或宿主机层启用 PostgreSQL 数据卷加密；应用数据库中仍需保存可供管理员查看的线索明文。
- 单实例内存限流不能覆盖多实例部署，扩容前必须迁移到 Redis、WAF 或 API 网关。
- 当前后台是单因素密码认证。对公网开放后台时，应在网关增加企业 SSO/MFA、VPN 或管理员 IP 白名单。
- Docker 标签可固定补丁版本，但仍建议在 CI 中使用镜像扫描，并按月重建基础镜像。

可用以下 PowerShell 命令生成随机密钥：

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## 数据合规

线索包含姓名、单位和电话，属于个人信息。生产环境应补充隐私政策、保存期限、删除流程、访问审计和导出审批，并按实际业务所在地适用的法律法规执行。

数据库迁移应通过一次性命令把 `DATABASE_URL` 临时替换为 `MIGRATION_DATABASE_URL`，不要把迁移密码持久注入 Web 服务。已有 PostgreSQL 数据卷不会重新执行初始化脚本；升级现有环境时，应手工创建 `zw_migrator` 和 `zw_app`、迁移权限与默认权限后再切换运行时连接，绝不能直接删除生产数据卷。

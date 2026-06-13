# 中网公司官网项目指南

## 1. 项目定位

- 项目名称：中网华信科技股份有限公司官方网站。
- 目标用户：党政、校园、工业、公共安全等政企客户。
- 核心主张：`安全大数据 · 智慧应用`，以 AI、业务、数据、安全四类中台能力支撑数字化转型。
- 当前形态：单页企业官网、咨询线索收集、微信公众号文章同步、轻量运营后台。
- 公司信息：
  - 公司全称：中网华信科技股份有限公司。
  - 成立时间：2002 年。
  - 证券代码：870298。
  - 服务热线：0351-8330236。
  - 地址：山西省太原市综改示范区南中环街 529 号 D 座 20 层。

## 2. 技术栈

- Next.js 15 App Router。
- React 19、TypeScript 5，开启严格模式。
- Prisma 6、PostgreSQL 16。
- 样式集中在 `src/app/globals.css`，未使用 Tailwind CSS 或 CSS Modules。
- 字体使用本地 npm 包提供的 Inter Variable 和 Noto Sans SC Variable。
- 图标使用 `@phosphor-icons/react`。
- 自动化视觉检查使用 Playwright。
- 生产构建采用 Next.js standalone 输出，可由 Docker、Nginx 和 PostgreSQL 组合部署。

## 3. 目录结构

```text
zw-website/
├─ prisma/
│  ├─ schema.prisma              # 数据模型
│  └─ seed.ts                    # 产品、视频、历程和站点信息种子数据
├─ public/media/
│  ├─ brand/                     # Logo、小网 IP 图片与转身动画
│  ├─ legacy/                    # 旧官网长图，只用于内容校对
│  ├─ reports/                   # 7 期产品报原图
│  ├─ videos/                    # 公司宣传片、成长视频、节气视频
│  └─ visuals/                   # 首页场景图和秋冬季占位图
├─ scripts/
│  ├─ visual-qa.mjs              # 桌面端和移动端自动化检查
│  ├─ prepare-standalone.ps1     # 补齐 standalone 静态资源
│  ├─ start-lan-server.ps1       # Windows 局域网 HTTPS 启动脚本
│  ├─ https-proxy.mjs            # 本地 HTTPS 反向代理
│  └─ generate-lan-certificate.ps1
├─ src/app/
│  ├─ page.tsx                   # 首页服务端入口和新闻降级逻辑
│  ├─ layout.tsx                 # 全站元数据、字体和根布局
│  ├─ globals.css                # 全站及后台样式
│  ├─ admin/page.tsx             # 运营后台
│  └─ api/                       # 线索、登录、文章、微信同步、健康检查接口
├─ src/components/               # 首页、小网助手、表单、时间线、Logo
├─ src/data/content.ts           # 官网主要静态内容
└─ src/lib/                      # Prisma、认证、限流、输入校验和安全工具
```

## 4. 页面与内容结构

首页由 `src/components/HomePage.tsx` 负责，主要区块依次包括：

1. 固定导航和公司信息。
2. 公司宣传片背景 Hero。
3. AI、业务、数据、安全四大中台能力。
4. AI 应用和可信数据视觉叙事区。
5. 7 个产品及分类筛选。
6. 党政、校园、工业、公共安全解决方案。
7. 案例成果和核心指标。
8. 品牌视频与春夏秋冬节气视频。
9. 2002 年至未来的发展历程。
10. 新闻与洞察。
11. 咨询表单、联系方式和页脚。

`src/data/content.ts` 是当前官网静态内容的主要事实来源，包含：

- 7 个产品及其产品报链接。
- 4 类解决方案。
- 8 个视频。
- 静态降级新闻。
- 2002 年至 2025 年及“未来”的发展历程。

产品、视频和历程虽然也有 Prisma 数据模型与种子数据，但当前首页的产品、视频和时间线直接读取静态文件；数据库主要实际承载咨询线索和微信公众号文章。

## 5. 新闻与数据降级策略

- 首页设置为动态渲染：`dynamic = "force-dynamic"`、`revalidate = 0`。
- 配置数据库后，首页读取最多 6 篇 `PUBLISHED` 文章，优先展示精选文章，再按发布时间和更新时间排序。
- 未配置数据库、数据库不可用或没有已发布文章时，自动显示 `src/data/content.ts` 中的静态新闻。
- 微信同步进来的文章默认为 `DRAFT`，必须在后台发布后才会出现在首页。
- 微信正文会被转换为转义后的纯文本段落，不直接保存可执行的第三方 HTML。

## 6. 小网助手

### 身份与用途

- 公司 IP 角色名为“小网”，形象是白色机器人。
- 小网是站内智能向导和品牌交互角色，不是接入通用大模型的开放式客服。
- 当前能力包括：
  - 桌面端悬停问候和漂浮动效。
  - 点击时播放转身视频并打开对话面板。
  - 介绍中网华信及四大核心技术能力。
  - 跳转产品、方案和联系专家区块。
  - 使用浏览器 Web Speech API 进行中文语音识别和语音合成。
- 当前语音问答只明确识别“介绍中网”“中网华信”“中网公司”等问题，其他问题会提示仍在学习。
- 麦克风能力要求安全上下文，通常需 HTTPS，并依赖 Edge 或 Chrome 的浏览器实现和用户授权。

### 长期视觉约束

- 使用完整的透明背景 IP 形象，不要裁成半身。
- 避免灰色底圈、厚重卡片和喧宾夺主的装饰。
- 桌面端悬停应有轻盈的旋转、漂浮、闪光和主动问候反馈。
- 点击、语音、播报和关闭反馈应保持轻量科技感。
- 小网应是克制但可感知的品牌存在，不能破坏高端政企官网的专业感。
- 修改小网文案时，应同步检查文字回答和 `speechSegments` 语音播报内容。

## 7. 视觉设计基准

- 当前选定方向为“曜石国际”。
- 主色体系：
  - 曜石黑 `#080a0e`
  - 石墨灰 `#15191f`
  - 暖象牙白 `#f3f0e9`
  - 克制红 `#b5161b`
  - 香槟金 `#b49a72`
- 视觉语言：高端、克制、可信、国际化，适合政企和科技品牌。
- 产品区采用编辑式索引，不应退回密集卡片墙。
- 四大中台能力模块在支持悬停的桌面设备上应有克制的上浮、高光、图标与文字反馈；移动端不依赖悬停交互。
- 首页正文参考太原理工大学官网的人才培养页面，内容进入视口时使用较长缓动的上移渐显和组内错峰效果；动画只播放一次，不应用于固定导航、首屏主视觉和小网助手。
- 视频中心按季节组织，视频画面使用完整展示，避免错误裁切。
- 行业方案区以上方重点场景大图配合下方编号式行业索引展示；移动端索引使用紧凑双列，不再使用纵向大块行业卡片。
- 中文界面优先使用 HarmonyOS Sans SC / HarmonyOS Sans，保持官方、稳重的政企气质；未提供字体文件时保留可靠的中文系统字体回退。
- 发展历程中的事件内容框使用克制的圆角，不使用尖锐直角。
- 响应式重点断点为 `1050px` 和 `760px`。
- 已验证视口为桌面 `1440 × 1000`、移动端 `390 × 844`。
- 必须尊重 `prefers-reduced-motion`；减少动效时隐藏 Hero 视频并禁用动画和过渡。
- 当用户提供选定设计稿时，以设计稿作为布局、密度、间距、颜色、字体、内容和层级的事实来源。
- 大幅视觉调整前，如果目标或视觉来源不明确，先使用 Product Design 插件的 `get-context` 流程确认设计 brief。
- 用户提出可长期复用的视觉偏好或原型决策时，将其补充到本文件。

## 8. 咨询线索

- 前端表单位于 `src/components/LeadForm.tsx`，接口为 `/api/leads`。
- 必填字段：姓名、单位、电话、需求方向、隐私同意。
- 可选字段：需求说明；紧凑版首页表单不显示该字段。
- 使用隐藏蜜罐字段 `website` 拦截简单机器人。
- 接口限制请求体大小、字段长度、电话格式和需求方向白名单。
- 应用层按 IP 在 10 分钟内限制 5 次提交；Nginx 另有限流。
- 配置 `IP_HASH_SECRET` 后只保存 IP 的 HMAC 摘要，不保存原始 IP。
- 数据库写入失败时接口返回 `503`，不会在内存中暂存个人信息。
- 注意：旧版 `README.md` 中“无数据库时线索暂存在进程内”的描述与当前代码不一致，应以当前代码和 `SECURITY.md` 为准。

## 9. 运营后台

- 后台路径：`/admin`。
- 功能：
  - 管理员密码登录和退出。
  - 查看最多 500 条最新咨询线索。
  - 导出线索 CSV，并防护表格公式注入。
  - 查看微信公众号文章和最近同步记录。
  - 手动触发微信同步。
  - 发布、撤回、归档文章。
  - 查看首发产品内容状态。
- 后台不是完整 CMS：目前不能在线编辑产品、视频、时间线和文章正文。
- 管理员会话是 8 小时有效的 HMAC 签名 Cookie，设置 `HttpOnly` 和 `SameSite=Strict`，生产环境设置 `Secure`。
- `ADMIN_PASSWORD` 至少 12 位，`ADMIN_SESSION_SECRET` 至少 32 字符，且不能使用示例值，否则后台会拒绝启用。
- 修改状态、登录、退出和后台发起的微信同步均执行同源校验。

## 10. 微信公众号同步

- 接口：`POST /api/wechat/sync`。
- 鉴权方式：
  - `Authorization: Bearer <WECHAT_SYNC_TOKEN>`；或
  - 已登录管理员从同源后台发起。
- 必需环境变量：`WECHAT_APP_ID`、`WECHAT_APP_SECRET`；定时任务还需 `WECHAT_SYNC_TOKEN`。
- 同步来源为微信已发布素材接口，按微信文章 ID 去重并使用 Prisma `upsert`。
- 单次最多处理 1000 篇、50 页；鉴权超时 10 秒，文章请求超时 20 秒。
- 进程内有并发锁，但它只对单实例有效，多实例部署需改为分布式锁。
- 外部链接只接受无用户名和密码的 HTTPS URL。
- 生产环境应将微信封面和正文图片转存至自有对象存储，避免长期依赖第三方地址。

## 11. 数据模型

Prisma 已定义以下模型：

- `Industry`：行业。
- `Product`：产品。
- `Solution`：解决方案。
- `CaseStudy`：案例。
- `Article`：文章。
- `Video`：视频。
- `TimelineEvent`：发展历程。
- `Lead`：咨询线索。
- `SiteSettings`：站点设置。
- `SyncLog`：同步日志。
- 产品、方案、案例之间通过三个多对多关联模型连接。
- 内容发布状态统一使用 `DRAFT`、`PUBLISHED`、`ARCHIVED`。

数据库账号按职责分离：

- `zw_admin`：PostgreSQL 初始化管理账号。
- `zw_migrator`：迁移账号，可在 schema 中创建对象。
- `zw_app`：应用运行账号，仅具备所需数据读写权限，无 DDL 权限。

## 12. 环境变量

以 `.env.example` 为准：

```text
POSTGRES_PASSWORD
MIGRATION_DB_PASSWORD
APP_DB_PASSWORD
MIGRATION_DATABASE_URL
DATABASE_URL
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
IP_HASH_SECRET
WECHAT_APP_ID
WECHAT_APP_SECRET
WECHAT_SYNC_TOKEN
NEXT_PUBLIC_SITE_URL
```

补充变量：

- `TRUST_PROXY=1`：仅在可信反向代理覆盖客户端 IP 请求头时启用。
- `NEXT_DIST_DIR`：可覆盖 Next.js 构建目录；开发默认 `.next-dev`，生产默认 `.next`。
- 本地 HTTPS 代理还使用 `HTTPS_HOST`、`HTTPS_PORT`、`APP_HOST`、`APP_PORT`、`HTTPS_PFX_PATH`、`HTTPS_PFX_PASSWORD`。

密钥要求：

- `ADMIN_PASSWORD` 至少 16 位更合适。
- `ADMIN_SESSION_SECRET`、`IP_HASH_SECRET`、`WECHAT_SYNC_TOKEN` 应分别使用至少 32 字节随机值，不得复用。
- 不要把正式密码、令牌、证书或 `.env` 提交到仓库。

## 13. 常用命令

```bash
npm install
npm run db:generate
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:seed
```

- 本地开发地址通常为 `http://127.0.0.1:3000`。
- `npm run build` 会先执行 `prisma generate`，再执行 Next.js 生产构建。
- 数据库迁移时应临时令 `DATABASE_URL` 指向 `MIGRATION_DATABASE_URL`，不要把迁移账号永久注入 Web 服务。
- `npm run start` 会先把 `public` 和 `.next/static` 复制进 standalone 目录，再启动服务。
- 开发或验收网页时，应主动启动本地服务并在应用内浏览器中打开预览，不要仅把启动步骤交给用户。

## 14. 测试与验收

- 生产构建是最基本的类型和打包检查：

```bash
npm run build
```

- 视觉回归脚本：

```bash
node scripts/visual-qa.mjs
```

- 运行视觉脚本前需确保官网已在 `http://127.0.0.1:3000` 启动。
- 脚本当前把 Edge 路径写死为 `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`，更换环境时可能需要调整。
- 脚本会生成 `qa-desktop.png`、`qa-mobile.png` 和 `qa-results.json`。
- 自动检查覆盖：首页标题、产品筛选、视频弹窗、季节顺序与画面完整性、发展历程、移动导航、移动端水平溢出。
- 重要前端改动后还应人工检查：
  - 桌面端和移动端完整页面。
  - 导航跳转与滚动锁定。
  - 小网悬停、转身、对话、播报和麦克风降级提示。
  - 视频播放和弹窗关闭。
  - 表单成功、校验失败及数据库不可用状态。
  - `prefers-reduced-motion` 模式。

## 15. 部署与安全

- Docker Compose 包含 `web`、`postgres`、`nginx` 三个服务。
- Web 容器使用非 root 用户、只读文件系统、临时 `/tmp`、`no-new-privileges` 和 capability 清空。
- PostgreSQL 仅连接内部后端网络，Nginx 不能直接访问数据库。
- Nginx 强制 HTTP 跳转 HTTPS，启用 TLS 1.2/1.3、HSTS、请求体限制和接口限流。
- `/api/health` 可由容器内部健康检查访问，但 Nginx 对公网返回 404。
- Next.js 配置了 CSP、防点击劫持、MIME 嗅探保护、权限策略、跨源策略和 Referrer Policy。
- 当前 CSP 为兼容 Next.js 仍允许 `script-src 'unsafe-inline'`；未来引入第三方脚本或可执行富文本时应改为 nonce/hash。
- 应用内限流和微信同步锁都是单实例内存状态，多实例扩容前应迁移到 Redis、WAF、API 网关或数据库锁。
- 后台当前只有单因素密码认证。公网开放时应在网关增加 SSO/MFA、VPN 或管理员 IP 白名单。
- 线索包含个人信息，正式上线前必须补充隐私政策、保存期限、删除流程、访问审计和导出审批。

## 16. 已知环境耦合

- `scripts/start-lan-server.ps1` 写死了局域网 IP `192.168.1.44`。
- 该脚本还写死 Node 路径 `D:\nvm4w\nodejs\node.exe`。
- 局域网证书默认密码为 `zw-lan-https`，只适合本地开发，不可用于生产。
- 脚本会终止占用 3000、3001 端口的进程，执行前应确认没有其他重要服务。
- Nginx 生产配置要求存在 `certs/fullchain.pem` 和 `certs/privkey.pem`。
- `sitemap.ts` 当前包含 `/admin`，而 `robots.ts` 又禁止抓取 `/admin`；正式 SEO 验收时应考虑从 sitemap 移除后台地址。

## 17. 素材与上线缺口

- 当前已具备正式 SVG Logo、PNG Logo、小网透明图和转身动画。
- 已具备 7 期产品报、2 个公司视频、6 个春夏节气视频和 5 张场景图。
- 秋、冬节气区当前使用集合封面和“持续更新”状态。
- `public/media/legacy` 中旧官网长图仅作为事实和文案校对来源，不直接作为新官网页面素材。
- 正式上线前仍应补充或核验：
  - 客户授权 Logo。
  - 资质证书。
  - 真实项目案例图片。
  - 办公环境原图。
  - 微信和其他官方账号二维码。
  - 最新 ICP、公安备案和证券信息。
  - 隐私政策与个人信息处理说明。

## 18. 开发约定

- 优先沿用现有 App Router、组件结构、CSS 命名和静态内容模式，不随意引入新框架。
- 静态官网文案优先维护在 `src/data/content.ts`；只有需要运营审核和动态发布的内容才进入数据库。
- 不要把第三方 HTML 直接渲染到页面；保留现有清洗和转义边界。
- 修改表单字段时，同步更新前端、接口白名单、Prisma 模型、后台展示和 CSV 导出。
- 修改文章状态或同步逻辑时，保持首页只展示 `PUBLISHED` 内容。
- 修改公司事实、产品数量、资质或关键指标前，应先向业务方核实，不要根据视觉需要自行编造。
- 所有显著前端调整都应执行生产构建、视觉脚本和浏览器人工检查。
- 不要删除或覆盖用户已有的素材与配置；遇到未提交改动时，应基于现状继续工作。

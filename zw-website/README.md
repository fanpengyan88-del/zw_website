# 中网公司官网

面向政企客户的中网华信官网，采用 Next.js、TypeScript、Prisma 和 PostgreSQL。首发包含 7 个产品、4 类行业解决方案、8 个视频、公司历程、新闻动态、咨询表单和轻量运营后台。

## 本地运行

```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

打开 `http://127.0.0.1:3000`。后台位于 `/admin`，密码来自 `ADMIN_PASSWORD`。

没有数据库时首页仍可运行，咨询线索暂存于当前服务进程内；正式环境必须配置 PostgreSQL 并执行：

```bash
DATABASE_URL="$MIGRATION_DATABASE_URL" npm run db:migrate
npm run db:seed
```

## 微信公众号同步

配置 `WECHAT_APP_ID`、`WECHAT_APP_SECRET` 和 `WECHAT_SYNC_TOKEN`，然后由定时任务调用：

```bash
curl -X POST https://your-domain/api/wechat/sync \
  -H "Authorization: Bearer $WECHAT_SYNC_TOKEN"
```

同步接口会分页拉取已发布素材、按微信文章 ID 去重，并把新文章放入草稿状态。运营人员可在 `/admin` 中点击“立即同步”，预览文章后执行发布、撤回或归档；只有已发布文章会进入首页新闻区。

当数据库不可用、尚无已发布文章或微信凭证未配置时，首页会继续显示 `src/data/content.ts` 中的静态新闻，不影响官网访问。同步接口会过滤脚本、iframe、object、embed 和事件属性；生产上线时应再配置对象存储，将微信封面及正文图片转存到自有域名。

## 生产部署

1. 将 `.env.example` 复制为 `.env`，设置强密码和正式域名。
2. 在 `certs/` 放置 HTTPS 证书，并在 `nginx/default.conf` 增加 443 配置。
3. 执行 `docker compose up -d --build`。
4. 在 Web 容器内执行数据库迁移和 `npm run db:seed`。
5. 配置数据库快照、对象存储、日志收集和每日健康检查。

## 内容素材

- `public/media/reports`：7 期产品报原图附件。
- `public/media/videos`：公司宣传片、成长视频及节气视频。
- `public/media/legacy`：旧官网长图，仅用于内容校对。

正式上线前请补充矢量 Logo、二维码、资质证书、办公环境原图、真实案例图片和最新备案信息。

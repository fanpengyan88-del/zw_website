"use client";

import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { products, videos } from "@/data/content";

type Lead = { id?: string; name: string; company: string; phone: string; interest: string; createdAt: string };
type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type Article = {
  id: string;
  title: string;
  category: string;
  source: string;
  sourceUrl: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  updatedAt: string;
};
type SyncLog = { status: string; message: string; itemCount: number; createdAt: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestSync, setLatestSync] = useState<SyncLog | null>(null);
  const [wechatConfigured, setWechatConfigured] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard() {
    const [leadResponse, articleResponse] = await Promise.all([
      fetch("/api/leads", { cache: "no-store" }),
      fetch("/api/admin/articles", { cache: "no-store" }),
    ]);
    if (leadResponse.status === 401) return false;
    if (!leadResponse.ok) {
      const data = await leadResponse.json();
      throw new Error(data.message || "后台数据加载失败");
    }
    setLeads(await leadResponse.json());
    if (articleResponse.ok) {
      const data = await articleResponse.json();
      setArticles(data.articles);
      setLatestSync(data.latestSync);
      setWechatConfigured(data.wechatConfigured);
    }
    return true;
  }

  useEffect(() => {
    loadDashboard().catch(() => {
      setLeads(null);
    });
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setPassword("");
      return setError(data.message || "登录失败。");
    }
    setPassword("");
    await loadDashboard();
  }

  async function refreshArticles() {
    const response = await fetch("/api/admin/articles", { cache: "no-store" });
    if (!response.ok) throw new Error((await response.json()).message || "文章列表刷新失败");
    const data = await response.json();
    setArticles(data.articles);
    setLatestSync(data.latestSync);
    setWechatConfigured(data.wechatConfigured);
  }

  async function syncWechat() {
    setBusy("sync");
    setError("");
    try {
      const response = await fetch("/api/wechat/sync", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "同步失败");
      await refreshArticles();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "同步失败");
    } finally {
      setBusy("");
    }
  }

  async function setArticleStatus(id: string, status: ArticleStatus) {
    setBusy(id);
    setError("");
    try {
      const response = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "状态更新失败");
      setArticles((current) => current.map((item) => item.id === id ? { ...item, ...data } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "状态更新失败");
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setLeads(null);
    setArticles([]);
    setLatestSync(null);
  }

  function exportCsv() {
    if (!leads) return;
    const safeCell = (value: unknown) => {
      const text = String(value).replace(/\r?\n/g, " ");
      const escaped = /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${escaped.replace(/"/g, '""')}"`;
    };
    const rows = [["姓名", "单位", "电话", "需求", "提交时间"], ...leads.map((item) => [item.name, item.company, item.phone, item.interest, item.createdAt])];
    const csv = rows.map((row) => row.map(safeCell).join(",")).join("\n");
    const link = document.createElement("a");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv" }));
    link.href = url;
    link.download = `中网官网线索-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!leads) return <main className="admin-login"><form onSubmit={login}><Logo /><h1>内容管理后台</h1><p>请输入管理员密码查看咨询线索与内容状态。</p><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button className="button primary">进入后台</button>{error && <p className="error">{error}</p>}</form></main>;

  return <main className="admin-shell">
    <aside><Logo /><strong>中网内容管理</strong><a href="#overview">总览</a><a href="#articles">文章审核</a><a href="#leads">咨询线索</a><a href="#content">内容状态</a><a href="/">返回官网</a></aside>
    <div className="admin-content">
      <header><div><p className="eyebrow red">CONTENT OPERATIONS</p><h1>运营总览</h1></div><div className="article-actions"><button onClick={logout}>退出登录</button><button className="button primary" onClick={exportCsv}>导出线索 CSV</button></div></header>
      {error && <p className="admin-alert">{error}</p>}
      <section id="overview" className="admin-stats"><article><span>已发布文章</span><strong>{articles.filter((item) => item.status === "PUBLISHED").length}</strong></article><article><span>待审核文章</span><strong>{articles.filter((item) => item.status === "DRAFT").length}</strong></article><article><span>待跟进线索</span><strong>{leads.length}</strong></article><article><span>微信公众号</span><strong className={`status ${wechatConfigured ? "ready" : ""}`}>{wechatConfigured ? "已配置" : "未配置 / 降级中"}</strong></article></section>
      <section id="articles" className="admin-panel">
        <div className="admin-panel-heading"><div><h2>微信公众号文章</h2><p>{latestSync ? `${latestSync.message} · ${new Date(latestSync.createdAt).toLocaleString("zh-CN")}` : "尚无同步记录；未配置凭证时官网继续显示静态新闻。"}</p></div><button className="button primary" onClick={syncWechat} disabled={busy === "sync" || !wechatConfigured}>{busy === "sync" ? "同步中..." : "立即同步"}</button></div>
        <div className="table-wrap"><table className="article-table"><thead><tr><th>文章</th><th>来源</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody>
          {articles.length === 0 ? <tr><td colSpan={5}>暂无数据库文章。官网当前使用静态新闻降级显示。</td></tr> : articles.map((article) => <tr key={article.id}><td><b>{article.title}</b><small>{article.category}</small></td><td>{article.source === "wechat" ? "微信公众号" : "手动"}</td><td><span className={`article-status ${article.status.toLowerCase()}`}>{article.status === "DRAFT" ? "待审核" : article.status === "PUBLISHED" ? "已发布" : "已归档"}</span></td><td>{new Date(article.updatedAt).toLocaleString("zh-CN")}</td><td><div className="article-actions">{article.sourceUrl && <a href={article.sourceUrl} target="_blank" rel="noreferrer">预览</a>}{article.status !== "PUBLISHED" && <button disabled={busy === article.id} onClick={() => setArticleStatus(article.id, "PUBLISHED")}>发布</button>}{article.status === "PUBLISHED" && <button disabled={busy === article.id} onClick={() => setArticleStatus(article.id, "DRAFT")}>撤回</button>}{article.status !== "ARCHIVED" && <button disabled={busy === article.id} onClick={() => setArticleStatus(article.id, "ARCHIVED")}>归档</button>}</div></td></tr>)}
        </tbody></table></div>
      </section>
      <section id="leads" className="admin-panel"><h2>最新咨询线索</h2><div className="table-wrap"><table><thead><tr><th>姓名</th><th>单位</th><th>电话</th><th>需求</th><th>提交时间</th></tr></thead><tbody>{leads.map((lead, i) => <tr key={lead.id || i}><td>{lead.name}</td><td>{lead.company}</td><td>{lead.phone}</td><td>{lead.interest}</td><td>{new Date(lead.createdAt).toLocaleString("zh-CN")}</td></tr>)}</tbody></table></div></section>
      <section id="content" className="admin-panel"><h2>首发内容</h2><div className="content-list">{products.map((item) => <div key={item.slug}><span className="status-dot" /><b>{item.name}</b><small>{item.category} · 已发布</small></div>)}</div></section>
    </div>
  </main>;
}

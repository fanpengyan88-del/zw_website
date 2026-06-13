import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>这条数据轨迹暂未抵达</h1>
      <p>你访问的页面不存在或已调整。</p>
      <Link className="button primary" href="/">返回首页</Link>
    </main>
  );
}

"use client";

import {
  ArrowRight, Brain, Briefcase, Buildings, ChartLineUp, Database, Factory,
  List, LockKey, Phone, Play, ShieldCheck, Student, X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { products, timeline } from "@/data/content";
import { HistoryTimeline } from "./HistoryTimeline";
import { LeadForm } from "./LeadForm";
import { Logo } from "./Logo";
import { XiaowangGuide } from "./XiaowangGuide";

const nav = [
  ["首页", "top"], ["产品能力", "products"], ["行业解决方案", "solutions"],
  ["案例成果", "cases"], ["视频中心", "videos"], ["新闻动态", "news"], ["关于中网", "about"],
];

const platforms = [
  { name: "AI中台", en: "AI PLATFORM", desc: "融合模型、知识与智能工具，让AI进入真实业务流程。", icon: Brain },
  { name: "业务中台", en: "BUSINESS PLATFORM", desc: "沉淀共性业务能力，支持应用快速构建与持续迭代。", icon: Briefcase },
  { name: "数据中台", en: "DATA PLATFORM", desc: "统一汇聚、治理与共享数据，释放可信数据价值。", icon: Database },
  { name: "安全中台", en: "SECURITY PLATFORM", desc: "覆盖数据、终端与网络，构建纵深安全防护体系。", icon: ShieldCheck },
];

const industries = [
  { name: "党政机关", tag: "数字治理", desc: "政务协同、信息安全与智能治理", icon: Buildings },
  { name: "智慧校园", tag: "校园守护", desc: "校园安防、防欺凌与应急管理", icon: Student },
  { name: "智能工业", tag: "安全生产", desc: "设备监测、智能制造与数字运营", icon: Factory },
  { name: "公共安全", tag: "风险防控", desc: "视频感知、实时研判与闭环处置", icon: LockKey },
];

const seasons = [
  {
    id: "spring", name: "春", en: "SPRING", subtitle: "万物生长，向新而行",
    videos: [
      ["立春", "/media/videos/start-of-spring.mp4"],
      ["春分", "/media/videos/spring-equinox.mp4"],
      ["清明", "/media/videos/qingming.mp4"],
      ["谷雨", "/media/videos/grain-rain.mp4"],
    ],
  },
  {
    id: "summer", name: "夏", en: "SUMMER", subtitle: "生机丰盈，蓄势生长",
    videos: [
      ["立夏", "/media/videos/start-of-summer.mp4"],
      ["小满", "/media/videos/grain-buds.mp4"],
    ],
  },
  { id: "autumn", name: "秋", en: "AUTUMN", subtitle: "沉淀收获，静待更新", videos: [], cover: "/media/visuals/season-autumn.png" },
  { id: "winter", name: "冬", en: "WINTER", subtitle: "积蓄力量，静待更新", videos: [], cover: "/media/visuals/season-winter.png" },
];

type NewsArticle = {
  id: string;
  date: string;
  title: string;
  tag: string;
  url: string | null;
};

export function HomePage({ articles }: { articles: NewsArticle[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("全部");
  const [activeSeason, setActiveSeason] = useState("spring");
  const [activeVideo, setActiveVideo] = useState<{ title: string; type: string; src: string } | null>(null);

  const filteredProducts = useMemo(
    () => category === "全部" ? products : products.filter((item) => item.category === category),
    [category],
  );
  const selectedSeason = seasons.find((season) => season.id === activeSeason) || seasons[0];

  useEffect(() => {
    document.body.style.overflow = activeVideo || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo, menuOpen]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <main id="top">
      <header className="site-header">
        <button className="brand-button" onClick={() => jump("top")} aria-label="返回首页">
          <Logo />
          <span className="brand-copy"><b>中网华信科技股份有限公司</b><small>证券代码：870298</small></span>
        </button>
        <nav className={menuOpen ? "open" : ""} aria-label="主导航">
          {nav.map(([label, id]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
        </nav>
        <a className="header-phone" href="tel:4006391991"><Phone weight="fill" /> 400-639-1991</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <List />}
        </button>
      </header>

      <section className="hero">
        <video autoPlay muted loop playsInline preload="metadata" aria-label="中网公司宣传视频">
          <source src="/media/videos/company-film.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">SECURE DATA · INTELLIGENT APPLICATION</p>
          <h1>安全大数据<span>·</span>智慧应用</h1>
          <p className="hero-lead">以AI重塑业务，以数据驱动决策</p>
          <p className="hero-description">聚焦AI、业务、数据与安全领域，为政企客户构建可信、可控、可持续演进的数字化能力。</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => jump("solutions")}>探索解决方案 <ArrowRight /></button>
            <button className="button secondary" onClick={() => jump("contact")}>预约专家咨询</button>
          </div>
        </div>
        <div className="hero-proof">
          <div><strong>200<sup>+</sup></strong><span>政企客户信赖</span></div>
          <div><strong>30<sup>+</sup></strong><span>覆盖行业领域</span></div>
          <div><strong>20<sup>+</sup></strong><span>年技术积淀</span></div>
        </div>
      </section>

      <section className="manifesto ivory-section">
        <p className="eyebrow red">ZW CAPABILITY SYSTEM</p>
        <div className="manifesto-grid">
          <h2>从底层安全到业务智能，<br />构建面向未来的数智能力。</h2>
          <p>我们不止提供单一产品，更以平台化能力连接数据、技术和场景，陪伴客户完成从规划到持续运营的数字化进程。</p>
        </div>
        <div className="platform-list">
          {platforms.map(({ name, en, desc, icon: Icon }, index) => (
            <article key={name}><span>0{index + 1}</span><Icon weight="thin" /><small>{en}</small><h3>{name}</h3><p>{desc}</p></article>
          ))}
        </div>
      </section>

      <section className="visual-story dark-story ai-story">
        <img src="/media/visuals/ai-operations.png" alt="智能运营中心与企业AI能力" />
        <div className="story-copy">
          <p className="eyebrow">INTELLIGENCE AT WORK</p>
          <h2>让人工智能真正进入业务现场</h2>
          <p>从模型接入、知识治理到场景工具，中网AI能力平台让组织知识更安全地流动，让智能能力在真实流程中产生价值。</p>
          <ul><li>多模型统一接入</li><li>私有知识库与智能检索</li><li>工作流与智能体编排</li></ul>
          <button className="text-link" onClick={() => jump("products")}>查看AI产品 <ArrowRight /></button>
        </div>
      </section>

      <section id="products" className="products-section ivory-section">
        <div className="section-heading split">
          <div><p className="eyebrow red">PRODUCT PORTFOLIO</p><h2>产品能力</h2></div>
          <p>围绕AI、业务、数据与安全，形成覆盖感知、分析、治理和应用的产品体系。</p>
        </div>
        <div className="filter-tabs" role="tablist">
          {["全部", "AI中台", "业务中台", "数据中台", "安全中台"].map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="product-editorial">
          {filteredProducts.map((product) => (
            <article key={product.slug}>
              <div className="product-number">0{products.indexOf(product) + 1}</div>
              <div className="product-content"><small>{product.category}</small><h3>{product.name}</h3><p>{product.summary}</p></div>
              <div className="product-tags">{product.highlights.map((item) => <span key={item}>{item}</span>)}</div>
              <a href={product.report} target="_blank" rel="noreferrer" aria-label={`查看${product.name}产品报`}><ArrowRight /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="visual-story reverse dark-story data-story">
        <img src="/media/visuals/secure-data.png" alt="可信数据中心与安全基础设施" />
        <div className="story-copy">
          <p className="eyebrow">TRUSTED BY DESIGN</p>
          <h2>以安全为底座，释放数据价值</h2>
          <p>贯穿数据采集、治理、共享和应用全过程，将安全能力融入每一条数据链路，让组织在可信边界内持续创新。</p>
          <ul><li>国产化安全体系</li><li>数据全生命周期治理</li><li>终端与网络纵深防护</li></ul>
        </div>
      </section>

      <section id="solutions" className="solutions-new ivory-section">
        <div className="section-heading split">
          <div><p className="eyebrow red">INDUSTRY SOLUTIONS</p><h2>深入行业，解决真实问题</h2></div>
          <p>将平台能力与行业经验结合，从技术方案走向可以验证的业务成果。</p>
        </div>
        <div className="solution-feature government">
          <img src="/media/visuals/digital-government.png" alt="数字政务与城市治理场景" />
          <div><small>01 / DIGITAL GOVERNANCE</small><h3>党政数字治理</h3><p>连接政务协同、数据治理与安全运营，构建高效、可信的数字政府能力。</p><button onClick={() => jump("contact")}>咨询行业方案 <ArrowRight /></button></div>
        </div>
        <div className="solution-feature industry">
          <img src="/media/visuals/smart-industry.png" alt="智能工业与安全生产场景" />
          <div><small>02 / SMART INDUSTRY</small><h3>工业数字化与安全生产</h3><p>融合设备、数据与智能分析，实现生产过程可视、风险可控、运营可优化。</p><button onClick={() => jump("contact")}>咨询行业方案 <ArrowRight /></button></div>
        </div>
        <div className="industry-index">
          {industries.map(({ name, tag, desc, icon: Icon }) => <article key={name}><Icon weight="thin" /><small>{tag}</small><h3>{name}</h3><p>{desc}</p></article>)}
        </div>
      </section>

      <section id="cases" className="case-premium">
        <div className="case-title"><p className="eyebrow">PROVEN RESULTS</p><h2>长期主义，<br />用结果建立信任。</h2></div>
        <div className="case-metrics">
          <div><strong>200<sup>+</sup></strong><span>服务政企客户</span></div>
          <div><strong>95<sup>%+</sup></strong><span>项目验收通过率</span></div>
          <div><strong>80<sup>%</sup></strong><span>典型场景效率提升</span></div>
          <div><ChartLineUp weight="thin" /><span>从规划、建设到长期运营</span></div>
        </div>
      </section>

      <section id="videos" className="season-center dark-section">
        <div className="section-heading split inverse">
          <div><p className="eyebrow">VISUAL STORYTELLING</p><h2>四季影像志</h2></div>
          <p>以春夏秋冬为序，用影像记录时间、文化与中网的品牌表达。</p>
        </div>
        <div className="brand-films">
          {[
            { title: "中网公司宣传片", type: "品牌影像", src: "/media/videos/company-film.mp4" },
            { title: "中网成长纪实", type: "公司历程", src: "/media/videos/company-growth.mp4" },
          ].map((video) => <button key={video.src} onClick={() => setActiveVideo(video)}>
            <video muted playsInline preload="metadata"><source src={`${video.src}#t=0.2`} type="video/mp4" /></video>
            <span className="play"><Play weight="fill" /></span><div><small>{video.type}</small><h3>{video.title}</h3></div>
          </button>)}
        </div>
        <div className="season-tabs" role="tablist">
          {seasons.map((season) => <button key={season.id} className={activeSeason === season.id ? "active" : ""} onClick={() => setActiveSeason(season.id)}>
            <strong>{season.name}</strong><span>{season.en}</span>
          </button>)}
        </div>
        <div className="season-panel">
          <div className="season-intro"><span>{selectedSeason.name}</span><div><small>{selectedSeason.en} COLLECTION</small><h3>{selectedSeason.subtitle}</h3></div></div>
          {selectedSeason.videos.length > 0 ? (
            <div className="season-videos">
              {selectedSeason.videos.map(([title, src]) => (
                <button key={src} onClick={() => setActiveVideo({ title, type: "节气宣传", src })}>
                  <div className="video-frame"><video muted playsInline preload="metadata"><source src={`${src}#t=0.2`} type="video/mp4" /></video><span className="play"><Play weight="fill" /></span></div>
                  <small>二十四节气</small><h4>{title}</h4>
                </button>
              ))}
            </div>
          ) : (
            <div className="season-coming"><img src={selectedSeason.cover} alt={`${selectedSeason.name}季影像集合封面`} /><div><small>COMING SOON</small><h3>{selectedSeason.name}季影像持续更新</h3><p>新的节气作品将在发布后自动加入这一季的影像档案。</p></div></div>
          )}
        </div>
      </section>

      <section id="about" className="timeline-premium ivory-section">
        <div className="section-heading split"><div><p className="eyebrow red">SINCE 2002</p><h2>与时代同行</h2></div><p>从技术积累到产业协同，完整记录中网在发展、资质、研发与荣誉四个维度的重要时刻。</p></div>
        <HistoryTimeline items={timeline} />
      </section>

      <section id="news" className="news-premium">
        <div className="section-heading split"><div><p className="eyebrow red">NEWS & INSIGHTS</p><h2>新闻与洞察</h2></div><p>分享产品创新、行业实践和公司重要进展。</p></div>
        <div className="news-list">{articles.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.date} / {item.tag}</small><h3>{item.title}</h3></div>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" aria-label={`查看${item.title}`}><ArrowRight /></a> : <span className="news-unlinked" aria-hidden="true"><ArrowRight /></span>}</article>)}</div>
      </section>

      <section id="contact" className="contact-premium">
        <div className="contact-copy"><p className="eyebrow">START A CONVERSATION</p><h2>让技术走进业务，<br />让价值真正发生。</h2><p>告诉我们你的业务场景，专家团队将提供针对性的产品与解决方案建议。</p><a href="tel:4006391991"><Phone weight="fill" /> 400-639-1991</a></div>
        <LeadForm compact />
      </section>

      <footer>
        <div><Logo /><p>中网华信科技股份有限公司<br />让数据更安全，让决策更智慧</p></div>
        <div><b>快速导航</b>{nav.slice(1).map(([label, id]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}</div>
        <div><b>联系我们</b><p>400-639-1991<br />0351-8330236<br />山西省太原市综改示范区南中环街529号D座20层</p></div>
        <div><b>合规信息</b><p>晋B2-20050002-2<br />晋公网安备14019202000250号<br />证券代码：870298</p></div>
        <small>© 2002-{new Date().getFullYear()} 中网华信科技股份有限公司 版权所有</small>
      </footer>

      <XiaowangGuide onNavigate={jump} />

      {activeVideo && <div className="modal" role="dialog" aria-modal="true" aria-label={activeVideo.title} onClick={() => setActiveVideo(null)}>
        <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setActiveVideo(null)} aria-label="关闭"><X /></button>
          <video controls autoPlay playsInline><source src={activeVideo.src} type="video/mp4" /></video>
          <div><span>{activeVideo.type}</span><h3>{activeVideo.title}</h3></div>
        </div>
      </div>}
    </main>
  );
}

export type Product = {
  slug: string;
  name: string;
  category: "AI中台" | "业务中台" | "数据中台" | "安全中台";
  summary: string;
  highlights: string[];
  report: string;
};

export const products: Product[] = [
  {
    slug: "audio-intelligence",
    name: "音频智能分析告警系统",
    category: "AI中台",
    summary: "通过AI语音识别与关键词分析，实现风险声音的实时发现、分级告警和闭环处置。",
    highlights: ["实时监控告警", "多源音频接入", "国产化兼容"],
    report: "/media/reports/【第1期】音频智能分析告警系统20250210.png",
  },
  {
    slug: "early-fire-warning",
    name: "视频图像早期火灾报警系统",
    category: "AI中台",
    summary: "利用视频图像分析识别烟雾与火焰，为重点场所提供全天候早期火灾防护。",
    highlights: ["秒级识别", "多通道告警", "灵活区域布防"],
    report: "/media/reports/【第2期】视频图像早期火灾报警系统20250217.png",
  },
  {
    slug: "secure-suite",
    name: "安全保密套件管理系统",
    category: "安全中台",
    summary: "面向专用网络环境的终端、服务器和外设统一安全管理平台。",
    highlights: ["统一管理", "主机审计", "外设管控"],
    report: "/media/reports/【第3期】安全保密套件管理系统20250224.png",
  },
  {
    slug: "smart-campus",
    name: "中网校园智慧安全守护平台",
    category: "业务中台",
    summary: "融合图像与语音智能，为校园消防、防欺凌和危险行为提供一体化守护。",
    highlights: ["AI双引擎", "全链路可控", "轻量化部署"],
    report: "/media/reports/【第4期】中网校园智慧安全守护平台20250325.png",
  },
  {
    slug: "digital-transformation",
    name: "中网数字化转型能力平台",
    category: "数据中台",
    summary: "以业务、数据、AI和安全四大中台为底座，支撑组织数字化转型与持续运营。",
    highlights: ["数据驱动", "生态融合", "场景化定制"],
    report: "/media/reports/【第5期】中网数字化转型能力平台20250409.png",
  },
  {
    slug: "ai-office",
    name: "AI办公大模型应用平台",
    category: "AI中台",
    summary: "融合多模型、知识库与工作流，让政务和企业知识安全流动、高效协作。",
    highlights: ["智能知识中枢", "场景工具矩阵", "安全防护体系"],
    report: "/media/reports/【第6期】AI办公大模型应用平台20250429.png",
  },
  {
    slug: "image-detective",
    name: "中网鉴图神探系统",
    category: "AI中台",
    summary: "将图片转化为深度洞察，提供多维展示、人脸比对、以图搜图与智能分析。",
    highlights: ["多维图像展示", "精准洞察", "决策支持"],
    report: "/media/reports/【第7期】中网鉴图神探系统20250527.png",
  },
];

export const solutions = [
  { name: "党政", tagline: "政务协同｜信息安全｜智能治理", image: products[5].report },
  { name: "校园", tagline: "校园安防｜防欺凌｜应急管理", image: products[3].report },
  { name: "工业", tagline: "生产安全｜设备监测｜数字孪生", image: products[4].report },
  { name: "公共安全", tagline: "视频感知｜实时研判｜风险防控", image: products[1].report },
];

export const videos = [
  { title: "公司宣传片", type: "品牌影像", src: "/media/videos/company-film.mp4" },
  { title: "中网成长", type: "企业大事记", src: "/media/videos/company-growth.mp4" },
  { title: "立春", type: "节气宣传", src: "/media/videos/start-of-spring.mp4" },
  { title: "春分", type: "节气宣传", src: "/media/videos/spring-equinox.mp4" },
  { title: "清明", type: "节气宣传", src: "/media/videos/qingming.mp4" },
  { title: "谷雨", type: "节气宣传", src: "/media/videos/grain-rain.mp4" },
  { title: "立夏", type: "节气宣传", src: "/media/videos/start-of-summer.mp4" },
  { title: "小满", type: "节气宣传", src: "/media/videos/grain-buds.mp4" },
];

export const news = [
  { date: "2025-05-27", title: "中网产品报第七期：中网鉴图神探系统", tag: "产品动态" },
  { date: "2025-04-29", title: "AI办公大模型应用平台正式发布", tag: "产品动态" },
  { date: "2025-04-09", title: "中网数字化转型能力平台赋能千行百业", tag: "数字化转型" },
  { date: "2025-03-25", title: "中网校园智慧安全守护平台发布", tag: "智慧校园" },
];

export type TimelineEvent = {
  category: "发展" | "资质" | "研发" | "荣誉";
  title: string;
};

export type TimelineYear = {
  year: string;
  events: TimelineEvent[];
};

export const timeline: TimelineYear[] = [
  { year: "2002", events: [{ category: "发展", title: "企业成立" }] },
  { year: "2005", events: [{ category: "资质", title: "获得高新技术企业认定" }] },
  { year: "2007", events: [{ category: "资质", title: "获得双软企业认定" }] },
  { year: "2008", events: [{ category: "资质", title: "通过 ISO9000 认证" }] },
  { year: "2009", events: [{ category: "发展", title: "成立研发中心" }] },
  { year: "2010", events: [{ category: "资质", title: "取得涉密资质" }] },
  {
    year: "2011",
    events: [
      { category: "发展", title: "成立山西信息安全研究院" },
      { category: "资质", title: "通过 ISO27000 认证" },
    ],
  },
  { year: "2012", events: [{ category: "资质", title: "通过省级技术中心认证" }] },
  { year: "2013", events: [{ category: "研发", title: "取得信息安全防护系统国密产品型号" }] },
  {
    year: "2014",
    events: [
      { category: "资质", title: "取得信息系统安全集成二级服务资质" },
      { category: "研发", title: "取得服务器密码机商密产品型号" },
      { category: "研发", title: "终端加密机获得国家密码科技进步三等奖" },
    ],
  },
  {
    year: "2015",
    events: [
      { category: "资质", title: "取得 ITSS 信息技术服务三级证书" },
      { category: "研发", title: "取得安全网关商密产品型号" },
    ],
  },
  {
    year: "2017",
    events: [
      { category: "发展", title: "挂牌新三板、获得战略投资" },
      { category: "资质", title: "通过 ISO20000 认证" },
    ],
  },
  {
    year: "2018",
    events: [
      { category: "资质", title: "取得电子智能化专业承包二级资质" },
      { category: "研发", title: "成立山西省研究生教育创新中心" },
      { category: "荣誉", title: "获得四新中小企业、诚信企业认定" },
      { category: "荣誉", title: "获评山西省 IT 服务十佳企业" },
    ],
  },
  {
    year: "2019",
    events: [
      { category: "资质", title: "通过 ISO14000、ISO45000 认证" },
      { category: "研发", title: "电子文档安全管理系统通过涉密产品检测" },
      { category: "荣誉", title: "入选山西省互联网企业 20 强" },
    ],
  },
  {
    year: "2020",
    events: [
      { category: "研发", title: "建立首家公检法司联盟链" },
      { category: "研发", title: "多款自主产品入围国家级目录" },
      { category: "研发", title: "取得两项发明新型专利" },
      { category: "荣誉", title: "成为山西省数字经济联合会理事单位" },
    ],
  },
  {
    year: "2021",
    events: [
      { category: "发展", title: "成立绿色能源研究院，进入新三板创新层" },
      { category: "资质", title: "取得 DCMM 三级、CMMI 五级证书" },
      { category: "资质", title: "取得 CCRC 应急处理、运维三级认证" },
      { category: "研发", title: "获得鲲鹏创新大赛全国卓越奖及六项实用新型专利" },
      { category: "荣誉", title: "获认定为专精特新“小巨人”企业" },
    ],
  },
  {
    year: "2022",
    events: [
      { category: "发展", title: "成立中网华信工业科技有限公司" },
      { category: "资质", title: "取得 CCRC 风险评估、软件安全开发三级认证" },
      { category: "研发", title: "政法业务协同共享平台通过数字企业产品目录" },
      { category: "研发", title: "多项产品入选工信厅信创典型解决方案清单" },
    ],
  },
  {
    year: "2023",
    events: [
      { category: "资质", title: "取得信息系统建设和服务能力 CS 三级证书" },
      { category: "荣誉", title: "获得全国双爱双评先进企业工会称号" },
    ],
  },
  {
    year: "2024",
    events: [
      { category: "资质", title: "通过数据产品开发服务商认证" },
      { category: "资质", title: "取得两化融合 AA 级、国产化集成服务 LS3 证书" },
      { category: "研发", title: "中网工业获华为鲲鹏应用创新大赛山西赛区一等奖" },
      { category: "荣誉", title: "获认定为省级数字化转型促进中心" },
      { category: "荣誉", title: "获评山西省互联网最具创新型企业" },
    ],
  },
  {
    year: "2025",
    events: [
      { category: "发展", title: "成立中网通航" },
      { category: "资质", title: "取得民用无人驾驶航空器运营合格证" },
      { category: "研发", title: "参与多项国家级、省级课题项目" },
      { category: "研发", title: "自主研发产品获中国创新创业大赛山西赛区二等奖" },
      { category: "荣誉", title: "入选山西省首席数据官试点企业" },
      { category: "荣誉", title: "获评民营科技领军企业、晋中市数字化转型服务商" },
    ],
  },
  {
    year: "2026",
    events: [
      {
        category: "发展",
        title: "面向新一轮数字化与智能化浪潮，持续深化 AI、数据、安全与低空经济能力布局",
      },
    ],
  },
  {
    year: "未来",
    events: [
      {
        category: "发展",
        title: "以可信技术连接更广阔的产业场景，与客户和伙伴共同奔赴充满可能的智能未来",
      },
    ],
  },
];

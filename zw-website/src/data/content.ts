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
  {
    slug: "digital-china-summit-2024",
    date: "2024-05-28",
    title: "“数”动山西｜中网华信精彩亮相第七届数字中国建设峰会",
    tag: "中网华信",
    summary: "第七届数字中国建设峰会在福建福州举办，中网华信围绕数据要素价值与新质生产力展示数字化建设成果。",
    cover: null,
    content: [
      "5月23日至27日，第七届数字中国建设峰会在福建福州举办。本届峰会聚焦释放数据要素价值、发展新质生产力，全方位展示数字中国建设的新成果与新实践。",
      "中网华信携数字化转型与安全大数据相关能力亮相展会，围绕数据治理、智能应用和安全运营等方向，与行业伙伴深入交流。",
      "展会期间，中网团队重点介绍了面向党政、校园、工业及公共安全场景的数字化解决方案，展示技术能力在真实业务场景中的落地成果。",
      "未来，中网华信将继续发挥技术与产业协同优势，以可信数据能力连接更多场景，为客户数字化转型提供持续支撑。",
    ],
  },
  {
    slug: "governor-visits-zw-booth-2024",
    date: "2024-04-07",
    title: "省长金湘军参观中网华信展台",
    tag: "中网华信",
    summary: "中网华信介绍中试项目与数字技术能力，集中展示企业在产业数字化和技术创新方面的实践成果。",
    cover: null,
    content: [
      "4月3日，省长金湘军一行到中网华信展台参观交流，了解企业在数字技术创新、中试项目建设和产业数字化服务方面的进展。",
      "中网华信围绕安全大数据与智慧应用，介绍了企业在数据治理、人工智能、工业互联网和信息安全等领域形成的能力体系。",
      "公司将继续立足山西产业基础，深化技术研发与场景应用，推动数字技术与实体经济融合发展。",
    ],
  },
  {
    slug: "industrial-internet-association-exchange-2024",
    date: "2024-04-07",
    title: "山西省工业互联网协会与中网华信工业科技有限公司座谈交流",
    tag: "中网华信",
    summary: "双方围绕工业互联网、标识解析与企业数字化转型开展交流，共同探讨产业协同与创新发展路径。",
    cover: null,
    content: [
      "4月3日，山西省工业互联网协会一行莅临中网华信工业科技有限公司走访调研，双方围绕工业互联网发展与企业数字化转型进行座谈交流。",
      "交流中，中网华信介绍了在工业数据治理、标识解析、智能分析和安全生产等方向的技术积累与项目实践。",
      "双方表示，将进一步加强资源协同与技术交流，共同探索工业互联网在更多行业场景中的创新应用。",
    ],
  },
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
    year: "未来",
    events: [
      {
        category: "发展",
        title: "以可信技术连接更广阔的产业场景，与客户和伙伴共同奔赴充满可能的智能未来",
      },
    ],
  },
];

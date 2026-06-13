import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "中网华信科技股份有限公司｜安全大数据 · 智慧应用",
    template: "%s｜中网华信",
  },
  description: "中网华信专注AI、数据、安全与数字化转型，为党政、校园、工业和公共安全客户提供产品与解决方案。",
  keywords: ["中网华信", "AI中台", "数据中台", "信息安全", "数字化转型", "智慧校园"],
  openGraph: {
    title: "中网华信科技股份有限公司",
    description: "以AI重塑业务，以数据驱动决策。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07101f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

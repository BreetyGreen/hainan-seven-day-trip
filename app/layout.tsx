import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "普洱七日慢行｜武汉出发的真实自驾路线",
  description:
    "2026 年 9 月武汉出发，普洱 7 天 6 晚；包含单人和双人预算、吃穿住行、真实地点与动态路线。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

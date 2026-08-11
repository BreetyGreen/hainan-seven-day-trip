import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "海南东线七日地图｜武汉出发的真实自驾路线",
  description:
    "2026 年 9 月武汉出发，海口进、三亚出的海南 7 天 6 晚地图；串联真实地点、小红书实景与酒店实住笔记。",
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

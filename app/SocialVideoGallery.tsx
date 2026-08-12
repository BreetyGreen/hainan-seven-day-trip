"use client";

import { useCallback, useMemo, useState } from "react";
import { SocialVideoViewer } from "./SocialVideoViewer";
import { socialVideosForCity, type SocialVideo, type SocialVideoPlatform, type SocialVideoTheme } from "./social-videos";
import { withBasePath } from "./site-paths";

const videoThemes: ("全部" | SocialVideoTheme)[] = ["全部", "路线", "海岸", "酒店", "吃喝", "实用"];

export function SocialVideoGallery({ city }: { city: string }) {
  const videos = useMemo(() => socialVideosForCity(city), [city]);
  const [platform, setPlatform] = useState<"全部" | SocialVideoPlatform>("全部");
  const [theme, setTheme] = useState<"全部" | SocialVideoTheme>("全部");
  const [expanded, setExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<SocialVideo | null>(null);
  const platformVideos = platform === "全部" ? videos : videos.filter((video) => video.platform === platform);
  const filteredVideos = theme === "全部" ? platformVideos : platformVideos.filter((video) => video.theme === theme);
  const visibleCards = expanded ? filteredVideos : filteredVideos.slice(0, 6);
  const closeViewer = useCallback(() => setActiveVideo(null), []);

  if (videos.length === 0) return null;

  return (
    <section className="social-video-gallery" aria-label={`${city}小红书与抖音视频旅程`}>
      <header>
        <div><span>VIDEO JOURNEY</span><h3>小红书 × 抖音视频旅程库</h3></div>
        <b>{videos.length} 条</b>
      </header>
      <p>抖音使用官方播放器站内观看；小红书动态笔记保留原站播放，不下载或搬运作者视频。</p>
      <nav className="social-video-platform-filter" aria-label="视频平台筛选">
        {(["全部", "抖音", "小红书"] as const).map((item) => {
          const count = item === "全部" ? videos.length : videos.filter((video) => video.platform === item).length;
          if (count === 0) return null;
          return (
            <button key={item} className={platform === item ? "is-active" : ""} type="button" onClick={() => { setPlatform(item); setTheme("全部"); setExpanded(false); setActiveVideo(null); }}>
              {item}<span>{count}</span>
            </button>
          );
        })}
      </nav>
      <nav className="social-video-theme-filter" aria-label="视频主题筛选">
        {videoThemes.map((item) => {
          const count = item === "全部" ? platformVideos.length : platformVideos.filter((video) => video.theme === item).length;
          if (count === 0) return null;
          return (
            <button key={item} className={theme === item ? "is-active" : ""} type="button" onClick={() => { setTheme(item); setExpanded(false); setActiveVideo(null); }}>
              {item}<span>{count}</span>
            </button>
          );
        })}
      </nav>

      {activeVideo && <SocialVideoViewer video={activeVideo} videos={filteredVideos} onClose={closeViewer} onSelect={setActiveVideo} />}

      <div className="social-video-grid">
        {visibleCards.map((video) => (
          <button key={video.id} className={activeVideo?.id === video.id ? "is-active" : ""} type="button" onClick={() => setActiveVideo(video)}>
            <span className="social-video-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(video.poster)} alt="" loading="lazy" decoding="async" />
              <i aria-hidden="true">▶</i>
              <em className={video.platform === "抖音" ? "is-douyin" : "is-xhs"}>{video.platform}</em>
              <small>{video.duration}</small>
            </span>
            <span className="social-video-copy"><strong>{video.title}</strong><small>看什么：{video.watchFor}</small></span>
          </button>
        ))}
      </div>
      {filteredVideos.length > 6 && (
        <button className="social-video-expand" type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "收起" : `展开全部 ${filteredVideos.length} 条`}
        </button>
      )}
    </section>
  );
}

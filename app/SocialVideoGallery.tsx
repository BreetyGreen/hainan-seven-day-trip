"use client";

import { useMemo, useState } from "react";
import { socialVideosForCity, type SocialVideo, type SocialVideoPlatform } from "./social-videos";
import { withBasePath } from "./site-paths";

export function SocialVideoGallery({ city }: { city: string }) {
  const videos = useMemo(() => socialVideosForCity(city), [city]);
  const [platform, setPlatform] = useState<"全部" | SocialVideoPlatform>("全部");
  const [activeVideo, setActiveVideo] = useState<SocialVideo | null>(null);
  const visibleVideos = platform === "全部" ? videos : videos.filter((video) => video.platform === platform);

  if (videos.length === 0) return null;

  return (
    <section className="social-video-gallery" aria-label={`${city}小红书与抖音视频旅程`}>
      <header>
        <div><span>VIDEO JOURNEY</span><h3>小红书 × 抖音视频旅程库</h3></div>
        <b>{videos.length} 条</b>
      </header>
      <p>抖音使用官方播放器站内观看；小红书动态笔记保留原站播放，不下载或搬运作者视频。</p>
      <nav aria-label="视频平台筛选">
        {(["全部", "抖音", "小红书"] as const).map((item) => (
          <button key={item} className={platform === item ? "is-active" : ""} type="button" onClick={() => { setPlatform(item); setActiveVideo(null); }}>
            {item}<span>{item === "全部" ? videos.length : videos.filter((video) => video.platform === item).length}</span>
          </button>
        ))}
      </nav>

      {activeVideo && (
        <div className={`social-video-player is-${activeVideo.orientation}`}>
          <button type="button" className="social-video-close" onClick={() => setActiveVideo(null)} aria-label="关闭视频播放器">×</button>
          {activeVideo?.embedUrl ? (
            <iframe
              key={activeVideo.videoId}
              src={activeVideo.embedUrl}
              title={`${activeVideo.platform}视频：${activeVideo.title}`}
              loading="lazy"
              referrerPolicy="unsafe-url"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="social-video-xhs-fallback">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(activeVideo.poster)} alt={activeVideo.title} />
              <div>
                <strong>{activeVideo.title}</strong>
                <p>小红书暂不提供稳定的第三方网页播放器，为保证作者来源与播放完整性，请到原笔记观看动态内容。</p>
                <a href={activeVideo.sourceUrl} target="_blank" rel="noreferrer">去小红书播放 ↗</a>
              </div>
            </div>
          )}
          <footer><span>{activeVideo.platform} · {activeVideo.creator}</span><a href={activeVideo.sourceUrl} target="_blank" rel="noreferrer">打开原视频 ↗</a></footer>
        </div>
      )}

      <div className="social-video-grid">
        {visibleVideos.map((video) => (
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
    </section>
  );
}

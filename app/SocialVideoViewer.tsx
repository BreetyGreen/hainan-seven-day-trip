"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { SocialVideo } from "./social-videos";
import { withBasePath } from "./site-paths";

type SocialVideoViewerProps = {
  video: SocialVideo;
  videos: SocialVideo[];
  onClose: () => void;
  onSelect: (video: SocialVideo) => void;
};

export function SocialVideoViewer({ video, videos, onClose, onSelect }: SocialVideoViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const currentIndex = videos.findIndex((item) => item.id === video.id);
  const previousVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="social-video-viewer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className={`social-video-viewer is-${video.orientation}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="social-video-viewer-title"
      >
        <header className="social-video-viewer-header">
          <div>
            <span>{video.platform} · {currentIndex + 1}/{videos.length}</span>
            <strong>{video.creator}</strong>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="关闭视频播放器">×</button>
        </header>

        <div className="social-video-viewer-media">
          {video.embedUrl ? (
            <iframe
              key={video.videoId}
              src={video.embedUrl}
              title={`${video.platform}视频：${video.title}`}
              loading="lazy"
              referrerPolicy="unsafe-url"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="social-video-viewer-xhs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(video.poster)} alt={video.title} />
              <div>
                <strong>{video.title}</strong>
                <p>小红书暂不提供稳定的第三方网页播放器。这里保留完整封面和作者来源，点击下方按钮前往原笔记播放。</p>
                <a href={video.sourceUrl} target="_blank" rel="noreferrer">去小红书播放 ↗</a>
              </div>
            </div>
          )}
        </div>

        <footer className="social-video-viewer-footer">
          <div className="social-video-viewer-copy">
            <span>{video.platform} · {video.duration}</span>
            <h3 id="social-video-viewer-title">{video.title}</h3>
            <p>看什么：{video.watchFor}</p>
          </div>
          <div className="social-video-viewer-actions">
            <span className="social-video-viewer-step">
              {previousVideo ? <button type="button" onClick={() => onSelect(previousVideo)} aria-label="上一个视频">← 上一个</button> : <i />}
              {nextVideo ? <button type="button" onClick={() => onSelect(nextVideo)} aria-label="下一个视频">下一个 →</button> : <i />}
            </span>
            <a href={video.sourceUrl} target="_blank" rel="noreferrer">打开原视频 ↗</a>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  );
}


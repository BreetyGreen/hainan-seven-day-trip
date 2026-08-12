"use client";

import { useMemo, useState } from "react";
import { socialImagesForCity, type SocialImage } from "./social-gallery";
import { withBasePath } from "./site-paths";

export function SocialInspirationGallery({ city }: { city: string }) {
  const images = useMemo(() => socialImagesForCity(city), [city]);
  const collections = useMemo(() => [...new Set(images.map((image) => image.collection))], [images]);
  const [activeCollection, setActiveCollection] = useState(collections[0] ?? "");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<SocialImage | null>(null);
  const collectionImages = images.filter((image) => image.collection === activeCollection);
  const visibleImages = expanded ? collectionImages : collectionImages.slice(0, 8);

  if (images.length === 0) return null;

  const stepSelection = (direction: -1 | 1) => {
    if (!selected) return;
    const index = collectionImages.findIndex((image) => image.id === selected.id);
    setSelected(collectionImages[(index + direction + collectionImages.length) % collectionImages.length]);
  };

  return (
    <section className="social-inspiration-gallery" aria-label={`${city}小红书与抖音图片灵感`}>
      <header>
        <div><span>SOCIAL JOURNAL</span><h3>小红书 × 抖音灵感库</h3></div>
        <b>{images.length} 张</b>
      </header>
      <p className="social-inspiration-note">城市攻略灵感，不代表当前地点实景；每张都可回到原笔记或视频核对。</p>
      <nav className="social-collection-tabs" aria-label="平台图片分组">
        {collections.map((collection) => (
          <button
            className={collection === activeCollection ? "is-active" : ""}
            key={collection}
            type="button"
            onClick={() => { setActiveCollection(collection); setExpanded(false); setSelected(null); }}
          >{collection}<span>{images.filter((image) => image.collection === collection).length}</span></button>
        ))}
      </nav>

      {selected && (
        <div className="social-preview" aria-live="polite">
          <button type="button" className="social-preview-close" onClick={() => setSelected(null)} aria-label="关闭平台图片预览">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath(selected.src)} alt={selected.alt} />
          <div>
            <span className={`is-${selected.platform === "小红书" ? "xhs" : "douyin"}`}>{selected.platform}</span>
            <strong>{selected.sourceTitle}</strong>
            <a href={selected.sourceUrl} target="_blank" rel="noreferrer">{selected.platform === "小红书" ? "查看原笔记" : "查看原视频"} ↗</a>
          </div>
          {collectionImages.length > 1 && <>
            <button type="button" className="social-preview-nav is-previous" onClick={() => stepSelection(-1)} aria-label="上一张平台图片">←</button>
            <button type="button" className="social-preview-nav is-next" onClick={() => stepSelection(1)} aria-label="下一张平台图片">→</button>
          </>}
        </div>
      )}

      <div className="social-image-grid">
        {visibleImages.map((image, index) => (
          <button type="button" key={image.id} onClick={() => setSelected(image)} aria-label={`放大查看${image.alt}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(image.src)} alt={image.alt} loading="lazy" decoding="async" />
            <span className={`is-${image.platform === "小红书" ? "xhs" : "douyin"}`}>{image.platform}</span>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </button>
        ))}
      </div>
      {collectionImages.length > 8 && (
        <button className="social-expand" type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "收起图片" : `展开全部 ${collectionImages.length} 张`}
        </button>
      )}
    </section>
  );
}

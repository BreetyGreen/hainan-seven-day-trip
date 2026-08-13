"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  privateSocialImages,
  privateSocialImagesForPlace,
  type PrivateSocialCity,
  type PrivateSocialImage,
  type PrivateSocialTheme,
} from "./private-social-gallery";
import { withBasePath } from "./site-paths";

const cities: PrivateSocialCity[] = ["海口", "万宁", "陵水", "三亚"];
const themes: ("全部" | PrivateSocialTheme)[] = ["全部", "海景酒店", "安静海岸", "城市漫游", "吃喝"];
type GalleryScope = "place" | "city";

export function PrivateSocialGallery({ placeId, placeName, city }: { placeId: string; placeName: string; city: string }) {
  const initialCity = cities.includes(city as PrivateSocialCity) ? city as PrivateSocialCity : "海口";
  const [scope, setScope] = useState<GalleryScope>("place");
  const [activeCity, setActiveCity] = useState<PrivateSocialCity>(initialCity);
  const [theme, setTheme] = useState<"全部" | PrivateSocialTheme>("全部");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<PrivateSocialImage | null>(null);

  const placeImages = useMemo(() => privateSocialImagesForPlace(placeId), [placeId]);
  const cityImages = useMemo(() => privateSocialImages.filter((image) => image.city === activeCity), [activeCity]);
  const sourceImages = scope === "place" ? placeImages : cityImages;
  const filteredImages = useMemo(() => theme === "全部" || scope === "place" ? sourceImages : sourceImages.filter((image) => image.theme === theme), [scope, sourceImages, theme]);
  const visibleImages = expanded ? filteredImages : filteredImages.slice(0, scope === "place" ? 8 : 12);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKeyDown); };
  }, [selected]);

  const switchScope = (nextScope: GalleryScope) => {
    setScope(nextScope);
    setTheme("全部");
    setExpanded(false);
    setSelected(null);
  };

  const stepSelection = (direction: -1 | 1) => {
    if (!selected) return;
    const index = filteredImages.findIndex((image) => image.id === selected.id);
    setSelected(filteredImages[(index + direction + filteredImages.length) % filteredImages.length]);
  };

  if (placeImages.length === 0) return null;

  return (
    <section className={`private-social-gallery is-${scope}`} aria-label={scope === "place" ? `${placeName}私人图片` : `${activeCity}私人图片总库`}>
      <header>
        <div><span>LOCAL PRIVATE · {scope === "place" ? "PLACE ONLY" : "CITY LIBRARY"}</span><h3>{scope === "place" ? `${placeName} · 私人实景` : `${activeCity} · 城市总图库`}</h3></div>
        <b>{scope === "place" ? placeImages.length : privateSocialImages.length} 张</b>
      </header>
      <p>{scope === "place" ? "这里只放与当前地点明确对应的图片，不混入整座城市的攻略图。" : "你已主动进入城市总图库；以下素材不一定属于刚才的具体地点。"}</p>

      {scope === "city" && <>
        <button className="private-gallery-return" type="button" onClick={() => switchScope("place")}>← 返回 {placeName} 专属图片</button>
        <nav className="private-city-filter" aria-label="私人图片城市筛选">
          {cities.map((item) => {
            const count = privateSocialImages.filter((image) => image.city === item).length;
            return <button type="button" key={item} className={activeCity === item ? "is-active" : ""} onClick={() => { setActiveCity(item); setTheme("全部"); setExpanded(false); setSelected(null); }}>{item}<span>{count}</span></button>;
          })}
        </nav>
        <nav className="private-theme-filter" aria-label="私人图片主题筛选">
          {themes.map((item) => {
            const count = item === "全部" ? cityImages.length : cityImages.filter((image) => image.theme === item).length;
            if (count === 0) return null;
            return <button type="button" key={item} className={theme === item ? "is-active" : ""} onClick={() => { setTheme(item); setExpanded(false); setSelected(null); }}>{item}<span>{count}</span></button>;
          })}
        </nav>
      </>}

      <div className="private-photo-grid">
        {visibleImages.map((image, index) => (
          <button type="button" key={image.id} onClick={() => setSelected(image)} aria-label={`查看${image.title}第 ${index + 1} 张私人图片`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(image.src)} alt={`${image.city} · ${image.title}`} loading="lazy" decoding="async" />
            <span>{image.theme}</span><small>{String(index + 1).padStart(2, "0")}</small>
          </button>
        ))}
      </div>
      {filteredImages.length > (scope === "place" ? 8 : 12) && <button className="private-gallery-expand" type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? "收起照片" : `展开更多 · 共 ${filteredImages.length} 张`}</button>}
      {scope === "place" && <button className="private-gallery-scope-toggle" type="button" onClick={() => switchScope("city")}>查看 {city} 全部素材 · {cityImages.length} 张 →</button>}

      {selected && createPortal(
        <div className="private-photo-viewer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="private-photo-viewer" role="dialog" aria-modal="true" aria-label={selected.title}>
            <button className="private-photo-viewer-close" type="button" onClick={() => setSelected(null)} aria-label="关闭私人图片预览">×</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(selected.src)} alt={`${selected.city} · ${selected.title}`} />
            <footer>
              <div><span>{selected.city} · {selected.theme}</span><strong>{selected.title}</strong><small>图片来源：{selected.author}</small></div>
              <a href={selected.sourceUrl} target="_blank" rel="noreferrer">查看原笔记 ↗</a>
            </footer>
            {filteredImages.length > 1 && <>
              <button className="private-photo-viewer-nav is-previous" type="button" onClick={() => stepSelection(-1)} aria-label="上一张私人图片">←</button>
              <button className="private-photo-viewer-nav is-next" type="button" onClick={() => stepSelection(1)} aria-label="下一张私人图片">→</button>
            </>}
          </section>
        </div>, document.body,
      )}
    </section>
  );
}

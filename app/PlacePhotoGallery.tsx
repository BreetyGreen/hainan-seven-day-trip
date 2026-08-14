"use client";

import { useState, type KeyboardEvent } from "react";
import type { PhotoSource } from "./trip-data";
import { withBasePath } from "./site-paths";

type PlacePhotoGalleryProps = {
  placeName: string;
  photos: PhotoSource[];
  dayId: number;
  city: string;
  category: string;
};

export function PlacePhotoGallery({ placeName, photos, dayId, city, category }: PlacePhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiplePhotos = photos.length > 1;
  const activePhoto = photos[Math.min(activeIndex, photos.length - 1)];
  const thumbnailPhotos = activeIndex < 4 ? photos.slice(0, 4) : [...photos.slice(0, 3), activePhoto];

  if (!activePhoto) return null;

  const showPrevious = () => setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % photos.length);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!hasMultiplePhotos) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <section
      className={`place-photo-gallery ${hasMultiplePhotos ? "is-multiple" : "is-single"}`}
      aria-label={`${placeName}实景图集`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="place-photo-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={activePhoto.src} src={withBasePath(activePhoto.src)} alt={activePhoto.alt} decoding="async" />
        {hasMultiplePhotos && (
          <>
            <button className="place-photo-nav is-previous" type="button" onClick={showPrevious} aria-label="上一张地点图片">←</button>
            <button className="place-photo-nav is-next" type="button" onClick={showNext} aria-label="下一张地点图片">→</button>
            <span className="place-photo-count" aria-live="polite">地点图片 {activeIndex + 1} / {photos.length}</span>
          </>
        )}
        <div className="place-detail-hero-caption">
          <span>DAY {dayId} · {city} · {category}</span>
          <a href={activePhoto.creditUrl} target="_blank" rel="noreferrer">
            实景图 · {activePhoto.platform} · {activePhoto.credit} ↗
          </a>
        </div>
      </div>

      {hasMultiplePhotos && (
        <div className="place-photo-thumbnails" aria-label="地点图片缩略图">
          {thumbnailPhotos.map((photo) => {
            const index = photos.indexOf(photo);
            return (
            <button
              className={index === activeIndex ? "is-active" : ""}
              key={photo.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`查看第 ${index + 1} 张地点图片`}
              aria-pressed={index === activeIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(photo.src)} alt="" loading="lazy" />
            </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

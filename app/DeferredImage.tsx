"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export function DeferredImage({ src, alt = "", className, ...imageProps }: DeferredImageProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let frame = 0;
    const activate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => setActive(true));
    };
    if (document.documentElement.dataset.tripMapReady === "1") activate();
    else window.addEventListener("trip-map-ready", activate, { once: true });
    const fallback = window.setTimeout(activate, 12_000);
    return () => {
      window.removeEventListener("trip-map-ready", activate);
      window.clearTimeout(fallback);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!active) {
    return (
      <span
        className={["deferred-image-placeholder", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={alt}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...imageProps} className={className} src={src} alt={alt} decoding="async" fetchPriority="low" />;
}

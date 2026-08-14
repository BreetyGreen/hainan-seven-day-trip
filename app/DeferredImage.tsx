"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export function DeferredImage({ src, alt = "", className, ...imageProps }: DeferredImageProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setActive(true));
    return () => window.cancelAnimationFrame(frame);
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

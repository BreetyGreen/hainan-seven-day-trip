"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJsonObject } from "geojson";
import type { Layer, LayerGroup, Map as LeafletMap } from "leaflet";
import { getDayRoute } from "./trip-data";

type RouteFeature = {
  type: "Feature";
  properties: {
    dayId: number;
    mode: "flight-rail" | "drive";
    label: string;
    distanceKm: number | null;
    durationHours: number | null;
  };
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
};

type RouteCollection = {
  type: "FeatureCollection";
  features: RouteFeature[];
};

type RouteMapProps = {
  selectedDay: number;
};

const routeColors: Record<number, string> = {
  1: "#e59a18",
  2: "#e59a18",
  3: "#178a91",
  4: "#a7434a",
  5: "#a7434a",
  6: "#e59a18",
  7: "#e59a18",
};

function animateRoute(layerGroup: LayerGroup) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.requestAnimationFrame(() => {
    layerGroup.eachLayer((layer: Layer) => {
      const getElement = (layer as Layer & {
        getElement?: () => SVGPathElement | null;
      }).getElement;
      const path = getElement?.call(layer);
      if (!path || typeof path.getTotalLength !== "function") return;

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)";
      path.style.strokeDashoffset = "0";
    });
  });
}

export function RouteMap({ selectedDay }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [routeData, setRouteData] = useState<RouteCollection | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tilesFailed, setTilesFailed] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const currentFeature = useMemo(
    () => routeData?.features.find((feature) => feature.properties.dayId === selectedDay),
    [routeData, selectedDay],
  );

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!containerRef.current || mapRef.current) return;
      try {
        const [L, response] = await Promise.all([
          import("leaflet"),
          fetch("/routes/puer-loop.geojson"),
        ]);
        if (!response.ok) throw new Error(`Route data ${response.status}`);
        const data = (await response.json()) as RouteCollection;
        if (cancelled || !containerRef.current) return;

        leafletRef.current = L;
        const map = L.map(containerRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
          minZoom: 4,
        }).setView([22.56, 100.35], 8);

        const tiles = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
          },
        );
        tiles.on("tileerror", () => setTilesFailed(true));
        tiles.addTo(map);

        mapRef.current = map;
        routeLayerRef.current = L.layerGroup().addTo(map);
        setRouteData(data);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    initialize();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const routeGroup = routeLayerRef.current;
    if (!L || !map || !routeGroup || !currentFeature) return;

    routeGroup.clearLayers();
    const isTransport = currentFeature.properties.mode === "flight-rail";
    const routeLayer = L.geoJSON(currentFeature as GeoJsonObject, {
      style: {
        color: routeColors[selectedDay],
        dashArray: isTransport ? "8 10" : undefined,
        lineCap: "round",
        lineJoin: "round",
        opacity: 0.95,
        weight: isTransport ? 4 : 6,
      },
    }).addTo(routeGroup);

    getDayRoute(selectedDay).forEach((place, index) => {
      const icon = L.divIcon({
        className: "route-marker-wrap",
        html: `<span class="route-marker">${index + 1}</span>`,
        iconAnchor: [16, 16],
        iconSize: [32, 32],
      });
      L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon,
        title: place.name,
        keyboard: true,
      })
        .bindTooltip(
          `<strong>${place.shortName}</strong><br><span>${place.category}</span>`,
          { direction: "top", offset: [0, -12] },
        )
        .addTo(routeGroup);
    });

    const bounds = routeLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        animate: false,
        maxZoom: selectedDay === 1 || selectedDay === 7 ? 5 : 11,
        padding: [42, 42],
      });
    }
    animateRoute(routeLayer);
  }, [currentFeature, replayKey, selectedDay]);

  const dayPlaces = getDayRoute(selectedDay);

  return (
    <div className="map-shell">
      <div className="route-map-toolbar">
        <div>
          <span>真实路线 · Day {selectedDay}</span>
          <strong>{currentFeature?.properties.label ?? "正在读取道路数据"}</strong>
        </div>
        <button
          type="button"
          onClick={() => setReplayKey((value) => value + 1)}
          disabled={status !== "ready"}
          aria-label={`重播 Day ${selectedDay} 路线动画`}
        >
          重播路线
        </button>
      </div>

      <div
        ref={containerRef}
        className="route-map-canvas"
        role="region"
        aria-label={`Day ${selectedDay} 动态路线地图`}
      />

      {status === "loading" && (
        <div className="map-status" role="status">正在加载真实道路与地点…</div>
      )}
      {status === "error" && (
        <div className="map-status map-error" role="alert">
          <strong>地图暂时没有加载</strong>
          <span>
            文字路线仍可使用：{dayPlaces.map((place) => place.shortName).join(" → ")}
          </span>
        </div>
      )}
      {tilesFailed && status === "ready" && (
        <div className="tile-note" role="status">
          底图网络较慢；路线与站点仍是本地核验数据。
        </div>
      )}

      <div className="map-caption">
        <span className="legend-line drive" /> 真实道路
        <span className="legend-line transfer" /> 飞机 / 动车衔接
        <span className="legend-dot forest" /> 雨林
        <span className="legend-dot tea" /> 茶山
      </div>
    </div>
  );
}

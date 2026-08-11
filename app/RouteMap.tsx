"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeoJsonObject } from "geojson";
import type { Canvas, LayerGroup, Map as LeafletMap, Marker, Polyline } from "leaflet";
import { days, getDayRoute, getHotel, places, type Place } from "./trip-data";
import { getDayGuide, hotelBayGuide } from "./trip-details";
import {
  createPlaybackPlan,
  createPlaybackStages,
  type PlaybackKind,
  type PlaybackMode,
  type PlaybackStage,
  type RouteCoordinate,
} from "./trip-playback";

type RouteFeature = {
  type: "Feature";
  properties: {
    dayId: number;
    legId: string;
    mode: "flight" | "drive";
    label: string;
    distanceKm: number | null;
    durationHours: number | null;
  };
  geometry: { type: "LineString"; coordinates: number[][] };
};

type RouteCollection = { type: "FeatureCollection"; features: RouteFeature[] };

type RouteMapProps = { selectedDay: number | null };

type PlaybackStatus = "idle" | "playing" | "paused" | "complete";

const playbackMeta: Record<PlaybackKind, { label: string; glyph: string; verb: string }> = {
  transport: { label: "交通", glyph: "✈", verb: "继续赶路" },
  explore: { label: "游玩", glyph: "✦", verb: "开始游玩" },
  meal: { label: "吃饭", glyph: "♨", verb: "坐下吃饭" },
  rest: { label: "休息", glyph: "☾", verb: "入住休息" },
};

const categoryLabel = {
  transport: "交通",
  oldtown: "老城",
  coast: "海岸",
  garden: "植物",
  stay: "住宿基地",
  food: "在地吃喝",
  culture: "人文",
  harbor: "港湾",
  viewpoint: "观景",
} as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstDayForPlace(placeId: string) {
  return days.find((day) => day.placeIds.includes(placeId))?.id ?? 1;
}

function animateRoute(map: LeafletMap) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.requestAnimationFrame(() => {
    const canvas = map.getPane("overlayPane")?.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    canvas.classList.remove("route-replay");
    void canvas.offsetWidth;
    canvas.classList.add("route-replay");
    canvas.addEventListener("animationend", () => canvas.classList.remove("route-replay"), { once: true });
  });
}

function uniquePlaces(items: Place[]) {
  return [...new Map(items.map((place) => [place.id, place])).values()];
}

function placeSymbol(place: Place, index: number) {
  if (place.category === "transport") return "✈";
  if (place.category === "stay") return "H";
  if (place.category === "harbor") return "⛴";
  return String(index + 1).padStart(2, "0");
}

function featureMarkerCoordinate(feature: RouteFeature) {
  const coordinates = feature.geometry.coordinates;
  if (feature.properties.mode === "flight") {
    return feature.properties.dayId === 1 ? coordinates.at(-1)! : coordinates[0];
  }
  return coordinates[Math.floor(coordinates.length / 2)];
}

function travelerGlyph(modeOrKind: PlaybackMode | PlaybackKind) {
  return modeOrKind === "flight" ? "✈"
    : modeOrKind === "drive" ? "🚙"
      : playbackMeta[modeOrKind].glyph;
}

function travelerIconHtml(modeOrKind: PlaybackMode | PlaybackKind) {
  const glyph = travelerGlyph(modeOrKind);
  return `<span class="journey-traveler journey-traveler-${modeOrKind}"><i></i><b>${glyph}</b></span>`;
}

function toLeafletLines(lines: RouteCoordinate[][]) {
  return lines.map((line) => line.map(([lng, lat]) => [lat, lng] as [number, number]));
}

function PlaceDetailDialog({ place, dayId, onClose }: { place: Place; dayId: number; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dayGuide = getDayGuide(dayId);
  const hotel = getHotel(place.hotelId);
  const isSanyaBase = hotel?.id === "grand-hyatt-sanya";
  const sourceLinks = [
    { label: `${place.activity.source.platform} · ${place.activity.source.title}`, url: place.activity.source.url },
    { label: "地点核验", url: place.sourceUrl },
    ...(dayGuide?.foodStops.map((stop) => ({ label: stop.sourceLabel, url: stop.sourceUrl })) ?? []),
    ...(dayGuide?.optional ? [{ label: dayGuide.optional.title, url: dayGuide.optional.sourceUrl }] : []),
  ].filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="place-detail-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside className="place-detail-panel" role="dialog" aria-modal="true" aria-labelledby="place-detail-title">
        <button ref={closeButtonRef} className="place-detail-close" type="button" onClick={onClose} aria-label="关闭地点详情">×</button>
        <div className={`place-detail-hero ${place.image ? "has-image" : "is-illustrated"}`}>
          {place.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.image.src} alt={place.image.alt} />
          ) : (
            <div className="place-detail-illustration" aria-hidden="true">
              <span>{place.category === "transport" ? "✈" : place.category === "coast" ? "≈" : place.category === "food" ? "♨" : "✦"}</span>
              <i /><i /><i />
            </div>
          )}
          <div className="place-detail-hero-caption">
            <span>DAY {dayId} · {place.city} · {categoryLabel[place.category]}</span>
            {place.image && <small>实景图 · 小红书 @{place.image.credit}</small>}
          </div>
        </div>

        <div className="place-detail-content">
          <h2 id="place-detail-title">{place.name}</h2>
          <p className="place-detail-lead">{place.why}</p>
          <div className="place-detail-facts">
            <span><b>建议时间</b>{place.activity.time}</span>
            <span><b>停留</b>{place.activity.duration}</span>
          </div>

          <section className="place-detail-section">
            <div className="place-detail-heading"><span>01</span><h3>到这里怎么玩</h3></div>
            <ol>{place.activity.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </section>

          <section className="place-detail-section place-detail-practical">
            <div className="place-detail-heading"><span>02</span><h3>现场提醒</h3></div>
            <ul>{place.activity.practical.map((tip) => <li key={tip}>{tip}</li>)}</ul>
            <p><b>九月退路</b>{place.activity.weather}</p>
          </section>

          {dayGuide && (
            <section className="place-detail-section day-deep-dive">
              <div className="place-detail-heading"><span>03</span><h3>这一天怎么串起来</h3></div>
              <h4>{dayGuide.headline}</h4>
              <div className="day-rhythm">{dayGuide.rhythm.map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div>
              <h4>顺路吃，不追店</h4>
              <div className="food-stop-list">
                {dayGuide.foodStops.map((stop) => (
                  <article key={stop.name} className="food-stop-card">
                    <div><strong>{stop.name}</strong><span>{stop.area} · {stop.when}</span></div>
                    <p>{stop.reason}</p>
                    <small>建议点：{stop.order.join(" · ")}</small>
                  </article>
                ))}
              </div>
              {dayGuide.optional && (
                <div className="optional-stop"><strong>{dayGuide.optional.title}</strong><p>{dayGuide.optional.detail}</p></div>
              )}
            </section>
          )}

          {isSanyaBase && (
            <section className="place-detail-section bay-comparison">
              <div className="place-detail-heading"><span>04</span><h3>为什么这次住海棠湾</h3></div>
              <div className="bay-grid">
                {hotelBayGuide.map((bay) => (
                  <article key={bay.bay} className={bay.bay === "海棠湾" ? "is-selected" : ""}>
                    <strong>{bay.bay}{bay.bay === "海棠湾" && <em>本次选择</em>}</strong>
                    <p>{bay.fit}</p>
                    <small>{bay.tradeoff}</small>
                  </article>
                ))}
              </div>
              <p className="hotel-official-note">君悦官网确认酒店位于海棠湾海滨，设有临海餐饮、泳池与度假设施；它适合作为连续三晚基地，而不是每天更换的打卡酒店。</p>
            </section>
          )}

          <footer className="place-detail-sources">
            <strong>资料来源</strong>
            <p>内容已整理在本页；以下链接仅用于复核原始资料。</p>
            <div>{sourceLinks.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>
          </footer>
        </div>
      </aside>
    </div>
  );
}

export function RouteMap({ selectedDay }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayerRef = useRef<LayerGroup | null>(null);
  const routeRendererRef = useRef<Canvas | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const playbackRendererRef = useRef<Canvas | null>(null);
  const playbackDriveRef = useRef<Polyline | null>(null);
  const playbackFlightRef = useRef<Polyline | null>(null);
  const travelerMarkerRef = useRef<Marker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const autoplayStartedRef = useRef(false);
  const autoplayTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playbackStatusRef = useRef<PlaybackStatus>("idle");
  const startPlaybackRef = useRef<(restart?: boolean) => void>(() => undefined);
  const pausePlaybackRef = useRef<() => void>(() => undefined);
  const resumePlaybackRef = useRef<() => void>(() => undefined);
  const [routeData, setRouteData] = useState<RouteCollection | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tilesFailed, setTilesFailed] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>("idle");
  const [visibleStage, setVisibleStage] = useState<PlaybackStage | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activePlaybackDay, setActivePlaybackDay] = useState<number | null>(null);
  const [placeDetail, setPlaceDetail] = useState<{ place: Place; dayId: number } | null>(null);

  const openPlaceDetail = useCallback((place: Place, dayId = firstDayForPlace(place.id)) => {
    pausePlaybackRef.current();
    setPlaceDetail({ place, dayId });
    const map = mapRef.current;
    if (!map) return;
    const zoom = place.id === "wuhan-airport" ? 8 : place.category === "transport" ? 9 : 10;
    map.flyTo([place.coordinates.lat, place.coordinates.lng], zoom, {
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      duration: 0.65,
      easeLinearity: 0.28,
    });
  }, []);

  const closePlaceDetail = useCallback(() => {
    setPlaceDetail(null);
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || playbackStatusRef.current !== "paused" || !visibleStage) return;
    const target = visibleStage.type === "stop"
      ? L.latLng(visibleStage.stop.place.coordinates.lat, visibleStage.stop.place.coordinates.lng)
      : travelerMarkerRef.current?.getLatLng();
    if (target) map.panTo(target, { animate: true, duration: 0.48, easeLinearity: 0.35 });
  }, [visibleStage]);

  const openDayDetail = useCallback((dayId: number) => {
    const route = getDayRoute(dayId);
    const preview = route.find((place) => !["transport", "stay"].includes(place.category)) ?? route[0];
    if (preview) openPlaceDetail(preview, dayId);
  }, [openPlaceDetail]);

  const activeFeatures = useMemo(
    () => selectedDay === null ? [] : routeData?.features.filter((feature) => feature.properties.dayId === selectedDay) ?? [],
    [routeData, selectedDay],
  );

  const playbackPlan = useMemo(
    () => routeData ? createPlaybackPlan(days, places, routeData.features) : [],
    [routeData],
  );
  const playbackStages = useMemo(() => createPlaybackStages(playbackPlan), [playbackPlan]);
  const totalPlaybackStops = useMemo(
    () => playbackPlan.reduce((total, day) => total + day.stops.length, 0),
    [playbackPlan],
  );

  useEffect(() => {
    let cancelled = false;
    let mapContainer: HTMLDivElement | null = null;
    async function initialize() {
      if (!containerRef.current || mapRef.current) return;
      try {
        const [L, response] = await Promise.all([
          import("leaflet"),
          fetch("/routes/hainan-east-coast.geojson"),
        ]);
        if (!response.ok) throw new Error(`Route data ${response.status}`);
        const data = (await response.json()) as RouteCollection;
        if (cancelled || !containerRef.current) return;

        leafletRef.current = L;
        mapContainer = containerRef.current;
        const map = L.map(mapContainer, {
          zoomControl: true,
          scrollWheelZoom: true,
          wheelDebounceTime: 60,
          wheelPxPerZoomLevel: 90,
          fadeAnimation: true,
          preferCanvas: true,
          minZoom: 4,
          maxZoom: 16,
        }).setView([19.2, 110], 7);

        const routeRenderer = L.canvas({ padding: 0.25, tolerance: 5 });
        const playbackPane = map.createPane("playbackPane");
        playbackPane.style.zIndex = "430";
        playbackPane.style.pointerEvents = "none";
        const playbackRenderer = L.canvas({ pane: "playbackPane", padding: 0.3, tolerance: 4 });
        const playbackDrive = L.polyline([], {
          renderer: playbackRenderer,
          color: "#ff6557",
          lineCap: "round",
          lineJoin: "round",
          opacity: 1,
          weight: 7,
        }).addTo(map);
        const playbackFlight = L.polyline([], {
          renderer: playbackRenderer,
          color: "#143747",
          dashArray: "7 11",
          lineCap: "round",
          lineJoin: "round",
          opacity: 1,
          weight: 5,
        }).addTo(map);
        const travelerIcon = L.divIcon({
          className: "journey-traveler-wrap",
          html: travelerIconHtml("flight"),
          iconAnchor: [23, 23],
          iconSize: [46, 46],
        });
        const travelerMarker = L.marker(
          [places[0].coordinates.lat, places[0].coordinates.lng],
          { icon: travelerIcon, interactive: false, keyboard: false, opacity: 0, zIndexOffset: 700 },
        ).addTo(map);
        const markZoomStart = () => mapContainer?.classList.add("is-map-zooming");
        const markZoomEnd = () => mapContainer?.classList.remove("is-map-zooming");
        map.on("zoomstart", markZoomStart);
        map.on("zoomend", markZoomEnd);

        const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
          updateWhenZooming: false,
          updateWhenIdle: true,
          updateInterval: 160,
          keepBuffer: 2,
        });
        tiles.on("tileerror", () => setTilesFailed(true));
        tiles.addTo(map);

        mapRef.current = map;
        routeRendererRef.current = routeRenderer;
        playbackRendererRef.current = playbackRenderer;
        playbackDriveRef.current = playbackDrive;
        playbackFlightRef.current = playbackFlight;
        travelerMarkerRef.current = travelerMarker;
        routeLayerRef.current = L.layerGroup().addTo(map);
        markerLayerRef.current = L.layerGroup().addTo(map);
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
      mapContainer?.classList.remove("is-map-zooming");
      mapRef.current = null;
      routeRendererRef.current = null;
      playbackRendererRef.current = null;
      playbackDriveRef.current = null;
      playbackFlightRef.current = null;
      travelerMarkerRef.current = null;
      routeLayerRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const routeGroup = routeLayerRef.current;
    const routeRenderer = routeRendererRef.current;
    const markerGroup = markerLayerRef.current;
    if (!L || !map || !routeGroup || !routeRenderer || !markerGroup || !routeData) return;

    routeGroup.clearLayers();
    markerGroup.clearLayers();

    routeData.features.forEach((feature) => {
      const isActive = selectedDay === null || feature.properties.dayId === selectedDay;
      const isOverview = selectedDay === null;
      const isFlight = feature.properties.mode === "flight";
      L.geoJSON(feature as GeoJsonObject, {
        renderer: routeRenderer,
        style: {
          color: isOverview ? "#4e9896" : isActive ? (isFlight ? "#143747" : "#ff6557") : "#7ebcb8",
          dashArray: isFlight ? "6 10" : undefined,
          lineCap: "round",
          lineJoin: "round",
          opacity: isOverview ? 0.3 : isActive ? 0.96 : 0.15,
          weight: isActive ? (isOverview ? 3 : 6) : 2,
        },
      }).addTo(routeGroup);
    });

    const visiblePlaces = uniquePlaces(selectedDay === null ? places : getDayRoute(selectedDay));
    visiblePlaces.forEach((place, index) => {
      const placeDay = selectedDay ?? firstDayForPlace(place.id);
      const markerSymbol = placeSymbol(place, index);
      const photoFlag = place.image ? '<em class="photo-flag">实景</em>' : "";
      const icon = L.divIcon({
        className: "map-marker-wrap",
        html: `<span class="map-marker marker-${place.category}${place.image ? " has-photo" : ""}"><b>${markerSymbol}</b>${photoFlag}</span>`,
        iconAnchor: [18, 18],
        iconSize: [36, 36],
      });
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon,
        title: `Day ${placeDay} · ${place.name}`,
        keyboard: true,
        riseOnHover: true,
      });
      marker
        .bindTooltip(`<strong>${escapeHtml(place.shortName)}</strong><small>${place.image ? "含匹配实景 · " : ""}点击在本页查看完整图文</small>`, {
          direction: "top",
          offset: [0, -14],
        })
        .on("click", () => {
          openPlaceDetail(place, placeDay);
        })
        .addTo(markerGroup);
    });

    const transportFeatures = routeData.features.filter((feature) => {
      if (selectedDay !== null) return feature.properties.dayId === selectedDay;
      return feature.properties.mode === "flight" || [1, 4, 7].includes(feature.properties.dayId);
    });
    transportFeatures.forEach((feature) => {
      const [lng, lat] = featureMarkerCoordinate(feature);
      const isFlight = feature.properties.mode === "flight";
      const transportIcon = L.divIcon({
        className: "transport-icon-wrap",
        html: `<span class="transport-icon transport-icon-${feature.properties.mode}"><b aria-hidden="true">${isFlight ? "✈" : "🚙"}</b><small>D${feature.properties.dayId}</small></span>`,
        iconAnchor: [18, 18],
        iconSize: [36, 36],
      });
      L.marker([lat, lng], {
        icon: transportIcon,
        keyboard: false,
        title: `${isFlight ? "航班" : "自驾"} · ${feature.properties.label}`,
        zIndexOffset: 300,
      }).bindTooltip(`<strong>${isFlight ? "航班" : "自驾"} · Day ${feature.properties.dayId}</strong><small>${escapeHtml(feature.properties.label)}</small>`, {
        direction: "top",
        offset: [0, -14],
      }).addTo(markerGroup);
    });

    if (selectedDay === null || selectedDay === 4) {
      const sanyaHotel = places.find((place) => place.id === "sanya-hyatt");
      if (sanyaHotel) {
        const changeIcon = L.divIcon({
          className: "hotel-change-marker-wrap",
          html: '<span class="hotel-change-marker"><b>DAY 4</b><span>⇄ 唯一换宿</span></span>',
          iconAnchor: [58, 54],
          iconSize: [116, 42],
        });
        L.marker([sanyaHotel.coordinates.lat, sanyaHotel.coordinates.lng], {
          icon: changeIcon,
          keyboard: false,
          title: "Day 4：从万宁君悦换到三亚海棠湾君悦",
          zIndexOffset: 450,
        }).addTo(markerGroup);
      }
    }

    const features = selectedDay === null ? routeData.features : activeFeatures;
    const bounds = selectedDay === null || selectedDay === 1 || selectedDay === 7
      ? L.latLngBounds(
          (selectedDay === null ? places : getDayRoute(selectedDay))
            .filter((place) => place.id !== "wuhan-airport")
            .map((place) => [place.coordinates.lat, place.coordinates.lng] as [number, number]),
        )
      : L.geoJSON({ type: "FeatureCollection", features } as GeoJsonObject).getBounds();
    if (bounds.isValid()) {
      const mobile = window.innerWidth <= 820;
      map.fitBounds(bounds, {
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        duration: 0.65,
        maxZoom: selectedDay === null ? 8 : selectedDay === 1 || selectedDay === 7 ? 9 : 10,
        paddingTopLeft: mobile ? [24, 100] : [390, 95],
        paddingBottomRight: mobile ? [24, 120] : [80, 80],
      });
    }

    if (selectedDay !== null) animateRoute(map);
    window.setTimeout(() => map.invalidateSize(), 50);
  }, [activeFeatures, openPlaceDetail, routeData, selectedDay]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const driveLine = playbackDriveRef.current;
    const flightLine = playbackFlightRef.current;
    const traveler = travelerMarkerRef.current;
    if (!L || !map || !driveLine || !flightLine || !traveler || status !== "ready" || playbackStages.length === 0) return;

    let cancelled = false;
    let stageIndex = 0;
    let stageElapsed = 0;
    let lastTimestamp: number | null = null;
    let lastCameraUpdate = 0;
    let lastProgressUpdate = 0;
    let completedLines: Record<PlaybackMode, RouteCoordinate[][]> = { drive: [], flight: [] };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateStatus = (next: PlaybackStatus) => {
      playbackStatusRef.current = next;
      setPlaybackStatus(next);
    };

    const setTravelerIcon = (modeOrKind: PlaybackMode | PlaybackKind) => {
      traveler.setIcon(L.divIcon({
        className: "journey-traveler-wrap",
        html: travelerIconHtml(modeOrKind),
        iconAnchor: [23, 23],
        iconSize: [46, 46],
      }));
    };

    const setModeLine = (mode: PlaybackMode, current?: RouteCoordinate[]) => {
      const lines = current?.length ? [...completedLines[mode], current] : completedLines[mode];
      (mode === "drive" ? driveLine : flightLine).setLatLngs(toLeafletLines(lines));
    };

    const resetVisuals = () => {
      completedLines = { drive: [], flight: [] };
      driveLine.setLatLngs([]);
      flightLine.setLatLngs([]);
      traveler.setOpacity(0);
      setVisibleStage(null);
      setActivePlaybackDay(null);
      setPlaybackProgress(0);
    };

    const focusStop = (stage: Extract<PlaybackStage, { type: "stop" }>) => {
      const { place, kind } = stage.stop;
      const position = L.latLng(place.coordinates.lat, place.coordinates.lng);
      const nextMode = playbackPlan[stage.dayIndex].segments[stage.stopIndex]?.mode;
      setTravelerIcon(kind === "transport" && nextMode ? nextMode : kind);
      traveler.setLatLng(position);
      traveler.setOpacity(0);

      const zoom = place.id === "wuhan-airport" ? 8 : place.category === "transport" ? 9 : 10;
      if (reducedMotion) map.setView(position, zoom, { animate: false });
      else map.flyTo(position, zoom, { animate: true, duration: 0.82, easeLinearity: 0.24 });
    };

    const enterStage = (nextIndex: number) => {
      const stage = playbackStages[nextIndex];
      stageIndex = nextIndex;
      stageElapsed = 0;
      lastTimestamp = null;
      setVisibleStage(stage);
      setActivePlaybackDay(playbackPlan[stage.dayIndex].dayId);

      if (stage.type === "stop") focusStop(stage);
      else {
        setTravelerIcon(stage.segment.mode);
        traveler.setOpacity(0);
      }
    };

    const renderTravel = (
      stage: Extract<PlaybackStage, { type: "travel" }>,
      progress: number,
      timestamp: number,
    ) => {
      const coordinates = stage.segment.coordinates;
      const scaled = Math.min(1, progress) * (coordinates.length - 1);
      const lowerIndex = Math.floor(scaled);
      const upperIndex = Math.min(coordinates.length - 1, lowerIndex + 1);
      const fraction = scaled - lowerIndex;
      const from = coordinates[lowerIndex];
      const to = coordinates[upperIndex];
      const head: RouteCoordinate = [
        from[0] + (to[0] - from[0]) * fraction,
        from[1] + (to[1] - from[1]) * fraction,
      ];
      const partial = coordinates.slice(0, lowerIndex + 1);
      if (upperIndex !== lowerIndex) partial.push(head);
      setModeLine(stage.segment.mode, partial);

      const position = L.latLng(head[1], head[0]);
      traveler.setLatLng(position);
      if (!reducedMotion && timestamp - lastCameraUpdate >= 280) {
        lastCameraUpdate = timestamp;
        map.panTo(position, {
          animate: true,
          duration: 0.42,
          easeLinearity: 0.45,
          noMoveStart: true,
        });
      }
    };

    const finalizeStage = (stage: PlaybackStage) => {
      if (stage.type !== "travel") return;
      completedLines[stage.segment.mode].push(stage.segment.coordinates);
      setModeLine(stage.segment.mode);
    };

    const finishPlayback = () => {
      updateStatus("complete");
      setPlaybackProgress(100);
      const allBounds = L.latLngBounds(places.map((place) => [place.coordinates.lat, place.coordinates.lng]));
      if (allBounds.isValid()) {
        map.fitBounds(allBounds, {
          animate: !reducedMotion,
          duration: 0.9,
          maxZoom: 6,
          paddingTopLeft: window.innerWidth <= 820 ? [24, 100] : [390, 95],
          paddingBottomRight: [60, 90],
        });
      }
    };

    const tick = (timestamp: number) => {
      if (cancelled) return;
      if (playbackStatusRef.current === "playing") {
        const stage = playbackStages[stageIndex];
        if (lastTimestamp === null) lastTimestamp = timestamp;
        const delta = Math.min(50, timestamp - lastTimestamp);
        lastTimestamp = timestamp;
        stageElapsed += delta;
        const duration = reducedMotion
          ? stage.type === "travel" ? 160 : 650
          : stage.durationMs;
        const progress = Math.min(1, stageElapsed / duration);

        if (stage.type === "travel") renderTravel(stage, reducedMotion ? 1 : progress, timestamp);
        if (timestamp - lastProgressUpdate >= 120 || progress >= 1) {
          lastProgressUpdate = timestamp;
          setPlaybackProgress(((stageIndex + progress) / playbackStages.length) * 100);
        }

        if (progress >= 1) {
          finalizeStage(stage);
          if (stageIndex >= playbackStages.length - 1) finishPlayback();
          else enterStage(stageIndex + 1);
        }
      } else {
        lastTimestamp = null;
      }
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    startPlaybackRef.current = (restart = true) => {
      if (!restart && playbackStatusRef.current === "paused") {
        updateStatus("playing");
        return;
      }
      setPlaceDetail(null);
      resetVisuals();
      enterStage(0);
      updateStatus("playing");
    };
    pausePlaybackRef.current = () => {
      if (playbackStatusRef.current === "playing") updateStatus("paused");
    };
    resumePlaybackRef.current = () => {
      if (playbackStatusRef.current === "paused") updateStatus("playing");
    };

    const pauseForManualMap = () => pausePlaybackRef.current();
    map.on("dragstart", pauseForManualMap);
    animationFrameRef.current = window.requestAnimationFrame(tick);

    if (selectedDay !== null) {
      resetVisuals();
      updateStatus("idle");
    } else if (!reducedMotion && !autoplayStartedRef.current) {
      autoplayStartedRef.current = true;
      autoplayTimerRef.current = window.setTimeout(() => startPlaybackRef.current(true), 800);
    }

    return () => {
      cancelled = true;
      map.off("dragstart", pauseForManualMap);
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
      if (autoplayTimerRef.current !== null) window.clearTimeout(autoplayTimerRef.current);
      animationFrameRef.current = null;
      autoplayTimerRef.current = null;
    };
  }, [playbackPlan, playbackStages, selectedDay, status]);

  const togglePlayback = () => {
    if (playbackStatusRef.current === "playing") pausePlaybackRef.current();
    else if (playbackStatusRef.current === "paused") resumePlaybackRef.current();
    else startPlaybackRef.current(true);
  };

  const primaryPlaybackLabel = playbackStatus === "playing" ? "暂停"
    : playbackStatus === "paused" ? "继续"
      : playbackStatus === "complete" ? "再次播放"
        : "播放";
  const activeStageDay = visibleStage ? playbackPlan[visibleStage.dayIndex] : null;
  const stageKind: PlaybackKind = visibleStage?.type === "stop" ? visibleStage.stop.kind : "transport";
  const stageMeta = playbackMeta[stageKind];
  const stagePlace = visibleStage?.type === "stop" ? visibleStage.stop.place : visibleStage?.segment.to.place;
  const stopNextMode = visibleStage?.type === "stop"
    ? playbackPlan[visibleStage.dayIndex].segments[visibleStage.stopIndex]?.mode
    : undefined;
  const cameraModeOrKind: PlaybackMode | PlaybackKind = visibleStage?.type === "travel"
    ? visibleStage.segment.mode
    : visibleStage?.type === "stop" && visibleStage.stop.kind === "transport" && stopNextMode
      ? stopNextMode
      : visibleStage?.type === "stop"
        ? visibleStage.stop.kind
        : "drive";
  const routeLabel = visibleStage && selectedDay === null
    ? visibleStage.type === "travel"
      ? `${visibleStage.segment.mode === "flight" ? "✈" : "🚙"} ${visibleStage.segment.from.place.shortName} → ${visibleStage.segment.to.place.shortName}`
      : `${stageMeta.glyph} ${stageMeta.verb} · ${visibleStage.stop.place.shortName}`
    : selectedDay === null
      ? "✈ 武汉 → 海口 · 🚙 海南东线 · ✈ 三亚 → 武汉"
      : activeFeatures.map((feature) => `${feature.properties.mode === "flight" ? "✈" : "🚙"} ${feature.properties.label}`).join(" · ") || `Day ${selectedDay}`;

  return (
    <div className="map-layer" data-playback-status={playbackStatus}>
      <div
        ref={containerRef}
        className="route-map-canvas"
        role="region"
        aria-label={selectedDay === null ? "Day 1 到 Day 7 完整动态路线地图" : `Day ${selectedDay} 动态路线地图`}
      />

      {visibleStage && selectedDay === null && (playbackStatus === "playing" || playbackStatus === "paused") && (
        <div className={`journey-camera-lock ${placeDetail ? "is-previewing" : ""}`} aria-hidden="true">
          <span className={`journey-traveler journey-traveler-${cameraModeOrKind}`}>
            <i />
            <b>{travelerGlyph(cameraModeOrKind)}</b>
          </span>
        </div>
      )}

      {selectedDay === null && (
        <div className="playback-timeline-shell">
          <span className="playback-progress-track" aria-hidden="true">
            <span className="playback-progress-fill" style={{ transform: `scaleX(${playbackProgress / 100})` }} />
          </span>
          <ol className="playback-timeline" aria-label="Day 1 到 Day 7 播放进度">
            {playbackPlan.map((day) => {
              const isActive = activePlaybackDay === day.dayId;
              const isComplete = playbackStatus === "complete" || (activePlaybackDay !== null && day.dayId < activePlaybackDay);
              return (
                <li key={day.dayId} className={[isActive ? "is-active" : "", isComplete ? "is-complete" : ""].filter(Boolean).join(" ")} aria-current={isActive ? "step" : undefined}>
                  <button className="playback-day-button" type="button" onClick={() => openDayDetail(day.dayId)} aria-label={`查看 Day ${day.dayId} 完整图文`}>
                    <b>D{day.dayId}</b>
                    <small>{day.dateLabel}</small>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {visibleStage && stagePlace && selectedDay === null && (
        <aside
          key={`${visibleStage.type}-${visibleStage.dayIndex}-${visibleStage.type === "stop" ? visibleStage.stopIndex : visibleStage.segmentIndex}`}
          className={`playback-stop-card is-${visibleStage.type} kind-${stageKind}`}
          data-playback-stage={visibleStage.type}
          aria-live="polite"
        >
          <div className={`playback-stop-visual ${stagePlace.image ? "has-image" : ""}`}>
            {/* Local, source-matched travel photography keeps its original public path. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {stagePlace.image && <img src={stagePlace.image.src} alt={stagePlace.image.alt} />}
            <div className={`activity-motion activity-motion-${stageKind}`} aria-hidden="true">
              <span>{visibleStage.type === "travel" && visibleStage.segment.mode === "drive" ? "🚙" : visibleStage.type === "travel" ? "✈" : stageMeta.glyph}</span>
              <i /><i /><i />
            </div>
          </div>
          <div className="playback-stop-body">
            <div className="playback-stop-kicker">
              <span>DAY {activeStageDay?.dayId} · {visibleStage.type === "travel" ? "行进中" : stageMeta.label}</span>
              <span>{playbackStatus === "complete" ? "旅程完成" : visibleStage.type === "stop" ? `${visibleStage.stopNumber}/${totalPlaybackStops}` : "镜头跟随"}</span>
            </div>
            <h2>{visibleStage.type === "travel" ? `前往${stagePlace.shortName}` : stagePlace.name}</h2>
            <p>{visibleStage.type === "travel"
              ? `${visibleStage.segment.from.place.shortName} → ${visibleStage.segment.to.place.shortName}，路线正在实时绘制。`
              : stagePlace.why}</p>
            <div className="playback-stop-facts">
              <span><b>{visibleStage.type === "travel" ? "方式" : "建议时间"}</b>{visibleStage.type === "travel" ? visibleStage.segment.mode === "flight" ? "航班" : "自驾" : stagePlace.activity.time}</span>
              <span><b>{visibleStage.type === "travel" ? "下一站" : "停留"}</b>{visibleStage.type === "travel" ? stagePlace.shortName : stagePlace.activity.duration}</span>
            </div>
            <button className="playback-detail-button" type="button" onClick={() => openPlaceDetail(stagePlace, activeStageDay?.dayId)}>查看完整图文 <span aria-hidden="true">↗</span></button>
          </div>
        </aside>
      )}

      {placeDetail && <PlaceDetailDialog place={placeDetail.place} dayId={placeDetail.dayId} onClose={closePlaceDetail} />}

      <div className="map-route-label">
        <span>{activePlaybackDay && selectedDay === null ? `DAY ${activePlaybackDay}` : selectedDay === null ? "DAY 1—7" : `DAY ${selectedDay}`}</span>
        <strong>{routeLabel}</strong>
        <div className="playback-controls" role="group" aria-label="旅程播放控制">
          <button type="button" onClick={togglePlayback} disabled={status !== "ready" || selectedDay !== null} aria-label={`${primaryPlaybackLabel}七日旅程动画`}>
            {playbackStatus === "playing" ? "Ⅱ" : "▶"} {primaryPlaybackLabel}
          </button>
          <button type="button" onClick={() => startPlaybackRef.current(true)} disabled={status !== "ready" || selectedDay !== null}>↺ 重播</button>
        </div>
      </div>

      <div className="map-legend" aria-label="地图图例">
        <span><i className="solid" />🚙 自驾</span>
        <span><i className="dashed" />✈ 航班</span>
        <span><i className="photo" />实景图</span>
        <span><i className="change" />Day 4 换宿</span>
      </div>

      {status === "loading" && <div className="map-status" role="status">正在连接 Day 1–7 完整路线…</div>}
      {status === "error" && (
        <div className="map-status map-error" role="alert">
          <strong>地图底图暂未加载</strong>
          <span>本地路线与两基地文字计划仍可浏览。</span>
        </div>
      )}
      {tilesFailed && status === "ready" && <div className="tile-note">底图网络较慢，本地路线与节点仍可点击。</div>}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeoJsonObject } from "geojson";
import type { Canvas, LayerGroup, Map as LeafletMap, Marker, Polyline } from "leaflet";
import { getPlanDayRoute, places, type Day, type ItineraryPlan, type Place, type TravelLegMode } from "./trip-data";
import { getDayGuide } from "./trip-details";
import { modeLabel } from "./trip-legs";
import {
  cameraForArrival,
  cameraForTravel,
  pointOutsideCameraComfortZone,
  travelCameraFollow,
  travelStageProgress,
} from "./trip-camera";
import { buildJourneyPhotoItems, type JourneyPhotoItem } from "./journey-photos";
import { sampleRouteAtProgress } from "./trip-motion";
import { withBasePath } from "./site-paths";
import { PlacePhotoGallery } from "./PlacePhotoGallery";
import { SocialInspirationGallery } from "./SocialInspirationGallery";
import { SocialVideoGallery } from "./SocialVideoGallery";
import { PrivateSocialGallery } from "./PrivateSocialGallery";
import { PlaceDecisionTabs } from "./PlaceDecisionTabs";
import {
  createRouteContext,
  createPlaybackPlan,
  createPlaybackStages,
  requiresManualArrival,
  type PlaybackKind,
  type PlaybackMode,
  type RouteContext,
  type PlaybackStage,
  type RouteCoordinate,
} from "./trip-playback";

type RouteFeature = {
  type: "Feature";
  properties: {
    dayId: number;
    legId: string;
    mode: PlaybackMode;
    label: string;
    distanceKm: number | null;
    durationMinutes?: number | null;
    durationHours: number | null;
    routeLegs?: Array<{ index: number; distanceKm: number; durationMinutes: number }>;
    source?: string;
  };
  geometry: { type: "LineString"; coordinates: number[][] };
};

type RouteCollection = { type: "FeatureCollection"; features: RouteFeature[] };

type RouteMapProps = { selectedDay: number | null; plan: ItineraryPlan };

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

function firstDayForPlace(schedule: Day[], placeId: string) {
  return schedule.find((day) => day.placeIds.includes(placeId))?.id ?? 1;
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
      : modeOrKind === "walk" ? "🚶"
        : playbackMeta[modeOrKind].glyph;
}

function routeModeGlyph(mode: TravelLegMode | PlaybackMode) {
  if (mode === "flight") return "✈";
  if (mode === "drive") return "🚙";
  if (mode === "walk") return "🚶";
  if (mode === "boat") return "⛴";
  return "＋";
}

function travelerIconHtml(modeOrKind: PlaybackMode | PlaybackKind) {
  const glyph = travelerGlyph(modeOrKind);
  return `<span class="journey-traveler journey-traveler-${modeOrKind}"><i></i><b>${glyph}</b></span>`;
}

function toLeafletLines(lines: RouteCoordinate[][]) {
  return lines.map((line) => line.map(([lng, lat]) => [lat, lng] as [number, number]));
}

function JourneyStartGate({ ready, onStart, activePlan }: { ready: boolean; onStart: () => void; activePlan: "A" | "B" }) {
  return (
    <section className="journey-start-gate" aria-labelledby="journey-start-title">
      <div className="journey-start-route" aria-hidden="true">
        <span>武汉</span><i>✈</i><span>海南东线</span><i>🚙</i><span>三亚</span>
      </div>
      <p>一张地图，慢慢走完</p>
      <h2 id="journey-start-title">海南七日旅程</h2>
      <div className="journey-start-facts">
        <span><b>7</b>天 6 晚</span>
        <span><b>3</b>个住宿基地</span>
        <span><b>2</b>晚住万宁</span>
      </div>
      <button type="button" onClick={onStart} disabled={!ready}>
        <span>{ready ? `开始七日旅程 · Plan ${activePlan}` : "正在准备路线"}</span>
        <i aria-hidden="true">→</i>
      </button>
      <small>到达关键地点会自动停下，等你看完再继续</small>
    </section>
  );
}

function JourneyPhotoRail({
  items,
  activeId,
  onOpen,
}: {
  items: JourneyPhotoItem[];
  activeId: string | null;
  onOpen: (item: JourneyPhotoItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!activeId || collapsed) return;
    cardRefs.current.get(activeId)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId, collapsed]);

  const moveRail = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(220, track.clientWidth * 0.72),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section className={`journey-photo-rail ${collapsed ? "is-collapsed" : ""}`} aria-label="旅程图片概览">
      <header className="journey-photo-header">
        <div>
          <span>XHS JOURNEY</span>
          <strong>照片旅程</strong>
          <small>点开照片，地图会回到对应地点</small>
        </div>
        <nav aria-label="图片概览控制">
          <button type="button" onClick={() => moveRail(-1)}>上一组</button>
          <button type="button" onClick={() => moveRail(1)}>下一组</button>
          <button type="button" onClick={() => setCollapsed((value) => !value)}>{collapsed ? "展开照片" : "收起"}</button>
        </nav>
      </header>
      <div ref={trackRef} className="journey-photo-track">
        {items.map((item) => (
          <button
            key={item.id}
            ref={(node) => {
              if (node) cardRefs.current.set(item.id, node);
              else cardRefs.current.delete(item.id);
            }}
            className={`journey-photo-card ${item.id === activeId ? "is-active" : ""}`}
            type="button"
            aria-label={`查看 Day ${item.dayId} ${item.place.name}完整图文`}
            aria-pressed={item.id === activeId}
            onClick={() => onOpen(item)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(item.photo.src)} alt={item.photo.alt} loading="lazy" decoding="async" />
            <span className="journey-photo-day">DAY {item.dayId}</span>
            <span className={`journey-photo-source is-${item.photo.platform === "小红书" ? "xhs" : "official"}`}>{item.photo.platform}</span>
            <span className="journey-photo-caption"><b>{item.place.shortName}</b><small>{item.kind === "hotel" ? "住宿基地" : item.place.city}</small></span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PlaceDetailDialog({
  place,
  dayId,
  planId,
  routeContext,
  schedule,
  arrivalMode,
  onClose,
  onContinue,
}: {
  place: Place;
  dayId: number;
  planId: "A" | "B";
  routeContext: RouteContext;
  schedule: Day[];
  arrivalMode: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dayGuide = getDayGuide(dayId);
  const nextLeg = schedule.find((day) => day.id === dayId)?.legs.find((leg) => leg.fromIndex === routeContext.position - 1);
  const sourceLinks = [
    ...(place.image ? [{ label: `图片来源 · ${place.image.platform} · ${place.image.credit}`, url: place.image.creditUrl }] : []),
    ...(place.gallery?.map((photo) => ({ label: `图片来源 · ${photo.platform} · ${photo.credit}`, url: photo.creditUrl })) ?? []),
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
        <div className={`place-detail-hero ${place.image ? "has-image" : "is-illustrated"} ${(place.gallery?.length ?? 0) > 0 ? "has-gallery" : ""}`}>
          {place.image ? (
            <PlacePhotoGallery
              placeName={place.name}
              photos={[place.image, ...(place.gallery ?? [])]}
              dayId={dayId}
              city={place.city}
              category={categoryLabel[place.category]}
            />
          ) : (
            <div className="place-detail-illustration" aria-hidden="true">
              <span>{place.category === "transport" ? "✈" : place.category === "coast" ? "≈" : place.category === "food" ? "♨" : "✦"}</span>
              <i /><i /><i />
            </div>
          )}
          {!place.image && <div className="place-detail-hero-caption"><span>DAY {dayId} · {place.city} · {categoryLabel[place.category]}</span></div>}
        </div>

        <div className="place-detail-content">
          <section className="place-detail-route-context" aria-label="当前地点在当天路线中的位置">
            <div className="place-detail-route-heading">
              <span>DAY {routeContext.dayId} · 第 {routeContext.position}/{routeContext.total} 站</span>
              <strong>{routeContext.dayTitle}</strong>
            </div>
            <div className="place-detail-route-band">
              <div className={!routeContext.previous ? "is-empty" : ""}>
                <small>上一站</small>
                <b>{routeContext.previous?.place.shortName ?? "当天起点"}</b>
              </div>
              <i aria-hidden="true">→</i>
              <div className="is-current">
                <small>现在</small>
                <b>{routeContext.current.place.shortName}</b>
              </div>
              <i aria-hidden="true">→</i>
              <div className={!routeContext.next ? "is-empty" : ""}>
                <small>下一站</small>
                <b>{routeContext.next?.place.shortName ?? "今日完成"}</b>
                {routeContext.nextMode && <em>{modeLabel(routeContext.nextMode)}</em>}
              </div>
            </div>
            {nextLeg && (
              <div className="place-detail-next-leg">
                <span>{routeModeGlyph(nextLeg.mode)}</span>
                <p><small>前往下一站</small><b>{modeLabel(nextLeg.mode)} · {nextLeg.durationLabel}</b></p>
                <em>{nextLeg.distanceLabel}</em>
              </div>
            )}
            <div className="place-detail-remaining">
              <small>今日剩余</small>
              <div>{routeContext.remaining.length > 0
                ? routeContext.remaining.map((stop, index) => <span key={`${stop.place.id}-${index}`}>{stop.place.shortName}</span>)
                : <span className="is-complete">今日路线已完成</span>}</div>
            </div>
          </section>
          <h2 id="place-detail-title">{place.name}</h2>
          <p className="place-detail-lead">{place.why}</p>
          <div className="place-detail-facts">
            <span><b>建议时间</b>{place.activity.time}</span>
            <span><b>停留</b>{place.activity.duration}</span>
          </div>

          <PlaceDecisionTabs dayId={dayId} planId={planId} placeId={place.id} />

          <SocialVideoGallery city={place.city} />
          {process.env.NEXT_PUBLIC_PRIVATE_MEDIA === "1"
            ? <PrivateSocialGallery key={place.id} placeId={place.id} placeName={place.name} city={place.city} />
            : <SocialInspirationGallery city={place.city} />}

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
              <h4>顺路吃 · 小红书高互动与位置双核验</h4>
              <div className="food-stop-list">
                {dayGuide.foodStops.map((stop) => (
                  <article key={stop.name} className="food-stop-card">
                    <div><strong>{stop.name}</strong><span>{stop.area} · {stop.when}</span></div>
                    <em className={`food-evidence is-${stop.evidence.kind}`}>{stop.evidence.label}</em>
                    <p>{stop.reason}</p>
                    <small>建议点：{stop.order.join(" · ")}</small>
                    <p className="food-caution"><b>避雷/核验</b>{stop.caution}</p>
                    <nav className="food-stop-actions" aria-label={`${stop.name}资料`}>
                      <a href={stop.sourceUrl} target="_blank" rel="noreferrer">查看笔记依据 ↗</a>
                      <a href={stop.mapUrl} target="_blank" rel="noreferrer">地图导航 ↗</a>
                    </nav>
                  </article>
                ))}
              </div>
              {dayGuide.optional && (
                <div className="optional-stop"><strong>{dayGuide.optional.title}</strong><p>{dayGuide.optional.detail}</p></div>
              )}
            </section>
          )}

          <footer className="place-detail-sources">
            <strong>资料来源</strong>
            <p>内容已整理在本页；以下链接仅用于复核原始资料。</p>
            <div>{sourceLinks.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>
          </footer>
          {arrivalMode && (
            <div className="place-detail-continue-wrap">
              <p><b>这一站已抵达</b><span>看完后，路线会从这里接着走。</span></p>
              <button className="place-detail-continue" type="button" onClick={onContinue}>
                继续前往下一站 <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export function RouteMap({ selectedDay, plan }: RouteMapProps) {
  const schedule = plan.schedule;
  const planHotels = plan.hotels;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayerRef = useRef<LayerGroup | null>(null);
  const routeRendererRef = useRef<Canvas | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const playbackRendererRef = useRef<Canvas | null>(null);
  const playbackDriveRef = useRef<Polyline | null>(null);
  const playbackFlightRef = useRef<Polyline | null>(null);
  const playbackWalkRef = useRef<Polyline | null>(null);
  const travelerMarkerRef = useRef<Marker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playbackStatusRef = useRef<PlaybackStatus>("idle");
  const arrivalStageIndexRef = useRef<number | null>(null);
  const acknowledgedArrivalStagesRef = useRef<Set<number>>(new Set());
  const startPlaybackRef = useRef<(restart?: boolean) => void>(() => undefined);
  const pausePlaybackRef = useRef<() => void>(() => undefined);
  const resumePlaybackRef = useRef<() => void>(() => undefined);
  const continueArrivalRef = useRef<() => void>(() => undefined);
  const [routeData, setRouteData] = useState<RouteCollection | null>(null);
  const [loadedRoutePath, setLoadedRoutePath] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tilesFailed, setTilesFailed] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>("idle");
  const [visibleStage, setVisibleStage] = useState<PlaybackStage | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activePlaybackDay, setActivePlaybackDay] = useState<number | null>(null);
  const [travelPhase, setTravelPhase] = useState<"camera" | "moving" | null>(null);
  const [arrivalStageIndex, setArrivalStageIndex] = useState<number | null>(null);
  const [placeDetail, setPlaceDetail] = useState<{ place: Place; dayId: number; arrivalMode: boolean; stopIndex?: number } | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const routeIsReady = status === "ready" && loadedRoutePath === plan.routePath;

  const openPlaceDetail = useCallback((place: Place, dayId = firstDayForPlace(schedule, place.id)) => {
    pausePlaybackRef.current();
    travelerMarkerRef.current?.setOpacity(0);
    setPlaceDetail({ place, dayId, arrivalMode: false });
    const map = mapRef.current;
    if (!map) return;
    const camera = cameraForArrival(place);
    map.flyTo([place.coordinates.lat, place.coordinates.lng], camera.zoom, {
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      duration: camera.duration,
      easeLinearity: 0.28,
    });
  }, [schedule]);

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
    const route = getPlanDayRoute(schedule, dayId);
    const preview = route.find((place) => !["transport", "stay"].includes(place.category)) ?? route[0];
    if (preview) openPlaceDetail(preview, dayId);
  }, [openPlaceDetail, schedule]);

  const activeFeatures = useMemo(
    () => selectedDay === null || loadedRoutePath !== plan.routePath ? [] : routeData?.features.filter((feature) => feature.properties.dayId === selectedDay) ?? [],
    [loadedRoutePath, plan.routePath, routeData, selectedDay],
  );

  const playbackPlan = useMemo(
    () => routeData && loadedRoutePath === plan.routePath ? createPlaybackPlan(schedule, places, routeData.features) : [],
    [loadedRoutePath, plan.routePath, routeData, schedule],
  );
  const playbackStages = useMemo(() => createPlaybackStages(playbackPlan), [playbackPlan]);
  const detailRouteContext = useMemo(() => {
    if (!placeDetail) return null;
    const day = playbackPlan.find((item) => item.dayId === placeDetail.dayId);
    if (!day) return null;
    const stopIndex = placeDetail.stopIndex
      ?? day.stops.findIndex((stop) => stop.place.id === placeDetail.place.id);
    return stopIndex >= 0 ? createRouteContext(day, stopIndex) : null;
  }, [placeDetail, playbackPlan]);
  const totalPlaybackStops = useMemo(
    () => playbackPlan.reduce((total, day) => total + day.stops.length, 0),
    [playbackPlan],
  );
  const journeyPhotoItems = useMemo(() => buildJourneyPhotoItems(schedule, places), [schedule]);

  useEffect(() => {
    let cancelled = false;
    let mapContainer: HTMLDivElement | null = null;
    async function initialize() {
      if (!containerRef.current || mapRef.current) return;
      try {
        const L = await import("leaflet");
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
        const playbackWalk = L.polyline([], {
          renderer: playbackRenderer,
          color: "#2e7773",
          dashArray: "3 8",
          lineCap: "round",
          lineJoin: "round",
          opacity: 1,
          weight: 6,
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
        playbackWalkRef.current = playbackWalk;
        travelerMarkerRef.current = travelerMarker;
        routeLayerRef.current = L.layerGroup().addTo(map);
        markerLayerRef.current = L.layerGroup().addTo(map);
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
      playbackWalkRef.current = null;
      travelerMarkerRef.current = null;
      routeLayerRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(withBasePath(plan.routePath))
      .then((response) => {
        if (!response.ok) throw new Error(`Route data ${response.status}`);
        return response.json() as Promise<RouteCollection>;
      })
      .then((data) => {
        if (cancelled) return;
        setRouteData(data);
        setLoadedRoutePath(plan.routePath);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [plan.routePath]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const routeGroup = routeLayerRef.current;
    const routeRenderer = routeRendererRef.current;
    const markerGroup = markerLayerRef.current;
    if (!L || !map || !routeGroup || !routeRenderer || !markerGroup || !routeData || !routeIsReady) return;

    routeGroup.clearLayers();
    markerGroup.clearLayers();
    const planColor = plan.color;
    playbackDriveRef.current?.setStyle({ color: planColor });

    routeData.features.forEach((feature) => {
      const isActive = selectedDay === null || feature.properties.dayId === selectedDay;
      const isOverview = selectedDay === null;
      const isFlight = feature.properties.mode === "flight";
      const isWalk = feature.properties.mode === "walk";
      L.geoJSON(feature as GeoJsonObject, {
        renderer: routeRenderer,
        style: {
          color: isOverview ? planColor : isActive ? (isFlight ? "#143747" : isWalk ? "#2e7773" : planColor) : "#7ebcb8",
          dashArray: isFlight ? "6 10" : isWalk ? "3 8" : undefined,
          lineCap: "round",
          lineJoin: "round",
          opacity: isOverview ? 0.3 : isActive ? 0.96 : 0.15,
          weight: isActive ? (isOverview ? 3 : 6) : 2,
        },
      } as L.GeoJSONOptions & { renderer: Canvas }).addTo(routeGroup);
    });

    const itineraryPlaces = uniquePlaces(schedule.flatMap((day) => getPlanDayRoute(schedule, day.id)));
    const visiblePlaces = uniquePlaces(selectedDay === null ? itineraryPlaces : getPlanDayRoute(schedule, selectedDay));
    visiblePlaces.forEach((place, index) => {
      const placeDay = selectedDay ?? firstDayForPlace(schedule, place.id);
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
      if (selectedDay !== null) return false;
      return feature.properties.mode === "flight" || [1, 2, 4, 6, 7].includes(feature.properties.dayId);
    });
    transportFeatures.forEach((feature) => {
      const [lng, lat] = featureMarkerCoordinate(feature);
      const glyph = routeModeGlyph(feature.properties.mode);
      const label = modeLabel(feature.properties.mode);
      const transportIcon = L.divIcon({
        className: "transport-icon-wrap",
        html: `<span class="transport-icon transport-icon-${feature.properties.mode}"><b aria-hidden="true">${glyph}</b><small>D${feature.properties.dayId}</small></span>`,
        iconAnchor: [18, 18],
        iconSize: [36, 36],
      });
      L.marker([lat, lng], {
        icon: transportIcon,
        keyboard: false,
        title: `${label} · ${feature.properties.label}`,
        zIndexOffset: 300,
      }).bindTooltip(`<strong>${escapeHtml(label)} · Day ${feature.properties.dayId}</strong><small>${escapeHtml(feature.properties.label)}</small>`, {
        direction: "top",
        offset: [0, -14],
      }).addTo(markerGroup);
    });

    const hotelChanges = planHotels.slice(1).map((hotel, index) => {
      const hotelPlace = places.find((place) => place.hotelId === hotel.id);
      return {
        dayId: hotel.checkInDay,
        placeId: hotelPlace?.id ?? hotel.id,
        title: `从${planHotels[index].name}换到${hotel.name}`,
        label: `第${index + 1}次换宿`,
      };
    });
    hotelChanges.forEach((change) => {
      if (selectedDay === null || selectedDay === change.dayId) {
        const hotelPlace = places.find((place) => place.id === change.placeId);
        if (!hotelPlace) return;
        const changeIcon = L.divIcon({
          className: "hotel-change-marker-wrap",
          html: `<span class="hotel-change-marker"><b>DAY ${change.dayId}</b><span>⇄ ${change.label}</span></span>`,
          iconAnchor: [58, 54],
          iconSize: [116, 42],
        });
        L.marker([hotelPlace.coordinates.lat, hotelPlace.coordinates.lng], {
          icon: changeIcon,
          keyboard: false,
          title: `Day ${change.dayId}：${change.title}`,
          zIndexOffset: 450,
        }).addTo(markerGroup);
      }
    });

    if (selectedDay !== null) {
      const selectedPlaybackDay = playbackPlan.find((day) => day.dayId === selectedDay);
      const dayLegs = schedule.find((day) => day.id === selectedDay)?.legs ?? [];
      const driveMetrics = routeData.features
        .filter((feature) => feature.properties.dayId === selectedDay && feature.properties.mode === "drive")
        .flatMap((feature) => feature.properties.routeLegs ?? []);
      let driveMetricIndex = 0;
      selectedPlaybackDay?.segments.forEach((segment, index) => {
        const leg = dayLegs[index];
        if (!leg || leg.mode === "optional" || segment.coordinates.length === 0) return;
        const routeMetric = leg.mode === "drive" ? driveMetrics[driveMetricIndex++] : undefined;
        const durationLabel = routeMetric ? `导航约 ${routeMetric.durationMinutes} 分钟` : leg.durationLabel;
        const distanceLabel = routeMetric ? `${routeMetric.distanceKm.toFixed(1)} km` : (leg.distanceLabel ?? "");
        const [lng, lat] = segment.coordinates[Math.floor(segment.coordinates.length / 2)];
        const legIcon = L.divIcon({
          className: "route-leg-duration-wrap",
          html: `<span class="route-leg-duration-marker"><b>${routeModeGlyph(leg.mode)}</b><span>${escapeHtml(durationLabel)}</span><small>${escapeHtml(distanceLabel)}</small></span>`,
          iconAnchor: [42, 22],
          iconSize: [84, 44],
        });
        L.marker([lat, lng], {
          icon: legIcon,
          interactive: false,
          keyboard: false,
          zIndexOffset: 240,
        }).addTo(markerGroup);
      });
    }

    const features = selectedDay === null ? routeData.features : activeFeatures;
    const bounds = selectedDay === null || selectedDay === 1 || selectedDay === 7
      ? L.latLngBounds(
          (selectedDay === null ? itineraryPlaces : getPlanDayRoute(schedule, selectedDay))
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
  }, [activeFeatures, openPlaceDetail, plan.color, planHotels, playbackPlan, routeData, routeIsReady, schedule, selectedDay]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const driveLine = playbackDriveRef.current;
    const flightLine = playbackFlightRef.current;
    const walkLine = playbackWalkRef.current;
    const traveler = travelerMarkerRef.current;
    if (!L || !map || !driveLine || !flightLine || !walkLine || !traveler || !routeIsReady || playbackStages.length === 0) return;

    let cancelled = false;
    let stageIndex = 0;
    let stageElapsed = 0;
    let lastTimestamp: number | null = null;
    let lastCameraUpdate = 0;
    let lastProgressUpdate = 0;
    let currentTravelPhase: "camera" | "moving" | null = null;
    let completedLines: Record<PlaybackMode, RouteCoordinate[][]> = { drive: [], flight: [], walk: [] };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateStatus = (next: PlaybackStatus) => {
      playbackStatusRef.current = next;
      setPlaybackStatus(next);
    };

    const updateTravelPhase = (next: "camera" | "moving" | null) => {
      if (currentTravelPhase === next) return;
      currentTravelPhase = next;
      setTravelPhase(next);
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
      const line = mode === "drive" ? driveLine : mode === "flight" ? flightLine : walkLine;
      line.setLatLngs(toLeafletLines(lines));
    };

    const resetVisuals = () => {
      completedLines = { drive: [], flight: [], walk: [] };
      driveLine.setLatLngs([]);
      flightLine.setLatLngs([]);
      walkLine.setLatLngs([]);
      traveler.setOpacity(0);
      setVisibleStage(null);
      setActivePlaybackDay(null);
      setPlaybackProgress(0);
      updateTravelPhase(null);
      arrivalStageIndexRef.current = null;
      setArrivalStageIndex(null);
    };

    const focusStop = (stage: Extract<PlaybackStage, { type: "stop" }>) => {
      const { place, kind } = stage.stop;
      const position = L.latLng(place.coordinates.lat, place.coordinates.lng);
      const nextMode = playbackPlan[stage.dayIndex].segments[stage.stopIndex]?.mode;
      setTravelerIcon(kind === "transport" && nextMode ? nextMode : kind);
      traveler.setLatLng(position);
      traveler.setOpacity(0);

      const camera = cameraForArrival(place);
      if (reducedMotion) map.setView(position, camera.zoom, { animate: false });
      else map.flyTo(position, camera.zoom, { animate: true, duration: camera.duration, easeLinearity: 0.24 });
    };

    const enterStage = (nextIndex: number) => {
      const stage = playbackStages[nextIndex];
      stageIndex = nextIndex;
      stageElapsed = 0;
      lastTimestamp = null;
      lastCameraUpdate = 0;
      setVisibleStage(stage);
      setActivePlaybackDay(playbackPlan[stage.dayIndex].dayId);

      if (stage.type === "stop") {
        updateTravelPhase(null);
        focusStop(stage);
        const previouslyVisitedStayIds = new Set(
          playbackStages
            .slice(0, nextIndex)
            .filter((item): item is Extract<PlaybackStage, { type: "stop" }> => item.type === "stop" && item.stop.place.category === "stay")
            .map((item) => item.stop.place.id),
        );
        const shouldWait = requiresManualArrival(stage.stop.place, previouslyVisitedStayIds)
          && !acknowledgedArrivalStagesRef.current.has(nextIndex)
          && playbackStatusRef.current === "playing";
        if (shouldWait) {
          arrivalStageIndexRef.current = nextIndex;
          setArrivalStageIndex(nextIndex);
          setPlaceDetail({
            place: stage.stop.place,
            dayId: playbackPlan[stage.dayIndex].dayId,
            arrivalMode: true,
            stopIndex: stage.stopIndex,
          });
          updateStatus("paused");
        }
      }
      else {
        updateTravelPhase(reducedMotion ? "moving" : "camera");
        setTravelerIcon(stage.segment.mode);
        traveler.setOpacity(0);
        const camera = cameraForTravel(stage.segment);
        const [lng, lat] = stage.segment.coordinates[0];
        const position = L.latLng(lat, lng);
        if (reducedMotion) map.setView(position, camera.zoom, { animate: false });
        else map.flyTo(position, camera.zoom, {
          animate: true,
          duration: camera.duration,
          easeLinearity: 0.28,
        });
      }
    };

    const renderTravel = (
      stage: Extract<PlaybackStage, { type: "travel" }>,
      progress: number,
      timestamp: number,
    ) => {
      const coordinates = stage.segment.coordinates;
      const sample = sampleRouteAtProgress(coordinates, progress);
      setModeLine(stage.segment.mode, sample.visibleCoordinates);

      const position = L.latLng(sample.point[1], sample.point[0]);
      traveler.setLatLng(position);
      traveler.setOpacity(1);
      if (reducedMotion) {
        map.setView(position, map.getZoom(), { animate: false });
      } else if (timestamp - lastCameraUpdate >= travelCameraFollow.intervalMs) {
        lastCameraUpdate = timestamp;
        const screenPoint = map.latLngToContainerPoint(position);
        if (pointOutsideCameraComfortZone(screenPoint, map.getSize())) {
          map.panTo(position, {
            animate: true,
            duration: travelCameraFollow.duration,
            easeLinearity: travelCameraFollow.easeLinearity,
            noMoveStart: true,
          });
        }
      }
    };

    const finalizeStage = (stage: PlaybackStage) => {
      if (stage.type !== "travel") return;
      completedLines[stage.segment.mode].push(stage.segment.coordinates);
      setModeLine(stage.segment.mode);
    };

    const finishPlayback = () => {
      arrivalStageIndexRef.current = null;
      setArrivalStageIndex(null);
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
        // Keep the journey clock moving when a browser briefly throttles animation
        // frames, while still preventing a long-hidden tab from skipping whole days.
        const delta = Math.min(250, timestamp - lastTimestamp);
        lastTimestamp = timestamp;
        stageElapsed += delta;
        const movementDuration = reducedMotion
          ? stage.type === "travel" ? 160 : 650
          : stage.durationMs;
        let progress: number;
        if (stage.type === "travel") {
          const timing = travelStageProgress(
            stageElapsed,
            movementDuration,
            cameraForTravel(stage.segment),
            reducedMotion,
          );
          progress = timing.totalProgress;
          updateTravelPhase(timing.phase === "camera" ? "camera" : "moving");
          if (timing.phase !== "camera") {
            renderTravel(stage, timing.routeProgress, timestamp);
          }
        } else {
          progress = Math.min(1, stageElapsed / movementDuration);
        }
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
      acknowledgedArrivalStagesRef.current.clear();
      resetVisuals();
      enterStage(0);
      updateStatus("playing");
    };
    pausePlaybackRef.current = () => {
      if (playbackStatusRef.current === "playing") updateStatus("paused");
    };
    continueArrivalRef.current = () => {
      const waitingAt = arrivalStageIndexRef.current;
      if (waitingAt === null) return;
      acknowledgedArrivalStagesRef.current.add(waitingAt);
      arrivalStageIndexRef.current = null;
      setArrivalStageIndex(null);
      setPlaceDetail(null);
      stageElapsed = playbackStages[waitingAt].durationMs;
      lastTimestamp = null;
      updateStatus("playing");
    };
    resumePlaybackRef.current = () => {
      if (playbackStatusRef.current !== "paused") return;
      if (arrivalStageIndexRef.current !== null) continueArrivalRef.current();
      else updateStatus("playing");
    };

    const pauseForManualMap = () => pausePlaybackRef.current();
    map.on("dragstart", pauseForManualMap);
    animationFrameRef.current = window.requestAnimationFrame(tick);

    if (selectedDay !== null) {
      resetVisuals();
      updateStatus("idle");
    }

    return () => {
      cancelled = true;
      map.off("dragstart", pauseForManualMap);
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [playbackPlan, playbackStages, routeIsReady, selectedDay]);

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
  const visibleLeg = visibleStage?.type === "travel" && activeStageDay
    ? schedule.find((day) => day.id === activeStageDay.dayId)?.legs[visibleStage.segmentIndex]
    : undefined;
  const stageKind: PlaybackKind = visibleStage?.type === "stop" ? visibleStage.stop.kind : "transport";
  const stageMeta = playbackMeta[stageKind];
  const stagePlace = visibleStage?.type === "stop" ? visibleStage.stop.place : visibleStage?.segment.to.place;
  const activePhotoId = useMemo(() => {
    if (placeDetail) return journeyPhotoItems.find((item) => item.place.id === placeDetail.place.id)?.id ?? null;
    if (playbackStatus === "playing") {
      return stagePlace ? journeyPhotoItems.find((item) => item.place.id === stagePlace.id)?.id ?? null : null;
    }
    if (selectedDay !== null) return journeyPhotoItems.find((item) => item.dayId === selectedDay)?.id ?? selectedPhotoId;
    return selectedPhotoId;
  }, [journeyPhotoItems, placeDetail, playbackStatus, selectedDay, selectedPhotoId, stagePlace]);
  const routeLabel = visibleStage && selectedDay === null
    ? visibleStage.type === "travel"
      ? `${routeModeGlyph(visibleStage.segment.mode)} ${visibleStage.segment.from.place.shortName} → ${visibleStage.segment.to.place.shortName}${visibleLeg ? ` · ${visibleLeg.durationLabel}` : ""}`
      : `${stageMeta.glyph} ${stageMeta.verb} · ${visibleStage.stop.place.shortName}`
    : selectedDay === null
      ? "✈ 武汉 → 海口 · 🚙 海南东线 · ✈ 三亚 → 武汉"
      : schedule.find((day) => day.id === selectedDay)?.legs.map((leg) => `${routeModeGlyph(leg.mode)} ${leg.durationLabel}`).join(" · ") || `Day ${selectedDay}`;

  return (
    <div className="map-layer" data-playback-status={playbackStatus}>
      <div
        ref={containerRef}
        className="route-map-canvas"
        role="region"
        aria-label={selectedDay === null ? "Day 1 到 Day 7 完整动态路线地图" : `Day ${selectedDay} 动态路线地图`}
      />

      {selectedDay === null && playbackStatus === "idle" && !placeDetail && (
        <JourneyStartGate ready={routeIsReady} onStart={() => startPlaybackRef.current(true)} activePlan={plan.id} />
      )}

      <JourneyPhotoRail
        items={journeyPhotoItems}
        activeId={activePhotoId}
        onOpen={(item) => {
          setSelectedPhotoId(item.id);
          openPlaceDetail(item.place, item.dayId);
        }}
      />

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
            {stagePlace.image && <img src={withBasePath(stagePlace.image.src)} alt={stagePlace.image.alt} />}
            <div className={`activity-motion activity-motion-${stageKind}`} aria-hidden="true">
              <span>{visibleStage.type === "travel" ? routeModeGlyph(visibleStage.segment.mode) : stageMeta.glyph}</span>
              <i /><i /><i />
            </div>
          </div>
          <div className="playback-stop-body">
            <div className="playback-stop-kicker">
              <span>DAY {activeStageDay?.dayId} · {visibleStage.type === "travel" ? "行进中" : stageMeta.label}</span>
              <span>{playbackStatus === "complete" ? "旅程完成" : visibleStage.type === "stop" ? `${visibleStage.stopNumber}/${totalPlaybackStops}` : travelPhase === "camera" ? "调整镜头" : "镜头跟随"}</span>
            </div>
            <h2>{visibleStage.type === "travel" ? `前往${stagePlace.shortName}` : stagePlace.name}</h2>
            <p>{visibleStage.type === "travel"
              ? travelPhase === "camera"
                ? `${visibleStage.segment.from.place.shortName} → ${visibleStage.segment.to.place.shortName}，先调整到适合这段路程的视野。`
                : `${visibleStage.segment.from.place.shortName} → ${visibleStage.segment.to.place.shortName}，路线正在实时绘制。`
              : stagePlace.why}</p>
            <div className="playback-stop-facts">
              <span><b>{visibleStage.type === "travel" ? "交通时间" : "建议时间"}</b>{visibleStage.type === "travel" ? visibleLeg?.durationLabel ?? modeLabel(visibleStage.segment.mode) : stagePlace.activity.time}</span>
              <span><b>{visibleStage.type === "travel" ? visibleLeg?.distanceLabel ? "方式 · 距离" : "交通方式" : "停留"}</b>{visibleStage.type === "travel" ? `${modeLabel(visibleStage.segment.mode)}${visibleLeg?.distanceLabel ? ` · ${visibleLeg.distanceLabel}` : ""}` : stagePlace.activity.duration}</span>
            </div>
            <button className="playback-detail-button" type="button" onClick={() => {
              const stopIndex = visibleStage.type === "stop" ? visibleStage.stopIndex : visibleStage.segmentIndex + 1;
              pausePlaybackRef.current();
              travelerMarkerRef.current?.setOpacity(0);
              setPlaceDetail({ place: stagePlace, dayId: activeStageDay?.dayId ?? 1, arrivalMode: false, stopIndex });
              const camera = cameraForArrival(stagePlace);
              mapRef.current?.flyTo([stagePlace.coordinates.lat, stagePlace.coordinates.lng], camera.zoom, {
                animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
                duration: camera.duration,
                easeLinearity: 0.28,
              });
            }}>查看完整图文 <span aria-hidden="true">↗</span></button>
          </div>
        </aside>
      )}

      {placeDetail && detailRouteContext && (
        <PlaceDetailDialog
          key={`${placeDetail.place.id}-${placeDetail.dayId}-${placeDetail.stopIndex}`}
          place={placeDetail.place}
          dayId={placeDetail.dayId}
          planId={plan.id}
          routeContext={detailRouteContext}
          schedule={schedule}
          arrivalMode={placeDetail.arrivalMode && arrivalStageIndex !== null}
          onClose={closePlaceDetail}
          onContinue={() => continueArrivalRef.current()}
        />
      )}

      <div className="map-route-label">
        <span>{activePlaybackDay && selectedDay === null ? `DAY ${activePlaybackDay}` : selectedDay === null ? "DAY 1—7" : `DAY ${selectedDay}`}</span>
        <strong>{routeLabel}</strong>
        <div className="playback-controls" role="group" aria-label="旅程播放控制">
          <button type="button" onClick={togglePlayback} disabled={!routeIsReady || selectedDay !== null} aria-label={`${primaryPlaybackLabel}七日旅程动画`}>
            {playbackStatus === "playing" ? "Ⅱ" : "▶"} {primaryPlaybackLabel}
          </button>
          <button type="button" onClick={() => startPlaybackRef.current(true)} disabled={!routeIsReady || selectedDay !== null}>↺ 重播</button>
        </div>
      </div>

      <div className="map-legend" aria-label="地图图例">
        <span><i className="solid" />🚙 自驾</span>
        <span><i className="dashed" />✈ 航班</span>
        <span><i className="walk" />🚶 步行</span>
        <span><i className="photo" />实景图</span>
        <span><i className="change" />Day 2 / 4 换宿</span>
      </div>

      {!routeIsReady && status !== "error" && <div className="map-status" role="status">正在连接 Plan {plan.id} 完整路线…</div>}
      {status === "error" && (
        <div className="map-status map-error" role="alert">
          <strong>地图底图暂未加载</strong>
          <span>本地路线与三基地文字计划仍可浏览。</span>
        </div>
      )}
      {tilesFailed && routeIsReady && <div className="tile-note">底图网络较慢，本地路线与节点仍可点击。</div>}
    </div>
  );
}

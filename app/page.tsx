"use client";

import { useState } from "react";
import { RouteMap } from "./RouteMap";
import { itineraryPlans, type Hotel, type TravelMode } from "./trip-data";
import { researchSummary } from "./trip-details";
import { withBasePath } from "./site-paths";

const modeNotes: Record<TravelMode, { label: string; subtitle: string; guidance: string }> = {
  solo: {
    label: "一人",
    subtitle: "白天驾驶",
    guidance: "跨城段只在白天完成；海况差就删水上活动，任何一天都可以直接回同一个酒店基地。",
  },
  duo: {
    label: "二人",
    subtitle: "轮换驾驶",
    guidance: "主驾与副驾在长段换位；副驾负责停车、潮汐和天气，仍然不为多看一个点延后返程。",
  },
};

function HotelStory({ hotel, base }: { hotel: Hotel; base: number }) {
  return (
    <article className="hotel-story">
      <div className="hotel-photo-wrap">
        {/* Local, source-verified photography is intentionally served from the static itinerary bundle. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath(hotel.image.src)} alt={hotel.image.alt} loading={base === 1 ? "eager" : "lazy"} />
        <span>BASE {base} · {hotel.city}</span>
        <small>图源：{hotel.image.platform} · {hotel.image.credit}</small>
      </div>
      <div className="hotel-story-body">
        <p className="hotel-nights">入住 Day {hotel.checkInDay} · {hotel.nights}</p>
        <h2>{hotel.name}</h2>
        <p>{hotel.fit}</p>
        <details className="hotel-details">
          <summary>查看选择理由与入住提醒</summary>
          <h3>为什么选它</h3>
          <ul>{hotel.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          <h3>入住提醒</h3>
          <p className="hotel-caution">{hotel.cautions.join("；")}</p>
        </details>
        <div className="hotel-links">
          <a href={hotel.officialUrl} target="_blank" rel="noreferrer">酒店官网 ↗</a>
          <a href={hotel.xhsSource.url} target="_blank" rel="noreferrer">查看图片与房型来源 ↗</a>
        </div>
      </div>
    </article>
  );
}

function PlanSwitch({ activePlanId, onChange }: { activePlanId: "A" | "B"; onChange: (plan: "A" | "B") => void }) {
  return (
    <div className="plan-switch" role="group" aria-label="切换 Plan A 或 Plan B 旅行方案">
      {itineraryPlans.map((plan) => (
        <button
          key={plan.id}
          type="button"
          className={`plan-${plan.id.toLowerCase()}`}
          aria-pressed={activePlanId === plan.id}
          onClick={() => onChange(plan.id)}
        >
          <span>{plan.id}</span>
          <strong>{plan.name.replace(/^Plan [AB] · /, "")}</strong>
          <small>{plan.tagline}</small>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<TravelMode>("solo");
  const [activePlanId, setActivePlanId] = useState<"A" | "B">("A");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const activePlan = itineraryPlans.find((plan) => plan.id === activePlanId) ?? itineraryPlans[0];
  const activeDay = selectedDay === null ? null : activePlan.schedule.find((day) => day.id === selectedDay) ?? null;
  const activeHotels = activePlan.hotels;
  const activePlanDay = selectedDay === null ? null : activePlan.days.find((day) => day.dayId === selectedDay) ?? null;

  return (
    <main className="trip-app" data-plan={activePlanId.toLowerCase()}>
      <header className="map-topbar">
        <button className="map-wordmark" type="button" onClick={() => setSelectedDay(null)} aria-label="查看 Day 1 到 Day 7 完整路线">
          <span className="wordmark-mark" aria-hidden="true">HN</span>
          <span>
            <strong>武汉 → 海口 → 万宁 → 陵水 → 三亚</strong>
            <small>武汉出发 · 2026.09 · 7 天 6 晚</small>
          </span>
        </button>

        <nav className="route-filter" aria-label="全程或按天查看">
          <button type="button" className={selectedDay === null ? "active" : ""} aria-pressed={selectedDay === null} onClick={() => setSelectedDay(null)}>
            全程
          </button>
          {activePlan.schedule.map((day) => (
            <button
              key={day.id}
              type="button"
              className={[selectedDay === day.id ? "active" : "", day.isHotelChange ? "hotel-change-day" : ""].filter(Boolean).join(" ")}
              aria-pressed={selectedDay === day.id}
              onClick={() => setSelectedDay(day.id)}
              title={day.isHotelChange ? `${day.title} · 换宿日` : day.title}
            >
              <span>D{day.id}</span>
              {day.isHotelChange && <small>换宿</small>}
            </button>
          ))}
        </nav>

        <div className="mode-switch" role="group" aria-label="切换旅行人数">
          {(["solo", "duo"] as TravelMode[]).map((item) => (
            <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>
              <strong>{modeNotes[item].label}</strong>
              <small>{modeNotes[item].subtitle}</small>
            </button>
          ))}
        </div>
      </header>

      <section className="journey-shell" id="journey" aria-label="旅程地图">
        <RouteMap selectedDay={selectedDay} plan={activePlan} />

        <aside className="journey-card" aria-live="polite">
          <PlanSwitch activePlanId={activePlanId} onChange={setActivePlanId} />
          {activeDay ? (
            <>
              <p className="eyebrow">DAY {activeDay.id} · {activeDay.dateLabel}</p>
              <h1>{activeDay.title}</h1>
              <p className="plan-day-kicker">{activePlan.name}</p>
              <p className="journey-lead">{activePlanDay?.summary ?? activeDay.summary}</p>
              {activePlanDay && (
                <ul className="plan-highlights">
                  {activePlanDay.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              )}
              <dl className="day-facts">
                <div><dt>路线</dt><dd>{activeDay.distanceLabel}</dd></div>
                <div><dt>驾驶</dt><dd>{activeDay.driveLabel}</dd></div>
                <div><dt>今晚</dt><dd>{activeDay.sleep}</dd></div>
              </dl>
              {activeDay.isHotelChange && (() => {
                const toIndex = activeHotels.findIndex((hotel) => hotel.checkInDay === activeDay.id);
                const from = activeHotels[Math.max(0, toIndex - 1)];
                const to = activeHotels[toIndex];
                const swap = { from, to, fromLabel: from.shortName, toLabel: `${to.shortName} · ${to.nights.replace(/^Day \d+(?:–\d+)? · /, "")}` };
                return (
                <section className="day-hotel-swap" aria-label={`Day ${activeDay.id} 酒店更换`}>
                  <strong>DAY {activeDay.id} · 换宿日</strong>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <figure><img src={withBasePath(swap.from.image.src)} alt={swap.from.image.alt} /><figcaption>{swap.fromLabel}<br /><small>退房</small></figcaption></figure>
                    <span aria-hidden="true">行李 →</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <figure><img src={withBasePath(swap.to.image.src)} alt={swap.to.image.alt} /><figcaption>{swap.toLabel}</figcaption></figure>
                  </div>
                  <p className="change-badge">退房后直接前往下一家酒店；换宿日不叠加售票景区。</p>
                </section>
              ); })()}
              <p className="weather-line"><b>{activePlanId === "B" ? "B 线退路" : "天气退路"}</b>{activePlanDay?.fallback ?? activeDay.weatherPlan}</p>
            </>
          ) : (
            <>
              <p className="eyebrow">全程路线 · DAY 1—7</p>
              <h1>万宁住两晚，<br />整条东线慢下来</h1>
              <p className="plan-day-kicker">{activePlan.name}</p>
              <p className="journey-lead">{activePlan.description}</p>
              <div className="base-flow" aria-label="四个住宿基地">
                {activeHotels.map((hotel, index) => (
                  <div key={hotel.id} className="base-flow-group">
                    {index > 0 && (
                      <div className="hotel-change-bridge" role="note">
                        <span aria-hidden="true">⇄</span>
                        <strong>DAY {hotel.checkInDay} · 第 {index} 次换宿</strong>
                        <small>{activeHotels[index - 1].city} → {hotel.city}</small>
                      </div>
                    )}
                    <HotelStory hotel={hotel} base={index + 1} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="click-hint">
            <span aria-hidden="true">＋</span>
            <div><strong>点击地图节点</strong><small>站内查看完整图文、当天节奏、顺路吃喝与九月退路</small></div>
          </div>

          <div className="mode-guidance">
            <span>{modeNotes[mode].label}走法</span>
            <p>{modeNotes[mode].guidance}</p>
          </div>

          <div className="travel-basics" aria-label="吃穿提示">
            <span><b>吃</b>{activeDay ? activeDay.meals.join(" · ") : "海南粉 · 陵水酸粉 · 海边简餐"}</span>
            <span><b>穿</b>九月怎么穿：速干短袖＋薄防晒衣＋可收纳雨壳</span>
          </div>

          {selectedDay === null && (
            <details className="research-summary">
              <summary>100+ 篇小红书调研怎么改变了路线</summary>
              <p>已登记 {researchSummary.scannedCards} 条攻略卡片，深读 {researchSummary.deepReads} 篇代表笔记。</p>
              <p>{researchSummary.conclusion}</p>
              <div>{researchSummary.queryGroups.map((group) => <span key={group}>{group}</span>)}</div>
            </details>
          )}

          <p className="research-link">小红书原笔记已整理进地点详情 · 站内先看结论，需要时再打开原文</p>
          <p className="verified-note"><span>●</span> 活动、地图与酒店 · 2026-08-11 核验</p>
        </aside>
      </section>
    </main>
  );
}

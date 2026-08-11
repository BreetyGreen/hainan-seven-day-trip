"use client";

import { useState } from "react";
import { RouteMap } from "./RouteMap";
import { days, hotels, type Hotel, type TravelMode } from "./trip-data";

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
        <img src={hotel.image.src} alt={hotel.image.alt} loading={base === 1 ? "eager" : "lazy"} />
        <span>BASE {base} · {hotel.city}</span>
        <small>图源：小红书 @{hotel.image.credit}</small>
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
          <a href={hotel.xhsSource.url} target="_blank" rel="noreferrer">小红书实住图文 ↗</a>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [mode, setMode] = useState<TravelMode>("solo");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const activeDay = selectedDay === null ? null : days.find((day) => day.id === selectedDay) ?? null;

  return (
    <main className="trip-app">
      <header className="map-topbar">
        <button className="map-wordmark" type="button" onClick={() => setSelectedDay(null)} aria-label="查看 Day 1 到 Day 7 完整路线">
          <span className="wordmark-mark" aria-hidden="true">HN</span>
          <span>
            <strong>武汉 → 海南 · 一条线走完</strong>
            <small>武汉出发 · 2026.09 · 7 天 6 晚</small>
          </span>
        </button>

        <nav className="route-filter" aria-label="全程或按天查看">
          <button type="button" className={selectedDay === null ? "active" : ""} aria-pressed={selectedDay === null} onClick={() => setSelectedDay(null)}>
            全程
          </button>
          {days.map((day) => (
            <button
              key={day.id}
              type="button"
              className={[selectedDay === day.id ? "active" : "", day.isHotelChange ? "hotel-change-day" : ""].filter(Boolean).join(" ")}
              aria-pressed={selectedDay === day.id}
              onClick={() => setSelectedDay(day.id)}
              title={day.isHotelChange ? `${day.title} · 全程唯一换宿` : day.title}
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
        <RouteMap selectedDay={selectedDay} />

        <aside className="journey-card" aria-live="polite">
          {activeDay ? (
            <>
              <p className="eyebrow">DAY {activeDay.id} · {activeDay.dateLabel}</p>
              <h1>{activeDay.title}</h1>
              <p className="journey-lead">{activeDay.summary}</p>
              <dl className="day-facts">
                <div><dt>路线</dt><dd>{activeDay.distanceLabel}</dd></div>
                <div><dt>驾驶</dt><dd>{activeDay.driveLabel}</dd></div>
                <div><dt>今晚</dt><dd>{activeDay.sleep}</dd></div>
              </dl>
              {activeDay.isHotelChange && (
                <section className="day-hotel-swap" aria-label="Day 4 酒店更换">
                  <strong>DAY 4 唯一换宿</strong>
                  <div>
                    <figure><img src={hotels[0].image.src} alt={hotels[0].image.alt} /><figcaption>万宁君悦<br /><small>退房</small></figcaption></figure>
                    <span aria-hidden="true">行李 →</span>
                    <figure><img src={hotels[1].image.src} alt={hotels[1].image.alt} /><figcaption>三亚君悦<br /><small>入住 3 晚</small></figcaption></figure>
                  </div>
                  <p className="change-badge">上午带行李出发，玩完新村港与清水湾后直接入住三亚，不回万宁。</p>
                </section>
              )}
              <p className="weather-line"><b>天气退路</b>{activeDay.weatherPlan}</p>
            </>
          ) : (
            <>
              <p className="eyebrow">全程路线 · DAY 1—7</p>
              <h1>一条线，<br />只换一次酒店</h1>
              <p className="journey-lead">海口进、三亚出。前三晚住万宁，后三晚住三亚；默认先看完整路线，也可以在上方按天筛选。</p>
              <div className="base-flow" aria-label="两个住宿基地">
                <HotelStory hotel={hotels[0]} base={1} />
                <div className="hotel-change-bridge" role="note">
                  <span aria-hidden="true">⇄</span>
                  <strong>DAY 4 唯一换宿</strong>
                  <small>带行李沿东线南下，不折返</small>
                </div>
                <HotelStory hotel={hotels[1]} base={2} />
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
            <span><b>吃</b>{activeDay ? activeDay.meals.join(" · ") : "粉面 · 南洋风味 · 海边简餐"}</span>
            <span><b>穿</b>九月怎么穿：速干短袖＋薄防晒衣＋可收纳雨壳</span>
          </div>

          <p className="research-link">小红书原笔记已整理进地点详情 · 无需跳转也能看完</p>
          <p className="verified-note"><span>●</span> 活动、地图与酒店 · 2026-08-11 核验</p>
        </aside>
      </section>
    </main>
  );
}

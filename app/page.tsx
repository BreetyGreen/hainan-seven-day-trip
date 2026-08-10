"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { RouteMap } from "./RouteMap";
import {
  days,
  getBudget,
  getDayRoute,
  places,
  type TravelMode,
} from "./trip-data";

const travelBands = [
  {
    key: "吃",
    title: "吃在普洱",
    body: "早餐从五一市场的米干、豆汤开始；正餐优先酸笋、舂拌菜、烤肉与当季野菜。两个人共享菜更划算，一个人先问半份和小份。",
    note: "生食、野生菌和不认识的草药菜，不在无资质摊点尝试。",
  },
  {
    key: "穿",
    title: "九月怎么穿",
    body: "速干短袖打底，随车放薄长袖、防水外套、轻薄长裤和防滑运动鞋。景迈山早晚比思茅凉，森林步道湿滑。",
    note: "折叠伞负责城区，山路和森林用带帽雨衣；不要穿新白鞋。",
  },
  {
    key: "住",
    title: "住在哪里",
    body: "前后段住思茅城区，方便吃饭、补给和还车；景迈段住惠民镇或开放住宿区，选择可停车、能确认道路状态的民宿。",
    note: "不追悬崖、云海和无边泳池；隔音、热水、停车位更重要。",
  },
  {
    key: "行",
    title: "自驾规则",
    body: "建议白天驾驶，油量低于一半就补。长下坡用发动机制动，村寨窄路礼让本地车辆；单人每天日落前一小时结束驾驶。",
    note: "暴雨预警、落石提示或民宿明确劝返时，立刻改住澜沧，不硬闯。",
  },
];

const modeCopy: Record<
  TravelMode,
  { label: string; vehicle: string; room: string; safety: string }
> = {
  solo: {
    label: "一个人走",
    vehicle: "小型自动挡轿车",
    room: "单人独享 6 晚房间",
    safety: "每天两次报平安；不夜驾、不独自进入非开放茶林。",
  },
  duo: {
    label: "两个人走",
    vehicle: "紧凑型 SUV 或通过性较好的轿车",
    room: "大床或双床房，共享车辆与油费",
    safety: "山路轮换驾驶；副驾负责导航、天气和临时停车判断。",
  },
};

function yuan(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [mode, setMode] = useState<TravelMode>("solo");
  const [selectedDay, setSelectedDay] = useState(1);
  const budget = getBudget(mode);
  const day = days.find((item) => item.id === selectedDay) ?? days[0];
  const dayPlaces = useMemo(() => getDayRoute(selectedDay), [selectedDay]);

  return (
    <main>
      <nav className="topbar" aria-label="页面导航">
        <a className="wordmark" href="#top" aria-label="普洱七日慢行首页">
          <span aria-hidden="true">滇南</span>
          <strong>普洱七日慢行</strong>
        </a>
        <div className="nav-links">
          <a href="#route">路线</a>
          <a href="#essentials">吃穿住行</a>
          <a href="#budget">预算</a>
          <a href="#places">地点核验</a>
        </div>
        <a className="checklist-link" href="#before-you-go">
          出发前清单
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="hero-kicker">武汉出发 · 2026 年 9 月 · 7 天 6 晚</p>
          <h1>
            不追热榜，
            <br />去普洱慢下来。
          </h1>
          <p className="hero-intro">
            咖啡从树上到杯里，茶林与村寨一起生活，雨林按自己的节奏呼吸。
            这是一条能真正开车走完、也知道什么时候该停下来的路线。
          </p>

          <div className="mode-switch" role="group" aria-label="选择旅行人数">
            {(["solo", "duo"] as TravelMode[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={mode === item}
                onClick={() => setMode(item)}
              >
                <span>{item === "solo" ? "1" : "2"}</span>
                {modeCopy[item].label}
              </button>
            ))}
          </div>

          <div className="hero-ledger" aria-live="polite">
            <div>
              <span>{mode === "solo" ? "单人总预算" : "双人总预算"}</span>
              <strong>
                {yuan(budget.total.min)}–{yuan(budget.total.max)}
              </strong>
            </div>
            <div>
              <span>当地车辆</span>
              <strong>{modeCopy[mode].vehicle}</strong>
            </div>
            <div>
              <span>住宿口径</span>
              <strong>{modeCopy[mode].room}</strong>
            </div>
          </div>
        </div>

        <figure className="hero-visual">
          <Image
            src="/jingmai-tea-forest.jpg"
            alt="景迈山大平掌古茶林入口，石阶进入林下种植的古茶林"
            fill
            priority
            sizes="(max-width: 1080px) 100vw, 56vw"
          />
          <figcaption>
            <span>22.1991°N, 100.0097°E</span>
            景迈山大平掌古茶林 · 图片：919sth / CC BY-SA 4.0
          </figcaption>
          <div className="hero-stamp" aria-hidden="true">
            <span>7 DAYS</span>
            <strong>PU&apos;ER</strong>
            <span>700+ KM</span>
          </div>
        </figure>
      </section>

      <section className="route-section" id="route">
        <header className="section-heading">
          <div>
            <p>一条主线，三种体验</p>
            <h2>从城市烟火，开进雨林与茶山</h2>
          </div>
          <p>
            点击 Day 1–7，地图与当天详情同步切换。飞机、动车、自驾分层表达，
            不把跨省交通画成虚假的直线公路。
          </p>
        </header>

        <div className="route-workspace">
          <RouteMap selectedDay={selectedDay} />

          <div className="day-panel">
            <div className="day-tabs" role="tablist" aria-label="选择行程日期">
              {days.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedDay === item.id}
                  aria-controls="day-detail"
                  onClick={() => setSelectedDay(item.id)}
                >
                  <span>Day {item.id}</span>
                  <small>{item.dateLabel}</small>
                </button>
              ))}
            </div>

            <article id="day-detail" className="day-detail" role="tabpanel">
              <div className="day-title-row">
                <div>
                  <span className={`pace pace-${day.pace}`}>{day.pace}</span>
                  <h3>{day.title}</h3>
                  <p>{day.area}</p>
                </div>
                <div className="day-distance">
                  <strong>{day.distanceLabel}</strong>
                  <span>{day.driveLabel}</span>
                </div>
              </div>
              <p className="day-summary">{day.summary}</p>

              <ol className="day-stops">
                {dayPlaces.map((place, index) => (
                  <li key={place.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{place.shortName}</strong>
                      <small>{place.why}</small>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="day-notes">
                <div>
                  <span>今晚住</span>
                  <strong>{day.sleep}</strong>
                </div>
                <div>
                  <span>天气退路</span>
                  <strong>{day.weatherPlan}</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="essentials" id="essentials">
        <header className="section-heading compact">
          <div>
            <p>带得刚好，吃得在地</p>
            <h2>吃穿住行，不靠旅行滤镜</h2>
          </div>
        </header>
        <div className="travel-bands">
          {travelBands.map((band) => (
            <article key={band.key}>
              <span className="band-key" aria-hidden="true">{band.key}</span>
              <h3>{band.title}</h3>
              <p>{band.body}</p>
              <small>{band.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="budget-section" id="budget">
        <div className="budget-intro">
          <p>预算账本</p>
          <h2>{modeCopy[mode].label}，钱花在哪里</h2>
          <p>
            预算为 2026 年 8 月规划区间，不是锁价。
            出发前以航空公司、12306、租车平台和住宿确认页为准。
          </p>
          <div className="budget-total" aria-live="polite">
            <span>{budget.people} 人合计</span>
            <strong>{yuan(budget.total.min)}–{yuan(budget.total.max)}</strong>
            {mode === "duo" && (
              <small>
                人均约 {yuan(Math.round(budget.total.min / 2))}–
                {yuan(Math.round(budget.total.max / 2))}
              </small>
            )}
          </div>
        </div>
        <div className="budget-lines">
          {budget.items.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{yuan(item.min)}–{yuan(item.max)}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="places-section" id="places">
        <header className="section-heading">
          <div>
            <p>真实地点簿</p>
            <h2>每个点，都能在地图上找到</h2>
          </div>
          <p>坐标与来源核验于 2026-08-10；开放时间、预约和道路状态仍需临行复核。</p>
        </header>

        <div className="place-list">
          {places
            .filter((place) => place.category !== "transport")
            .map((place) => (
              <article key={place.id}>
                <div className={`place-signal signal-${place.category}`} aria-hidden="true" />
                <div className="place-main">
                  <span>{place.category}</span>
                  <h3>{place.name}</h3>
                  <p>{place.why}</p>
                </div>
                <div className="place-meta">
                  <span>
                    {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                  </span>
                  <p>{place.visitNote}</p>
                  <a href={place.sourceUrl} target="_blank" rel="noreferrer">
                    查看核验来源 ↗
                  </a>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="before-go" id="before-you-go">
        <div>
          <p>出发前最后检查</p>
          <h2>把不确定，留在出发之前解决</h2>
        </div>
        <ol>
          <li><span>提前 30 天</span>查武汉—昆明机票与昆明南—普洱动车衔接。</li>
          <li><span>提前 30 天</span>在“景迈山预约服务”核验入园名额和车辆要求。</li>
          <li><span>提前 7 天</span>联系咖啡庄园与民宿，确认参观、晚餐和停车。</li>
          <li><span>提前 48 小时</span>查看普洱、澜沧、景迈山天气与道路预警。</li>
          <li><span>每天出发前</span>检查油量、胎压、离线地图和当日日落时间。</li>
        </ol>
        <div className="safety-note">
          <span>{mode === "solo" ? "单人底线" : "双人分工"}</span>
          <strong>{modeCopy[mode].safety}</strong>
        </div>
      </section>

      <footer>
        <p>普洱七日慢行 · 为 2026 年 9 月武汉出发制定</p>
        <p>路线是决策工具，不替代天气预警、景区公告与现场交通管理。</p>
      </footer>
    </main>
  );
}

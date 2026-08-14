"use client";

import { useMemo, useState } from "react";
import { evidenceForSource, type ResearchCategory } from "./research-evidence";
import { recommendationsForDay, type PlanId } from "./trip-recommendations";

const categories: ResearchCategory[] = ["吃", "穿", "住", "行", "玩"];
const glyphs: Record<ResearchCategory, string> = { 吃: "筷", 穿: "衣", 住: "宿", 行: "路", 玩: "游" };

export function PlaceDecisionTabs({ dayId, planId, placeId }: { dayId: number; planId: PlanId; placeId: string }) {
  const items = useMemo(() => recommendationsForDay(dayId, planId).items, [dayId, planId]);
  const placeMatch = items.find((item) => item.entityId === placeId);
  const [active, setActive] = useState<ResearchCategory>(placeMatch?.category ?? "玩");
  const current = items.find((item) => item.category === active) ?? items[0];
  const evidence = current.evidenceIds.map(evidenceForSource).filter(Boolean);

  return (
    <section className="decision-tabs" aria-label={`Day ${dayId} 吃穿住行玩决策`}>
      <div className="decision-tabs-intro">
        <span>PLAN {planId} · DAY {dayId}</span>
        <strong>这一站怎么决定</strong>
        <small>结论已写在站内；原文只用于复核</small>
      </div>
      <div className="decision-tab-list" role="tablist" aria-label="切换吃穿住行玩">
        {categories.map((category) => (
          <button
            key={category}
            id={`decision-tab-${planId}-${dayId}-${category}`}
            type="button"
            role="tab"
            aria-selected={active === category}
            aria-controls={`decision-panel-${planId}-${dayId}`}
            onClick={() => setActive(category)}
          >
            <span>{glyphs[category]}</span>{category}
          </button>
        ))}
      </div>
      <article
        id={`decision-panel-${planId}-${dayId}`}
        className="decision-panel"
        role="tabpanel"
        aria-labelledby={`decision-tab-${planId}-${dayId}-${active}`}
      >
        <div className="decision-panel-heading">
          <div><span>{active} · {current.entityId === placeId ? "当前地点" : "当天串联"}</span><h3>{current.title}</h3></div>
          <em>{evidence.length} 条证据</em>
        </div>
        <p>{current.summary}</p>
        <ol>{current.actions.map((action) => <li key={action}>{action}</li>)}</ol>
        {(current.price || current.fallback) && (
          <div className="decision-notes">
            {current.price && <span><b>参考</b>{current.price}</span>}
            {current.fallback && <span><b>退路</b>{current.fallback}</span>}
          </div>
        )}
        <details className="decision-evidence">
          <summary>查看证据与推广风险</summary>
          <div>
            {evidence.map((source) => source && (
              <a key={source.sourceId} href={source.url} target="_blank" rel="noreferrer">
                <span>{source.sourceType} · {source.deepRead ? "已深读" : "候选核验"}</span>
                <strong>{source.title}</strong>
                <small className={`risk-${source.promoRisk.level}`}>推广风险 {source.promoRisk.level} · {source.promoRisk.reason}</small>
              </a>
            ))}
          </div>
        </details>
      </article>
    </section>
  );
}

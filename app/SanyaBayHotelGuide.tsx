"use client";

import { useState } from "react";
import { evidenceForSource } from "./research-evidence";
import { sanyaBayGuide } from "./trip-recommendations";

export function SanyaBayHotelGuide() {
  const [activeName, setActiveName] = useState(sanyaBayGuide[0].name);
  const active = sanyaBayGuide.find((bay) => bay.name === activeName) ?? sanyaBayGuide[0];
  const evidence = active.evidenceIds.map(evidenceForSource).filter(Boolean);

  return (
    <details className="sanya-bay-guide">
      <summary>
        <span>三亚四大湾区怎么选</span>
        <strong>这是酒店决策指南，不是第四个住宿基地</strong>
      </summary>
      <div className="bay-guide-tabs" role="tablist" aria-label="三亚四大湾区比较">
        {sanyaBayGuide.map((bay) => (
          <button key={bay.name} type="button" role="tab" aria-selected={active.name === bay.name} onClick={() => setActiveName(bay.name)}>{bay.name}</button>
        ))}
      </div>
      <article className="bay-guide-panel">
        <div className="bay-guide-title"><span>{active.name}</span><strong>{active.fit}</strong></div>
        <dl>
          <div><dt>安静度</dt><dd>{active.quietness}</dd></div>
          <div><dt>下海</dt><dd>{active.swim}</dd></div>
          <div><dt>便利</dt><dd>{active.convenience}</dd></div>
          <div><dt>代价</dt><dd>{active.tradeoff}</dd></div>
        </dl>
        <p><b>候选酒店</b>{active.hotelCandidates.join(" · ")}</p>
        <div className="bay-guide-evidence">
          {evidence.map((source) => source && <a key={source.sourceId} href={source.url} target="_blank" rel="noreferrer">{source.sourceType} · {source.title} ↗</a>)}
        </div>
      </article>
    </details>
  );
}

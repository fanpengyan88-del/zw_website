"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { TimelineYear } from "@/data/content";

type HistoryTimelineProps = {
  items: TimelineYear[];
};

const phases = [
  { until: 2010, name: "创业筑基", en: "FOUNDATION" },
  { until: 2017, name: "技术深耕", en: "TECHNOLOGY" },
  { until: 2021, name: "能力跃迁", en: "GROWTH" },
  { until: 2025, name: "生态拓展", en: "ECOSYSTEM" },
  { until: 2026, name: "向新而行", en: "FUTURE READY" },
];

function getPhase(year: string) {
  if (year === "未来") return { name: "无限可能", en: "TO THE FUTURE" };
  const numericYear = Number(year);
  return phases.find((phase) => numericYear <= phase.until) ?? phases.at(-1)!;
}

export function HistoryTimeline({ items }: HistoryTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(items.length - 1);
  const yearsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const active = items[activeIndex];
  const phase = getPhase(active.year);

  useEffect(() => {
    yearsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  function select(index: number) {
    setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));
  }

  function move(direction: -1 | 1) {
    select(activeIndex + direction);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(items.length - 1);
    }
  }

  return (
    <div
      className="history-showcase"
      tabIndex={0}
      role="region"
      aria-label="中网公司发展历程"
      onKeyDown={handleKeyDown}
      onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) > 55) move(distance > 0 ? -1 : 1);
        touchStartX.current = null;
      }}
    >
      <div className="history-stage" key={active.year}>
        <div className="history-ambient" aria-hidden="true">
          <span>{active.year}</span>
          <i />
        </div>

        <div className="history-year">
          <p>{phase.en}</p>
          <strong>{active.year}</strong>
          <h3>{phase.name}</h3>
          <span>第 {String(activeIndex + 1).padStart(2, "0")} 个年度节点</span>
        </div>

        <div
          className={`history-events count-${active.events.length}`}
          style={{ "--event-count": active.events.length } as CSSProperties}
        >
          {active.events.map((event, index) => (
            <article key={`${event.category}-${event.title}`}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small data-category={event.category}>{event.category}</small>
              </div>
              <p>{event.title}</p>
            </article>
          ))}
        </div>

        <div className="history-stage-controls">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
            aria-label="查看更早年份"
          >
            <ArrowLeft />
          </button>
          <span>{activeIndex + 1} / {items.length}</span>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={activeIndex === items.length - 1}
            aria-label="查看更晚年份"
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="history-navigation">
        <div className="history-navigation-copy">
          <b>发展坐标</b>
          <span>点击年份切换 · 支持左右滑动</span>
        </div>
        <div className="history-years" ref={yearsRef}>
          {items.map((item, index) => (
            <button
              type="button"
              key={item.year}
              data-index={index}
              className={activeIndex === index ? "active" : ""}
              onClick={() => select(index)}
              aria-pressed={activeIndex === index}
            >
              <i />
              <span>{item.year}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

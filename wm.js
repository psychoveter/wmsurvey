import React, { useMemo, useState } from "react";
import katex from "katex";
import {
  BrainIcon,
  NetworkIcon,
  SigmaIcon,
  SearchIcon,
  ExternalLinkIcon,
  FilterIcon,
  TargetIcon,
  BookIcon,
} from "./icons.jsx";
import { AXES, TYPES, CLUSTERS } from "./models.js";

/* ------------------------------ Pure helpers ------------------------------- */

export function filterAndSortModels(models, cluster, query, sortBy) {
  const q = (query || "").trim().toLowerCase();

  return models
    .filter((m) => cluster === "All" || m.cluster === cluster)
    .filter((m) => {
      if (!q) return true;
      const haystack = [m.title, m.short, m.cluster, ...(m.tags || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .sort((a, b) => {
      const av = a?.scores?.[sortBy] ?? 0;
      const bv = b?.scores?.[sortBy] ?? 0;
      return bv - av;
    });
}

export function getSelectedModel(models, selectedId, fallbackList = []) {
  return (
    models.find((m) => m.id === selectedId) ||
    fallbackList[0] ||
    models[0] ||
    null
  );
}

export function runSelfTests() {
  const sample = [
    {
      id: "a",
      title: "Alpha",
      short: "causal",
      cluster: "Structure",
      tags: ["graph"],
      scores: { horizon: 2, planning: 1 },
    },
    {
      id: "b",
      title: "Beta",
      short: "control",
      cluster: "Control",
      tags: ["mpc"],
      scores: { horizon: 5, planning: 4 },
    },
    {
      id: "c",
      title: "Gamma",
      short: "causal and object",
      cluster: "Structure",
      tags: ["slots"],
      scores: { horizon: 3, planning: 5 },
    },
  ];

  const r1 = filterAndSortModels(sample, "All", "", "horizon");
  console.assert(r1[0].id === "b", "Test 1 failed: sorting by horizon");

  const r2 = filterAndSortModels(sample, "Structure", "", "planning");
  console.assert(
    r2.length === 2 && r2[0].id === "c",
    "Test 2 failed: cluster filter + planning sort"
  );

  const r3 = filterAndSortModels(sample, "All", "slots", "planning");
  console.assert(r3.length === 1 && r3[0].id === "c", "Test 3 failed: tag search");

  const r4 = getSelectedModel(sample, "missing", r2);
  console.assert(r4.id === "c", "Test 4 failed: fallback selection");

  const r5 = getSelectedModel(sample, "b", r2);
  console.assert(r5.id === "b", "Test 5 failed: exact selection");

  return true;
}

runSelfTests();

/* --------------------------------- Math UI -------------------------------- */

function renderTeX(tex, displayMode) {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      trust: false,
      output: "html",
    });
  } catch (e) {
    return `<span class="text-rose-400">${String(tex)}</span>`;
  }
}

function MathBlock({ tex, className = "" }) {
  return (
    <div
      className={`katex-block overflow-x-auto text-zinc-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderTeX(tex, true) }}
    />
  );
}

function MathInline({ tex, className = "" }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderTeX(tex, false) }}
    />
  );
}

/* ------------------------------ UI components ------------------------------ */

function ScoreBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-white/80"
        style={{ width: `${Math.max(0, Math.min(5, value)) * 20}%` }}
      />
    </div>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        active
          ? "border-white bg-white text-zinc-950"
          : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Radar({ model }) {
  const values = AXES.map((a) => model.scores[a.key]);
  const max = 5;
  const width = 360;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 90;

  const angleAt = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;

  const ringPoints = (r) =>
    AXES.map((_, i) => {
      const a = angleAt(i);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");

  const points = values
    .map((v, i) => {
      const a = angleAt(i);
      const r = radius * (v / max);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");

  const labelFor = (i) => {
    const a = angleAt(i);
    const lr = radius + 22;
    const x = cx + lr * Math.cos(a);
    const y = cy + lr * Math.sin(a);
    const cosA = Math.cos(a);
    let anchor = "middle";
    if (cosA > 0.2) anchor = "start";
    else if (cosA < -0.2) anchor = "end";
    return { x, y, anchor };
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full max-w-[22rem]"
      role="img"
      aria-label="radar chart of model scores"
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <polygon
          key={step}
          points={ringPoints((radius * step) / max)}
          fill="none"
          stroke="rgba(255,255,255,.10)"
          strokeWidth="1"
        />
      ))}

      {AXES.map((_, i) => {
        const a = angleAt(i);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(a)}
            y2={cy + radius * Math.sin(a)}
            stroke="rgba(255,255,255,.18)"
          />
        );
      })}

      {[1, 2, 3, 4, 5].map((step) => (
        <text
          key={`scale-${step}`}
          x={cx + 4}
          y={cy - (radius * step) / max + 3}
          fill="rgba(255,255,255,.35)"
          fontSize="9"
        >
          {step}
        </text>
      ))}

      <polygon
        points={points}
        fill="rgba(255,255,255,.22)"
        stroke="white"
        strokeWidth="1.8"
      />

      {values.map((v, i) => {
        const a = angleAt(i);
        const r = radius * (v / max);
        return (
          <circle
            key={`dot-${i}`}
            cx={cx + r * Math.cos(a)}
            cy={cy + r * Math.sin(a)}
            r={2.5}
            fill="white"
          />
        );
      })}

      {AXES.map((axis, i) => {
        const { x, y, anchor } = labelFor(i);
        return (
          <g key={`lbl-${i}`}>
            <text
              x={x}
              y={y}
              fontSize="11"
              fill="rgba(255,255,255,.85)"
              textAnchor={anchor}
              dominantBaseline="middle"
              style={{ fontWeight: 500 }}
            >
              {axis.label}
            </text>
            <text
              x={x}
              y={y + 12}
              fontSize="10"
              fill="rgba(255,255,255,.55)"
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {values[i]}/5
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ModelCard({ model, selected, onClick }) {
  const Icon = model.icon;
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-3xl border p-4 text-left shadow-lg transition ${
        selected
          ? "border-white/50 bg-white/15"
          : "border-white/10 bg-white/[.06] hover:-translate-y-0.5 hover:bg-white/[.10]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl bg-gradient-to-br ${model.color} p-3 shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="leading-tight font-semibold text-white">{model.title}</h3>
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-300">
              {model.cluster}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{model.short}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {model.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function MathItem({ item }) {
  const norm =
    typeof item === "string" ? { label: undefined, tex: item, desc: undefined } : item;
  return (
    <li className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex flex-wrap items-center gap-3">
        {norm.label && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-300">
            {norm.label}
          </span>
        )}
        <div className="overflow-x-auto">
          <MathInline tex={norm.tex} className="text-zinc-100" />
        </div>
      </div>
      {norm.desc && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{norm.desc}</p>
      )}
    </li>
  );
}

function NotationGlossary({ notation }) {
  if (!notation || notation.length === 0) return null;
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.04] p-4">
      <h4 className="flex items-center gap-2 font-semibold text-white">
        <BookIcon className="h-4 w-4 text-white" />
        Обозначения
      </h4>
      <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {notation.map((n) => (
          <div
            key={n.sym}
            className="flex items-baseline gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2"
          >
            <dt className="shrink-0 text-zinc-100">
              <MathInline tex={n.sym} />
            </dt>
            <dd className="text-sm leading-snug text-zinc-400">{n.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DetailPanel({ model }) {
  const Icon = model.icon;
  return (
    <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-2xl backdrop-blur md:p-6">
      <div className="flex items-start gap-4">
        <div className={`rounded-3xl bg-gradient-to-br ${model.color} p-4`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <div className="text-sm text-zinc-400">{model.cluster}</div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{model.title}</h2>
          <p className="mt-2 text-zinc-300 leading-relaxed">{model.short}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <TargetIcon className="h-4 w-4 text-white" />
            Архитектурная суть
          </h4>
          <p className="mt-3 leading-relaxed text-zinc-300">{model.details}</p>
        </div>
        <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <Radar model={model} />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-4">
        <h4 className="flex items-center gap-2 font-semibold text-white">
          <NetworkIcon className="h-4 w-4 text-white" />
          Pipeline
        </h4>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {model.pipeline.map((step, i) => (
            <React.Fragment key={step}>
              <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-zinc-200">
                {step}
              </span>
              {i < model.pipeline.length - 1 && <span className="text-zinc-500">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <SigmaIcon className="h-4 w-4 text-white" />
            Математика
          </h4>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <MathBlock tex={model.formula} />
          </div>
          <ul className="mt-3 space-y-2">
            {model.math.map((m, i) => (
              <MathItem key={(typeof m === "string" ? m : m.label || m.tex) + i} item={m} />
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <ExternalLinkIcon className="h-4 w-4 text-white" />
            Работы и ссылки
          </h4>
          <div className="mt-3 space-y-2">
            {model.works.map((w) => (
              <a
                key={w.url}
                href={w.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-zinc-200 transition hover:bg-white/10"
              >
                <span>{w.name}</span>
                <ExternalLinkIcon className="h-4 w-4 shrink-0 text-zinc-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <NotationGlossary notation={model.notation} />
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[.04] p-4">
        <h4 className="font-semibold text-white">Ключевые параметры</h4>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AXES.map((axis) => (
            <div key={axis.key} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-300">{axis.label}</span>
                <span className="font-semibold text-white">{model.scores[axis.key]}/5</span>
              </div>
              <ScoreBar value={model.scores[axis.key]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Main ---------------------------------- */

export default function WorldModelsMapSPA() {
  const [selectedId, setSelectedId] = useState("object-centric");
  const [cluster, setCluster] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("horizon");

  const filtered = useMemo(
    () => filterAndSortModels(TYPES, cluster, query, sortBy),
    [cluster, query, sortBy]
  );

  const selected = getSelectedModel(TYPES, selectedId, filtered);

  if (!selected) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Карта архитектур моделей мира</h1>
          <p className="mt-3 text-zinc-300">
            Нет доступных данных для отображения. Проверьте конфигурацию массива TYPES.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1e1b4b,transparent_32%),radial-gradient(circle_at_top_right,#7f1d1d,transparent_30%),linear-gradient(135deg,#09090b,#111827_45%,#030712)] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.06] p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_18%),radial-gradient(circle_at_80%_10%,white,transparent_10%)]" />
          <div className="relative z-10 grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-zinc-300">
                <BrainIcon className="h-4 w-4 text-white" />
                Interactive taxonomy
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                Карта архитектур моделей мира
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
                SPA для сравнения world models по представлению, динамике, планированию,
                неопределённости, каузальности и горизонту. Кликни на тип модели, чтобы увидеть
                детали, математику и ссылки на ключевые работы.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <div className="mb-3 text-sm text-zinc-400">Как читать карту</div>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="flex gap-3">
                  <span className="font-bold text-white">5/5</span>
                  <span>сильная выраженность параметра</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-white">cluster</span>
                  <span>архитектурная семья</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-white">pipeline</span>
                  <span>типичный путь данных и решений</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[390px_1fr] lg:h-[calc(100vh-3rem)]">
          <aside className="space-y-4 lg:h-full lg:overflow-y-auto lg:pr-2 [scrollbar-gutter:stable]">
            <div className="rounded-[2rem] border border-white/10 bg-zinc-950/60 p-4 shadow-xl backdrop-blur lg:sticky lg:top-0 lg:z-10">
              <div className="mb-3 flex items-center gap-2 font-semibold text-white">
                <FilterIcon className="h-4 w-4 text-white" />
                Фильтры
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="поиск: causal, slots, MPC..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-sm outline-none focus:border-white/40"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {CLUSTERS.map((c) => (
                  <Pill key={c} active={cluster === c} onClick={() => setCluster(c)}>
                    {c}
                  </Pill>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-sm text-zinc-400">Сортировать по параметру</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/40"
                >
                  {AXES.map((a) => (
                    <option key={a.key} value={a.key}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filtered.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  selected={model.id === selected.id}
                  onClick={() => setSelectedId(model.id)}
                />
              ))}
            </div>
          </aside>

          <main className="lg:h-full lg:overflow-y-auto lg:pr-2 [scrollbar-gutter:stable]">
            <DetailPanel model={selected} />
          </main>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[.05] p-5 md:p-6">
          <h3 className="text-xl font-bold">Интегральная архитектура будущего</h3>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {[
              "multimodal sensors",
              "object-centric spatial memory",
              "causal-relational graph",
              "belief state",
              "hierarchical skills",
              "generative renderer",
              "counterfactual planner",
              "policy / LLM agent",
            ].map((s, i, arr) => (
              <React.Fragment key={s}>
                <span className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-zinc-200">
                  {s}
                </span>
                {i < arr.length - 1 && <span className="text-zinc-500">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-4 leading-relaxed text-zinc-300">
            Практически сильная world model, вероятно, будет гибридом: генеративная
            видео/симуляционная модель даст rich prior, object-centric слой даст структурные
            переменные, causal слой — интервенции и counterfactuals, Bayesian belief —
            неопределённость, hierarchy — длинный горизонт, а planner/policy превратит симуляцию в
            действие.
          </p>
        </section>
      </div>
    </div>
  );
}

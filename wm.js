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
  SparklesIcon,
  LayersIcon,
} from "./icons.jsx";
import {
  AXES,
  TYPES,
  CLUSTERS,
  LEVELS,
  REGIMES,
  L1_OP_LABELS,
  L2_COND_LABELS,
} from "./models.js";

/* ------------------------------ Pure helpers ------------------------------- */

export function filterAndSortModels(
  models,
  cluster,
  query,
  sortBy,
  level = "All",
  regime = "All"
) {
  const q = (query || "").trim().toLowerCase();

  return models
    .filter((m) => cluster === "All" || m.cluster === cluster)
    .filter((m) => level === "All" || m.level === level)
    .filter(
      (m) =>
        regime === "All" ||
        (Array.isArray(m.regimes) && m.regimes.includes(regime))
    )
    .filter((m) => {
      if (!q) return true;
      const haystack = [
        m.title,
        m.short,
        m.cluster,
        m.level,
        ...(m.regimes || []),
        ...(m.tags || []),
      ]
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

function levelMeta(id) {
  return LEVELS.find((l) => l.id === id);
}

function regimeMeta(id) {
  return REGIMES.find((r) => r.id === id);
}

function LevelBadge({ level, size = "sm" }) {
  const meta = levelMeta(level);
  if (!meta) return null;
  const cls =
    size === "lg"
      ? "px-3 py-1 text-sm"
      : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wide ${cls} ${meta.badge}`}
      title={`${meta.id} — ${meta.name}: ${meta.short}`}
    >
      {meta.id}
      {size === "lg" && (
        <span className="text-zinc-200/80 font-normal normal-case tracking-normal">
          {meta.name}
        </span>
      )}
    </span>
  );
}

function RegimeBadge({ regime, size = "sm" }) {
  const meta = regimeMeta(regime);
  if (!meta) return null;
  const cls =
    size === "lg"
      ? "px-3 py-1 text-sm"
      : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center rounded-full border ${cls} ${meta.badge}`}
      title={`${meta.id}: ${meta.short}`}
    >
      {meta.id}
    </span>
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
      {(model.level || (model.regimes && model.regimes.length > 0)) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {model.level && <LevelBadge level={model.level} />}
          {(model.regimes || []).map((r) => (
            <RegimeBadge key={r} regime={r} />
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
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

function CapabilityProfile({ model }) {
  if (!model.level && !model.regimes && !model.l1Ops && !model.l2Conditions) {
    return null;
  }
  const lvl = levelMeta(model.level);
  const ops = model.l1Ops || {};
  const conds = model.l2Conditions || {};
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.05] p-4">
      <h4 className="flex flex-wrap items-center gap-2 font-semibold text-white">
        <SparklesIcon className="h-4 w-4 text-white" />
        Способность × режим
        <span className="text-xs font-normal text-zinc-500">
          (по таксономии «levels × laws», arXiv:2604.22748)
        </span>
      </h4>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Capability level
          </div>
          {lvl ? (
            <>
              <div className="mt-2 flex items-center gap-3">
                <LevelBadge level={lvl.id} size="lg" />
                <span className="text-sm text-zinc-300">{lvl.short}</span>
              </div>
              {model.levelNote && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {model.levelNote}
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">— не размечено —</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Governing-law regimes
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {(model.regimes || []).length > 0 ? (
              (model.regimes || []).map((r) => (
                <RegimeBadge key={r} regime={r} size="lg" />
              ))
            ) : (
              <span className="text-sm text-zinc-400">—</span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Регим определяет, какие инварианты должны соблюдаться при rollout
            и как они проверяются (аналитически, исполнением, нормами или
            экспериментом).
          </p>
        </div>
      </div>

      {(ops.SI !== undefined ||
        ops.FD !== undefined ||
        ops.OD !== undefined ||
        ops.ID !== undefined) && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              L1 operators
            </div>
            <div className="text-[11px] text-zinc-500">
              state inference / forward dynamics / decoder / inverse dynamics
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(L1_OP_LABELS).map(([key, label]) => {
              const on = !!ops[key];
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                    on
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                      : "border-white/10 bg-white/[.04] text-zinc-500"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      on ? "bg-emerald-400" : "bg-zinc-600"
                    }`}
                  />
                  <span className="font-mono text-xs">{key}</span>
                  <span className="truncate">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(conds.coherence !== undefined ||
        conds.intervention !== undefined ||
        conds.constraint !== undefined) && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              L2 boundary conditions
            </div>
            <div className="text-[11px] text-zinc-500">по 5-балльной шкале</div>
          </div>
          <div className="mt-2 space-y-2">
            {Object.entries(L2_COND_LABELS).map(([key, label]) => {
              const v = conds[key];
              if (v === undefined) return null;
              return (
                <div key={key}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="text-zinc-300">{label}</span>
                    <span className="font-semibold text-white">{v}/5</span>
                  </div>
                  <ScoreBar value={v} />
                </div>
              );
            })}
          </div>
        </div>
      )}
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
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <span>{model.cluster}</span>
            {model.level && (
              <>
                <span className="text-zinc-600">·</span>
                <LevelBadge level={model.level} />
              </>
            )}
            {(model.regimes || []).map((r) => (
              <RegimeBadge key={r} regime={r} />
            ))}
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">{model.title}</h2>
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

      <div className="mt-5">
        <CapabilityProfile model={model} />
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

/* --------------------------- Collapse helpers ----------------------------- */

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 8 11 13 6" />
    </svg>
  );
}

const FUTURE_STACK = [
  "multimodal sensors",
  "object-centric spatial memory",
  "causal-relational graph",
  "belief state",
  "hierarchical skills",
  "generative renderer",
  "counterfactual planner",
  "L3 evolver loop",
];

/* --------------------------- Taxonomy overview ---------------------------- */

function TaxonomyOverview() {
  const [open, setOpen] = useState(true);

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.05]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-white/[.03] md:px-6"
        aria-expanded={open}
      >
        <LayersIcon className="h-5 w-5 text-white" />
        <h2 className="text-base font-bold text-white md:text-lg">
          Таксономия «levels × laws» + контур будущей world model
        </h2>
        <span className="hidden flex-wrap items-center gap-1 text-[11px] text-zinc-500 sm:flex">
          {LEVELS.map((l) => (
            <span key={l.id} className="font-mono">
              {l.id}
            </span>
          )).reduce((acc, el, i) => (i ? [...acc, " · ", el] : [el]), [])}
          <span className="mx-1">×</span>
          {REGIMES.map((r) => (
            <span key={r.id}>{r.id}</span>
          )).reduce((acc, el, i) => (i ? [...acc, " · ", el] : [el]), [])}
        </span>
        <a
          href="https://arxiv.org/abs/2604.22748"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-auto hidden text-[11px] text-zinc-400 underline-offset-4 hover:text-white hover:underline md:inline"
        >
          arXiv:2604.22748
        </a>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/5 px-5 pb-5 pt-4 md:px-6 md:pb-6">
          <p className="text-xs leading-relaxed text-zinc-300 md:text-sm">
            Архитектурные семьи слева — это «как устроена модель». Чтобы понять,
            на что она способна, добавь ортогональную ось:{" "}
            <em>capability level</em> (что умеет) и{" "}
            <em>governing-law regime</em> (какие инварианты надо соблюдать).
            Это диагностический язык: где модель «честно симулирует», где «просто
            красиво генерит», а где — способна сама пересмотреть свой стэк.
          </p>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.id}
                className="rounded-xl border border-white/10 bg-black/25 p-3"
              >
                <div className="flex items-center gap-2">
                  <LevelBadge level={lvl.id} size="lg" />
                  <span className="text-[11px] leading-snug text-zinc-400">
                    {lvl.short}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-snug text-zinc-300">
                  {lvl.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {REGIMES.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/10 bg-black/25 p-2.5"
              >
                <RegimeBadge regime={r.id} size="lg" />
                <p className="mt-1.5 text-xs leading-snug text-zinc-300">
                  {r.short}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-zinc-500">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-[11px] uppercase tracking-wide text-zinc-500">
                Как читать карточку модели
              </div>
              <ul className="mt-1.5 space-y-1 text-xs leading-snug text-zinc-300">
                <li>
                  <span className="font-mono text-emerald-300">L1/L2/L3</span> —
                  максимальная стабильная capability семьи.
                </li>
                <li>
                  <span className="font-mono">
                    Physical / Digital / Social / Scientific
                  </span>{" "}
                  — покрываемые регимы.
                </li>
                <li>
                  <span className="font-mono">SI / FD / OD / ID</span> — 4
                  L1-оператора (state inference, forward dynamics, observation
                  decoding, inverse dynamics).
                </li>
                <li>
                  3 L2-полосы — long-horizon coherence, intervention sensitivity,
                  constraint consistency.
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-[11px] uppercase tracking-wide text-zinc-500">
                Почему это важно
              </div>
              <p className="mt-1.5 text-xs leading-snug text-zinc-300">
                Видео-генератор и MuZero оба формально «world models», но один —
                L2 только в смысле long-horizon coherence (без intervention
                sensitivity), а второй — наоборот. Рамка показывает, какого
                planner-критичного признака не хватает и где нужны constraints,
                верификаторы или L3-loop с пересмотром модели.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-amber-500/10 p-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[11px] uppercase tracking-wide text-zinc-400">
                Контур будущей world model
              </span>
              <span className="text-[11px] text-zinc-500">
                композиция компонентов из всех семей
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              {FUTURE_STACK.map((s, i, arr) => (
                <React.Fragment key={s}>
                  <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-zinc-200">
                    {s}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-zinc-600">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="mt-2 text-xs leading-snug text-zinc-400">
              Сильная world model вероятно будет гибридом: генеративная
              видео-симуляция даст rich prior, object-centric слой —
              структурные переменные, causal — интервенции и counterfactuals,
              Bayesian belief — неопределённость, hierarchy — длинный горизонт,
              а L3-evolver-loop позволит пересматривать стэк по новой evidence.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------------------------- Main ---------------------------------- */

const LEVEL_FILTERS = ["All", ...LEVELS.map((l) => l.id)];
const REGIME_FILTERS = ["All", ...REGIMES.map((r) => r.id)];

export default function WorldModelsMapSPA() {
  const [selectedId, setSelectedId] = useState("object-centric");
  const [cluster, setCluster] = useState("All");
  const [level, setLevel] = useState("All");
  const [regime, setRegime] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("horizon");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const activeFilterChips = [];
  if (cluster !== "All") activeFilterChips.push(cluster);
  if (level !== "All") activeFilterChips.push(level);
  if (regime !== "All") activeFilterChips.push(regime);

  const filtered = useMemo(
    () => filterAndSortModels(TYPES, cluster, query, sortBy, level, regime),
    [cluster, query, sortBy, level, regime]
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

        <TaxonomyOverview />

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[390px_1fr] lg:h-[calc(100vh-3rem)]">
          <aside className="space-y-4 lg:h-full lg:overflow-y-auto lg:pr-2 [scrollbar-gutter:stable]">
            <div className="rounded-[2rem] border border-white/10 bg-zinc-950/60 p-4 shadow-xl backdrop-blur lg:sticky lg:top-0 lg:z-10">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex w-full items-center gap-2 text-left text-white"
                aria-expanded={filtersOpen}
              >
                <FilterIcon className="h-4 w-4 text-white" />
                <span className="font-semibold">Фильтры</span>
                {activeFilterChips.length > 0 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-zinc-200">
                    {activeFilterChips.join(" · ")}
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-500">
                  {filtered.length} / {TYPES.length}
                </span>
                <ChevronIcon open={filtersOpen} />
              </button>

              <div className="relative mt-3">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="поиск: causal, slots, MPC..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-sm outline-none focus:border-white/40"
                />
              </div>

              {filtersOpen && (
                <>
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Архитектурный кластер
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {CLUSTERS.map((c) => (
                        <Pill
                          key={c}
                          active={cluster === c}
                          onClick={() => setCluster(c)}
                        >
                          {c}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Capability level
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {LEVEL_FILTERS.map((l) => (
                        <Pill
                          key={l}
                          active={level === l}
                          onClick={() => setLevel(l)}
                        >
                          {l}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Governing-law regime
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {REGIME_FILTERS.map((r) => (
                        <Pill
                          key={r}
                          active={regime === r}
                          onClick={() => setRegime(r)}
                        >
                          {r}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-zinc-400">
                      Сортировать по параметру
                    </label>
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
                </>
              )}
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
      </div>
    </div>
  );
}

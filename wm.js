import React, { useMemo, useState } from "react";
import katex from "katex";

/**
 * World Models Map SPA
 * - No external icon package
 * - No framer-motion dependency
 * - Includes lightweight self-tests for core logic
 */

/* ----------------------------- Inline SVG icons ---------------------------- */

function IconBase({ children, className = "h-5 w-5 text-white" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const BrainIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M9 3a3 3 0 0 0-3 3v1.2A3.8 3.8 0 0 0 3 11a3.8 3.8 0 0 0 2 3.34V16a3 3 0 0 0 3 3h1" />
    <path d="M15 3a3 3 0 0 1 3 3v1.2A3.8 3.8 0 0 1 21 11a3.8 3.8 0 0 1-2 3.34V16a3 3 0 0 1-3 3h-1" />
    <path d="M12 3v18" />
    <path d="M9 8h3" />
    <path d="M12 16H8.5" />
    <path d="M15 8h-3" />
    <path d="M12 12h4" />
  </IconBase>
);

const NetworkIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M10.5 6.9 6.7 15.2" />
    <path d="M13.5 6.9 17.3 15.2" />
    <path d="M7.5 18h9" />
  </IconBase>
);

const BoxesIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="m12 2 7 4-7 4-7-4 7-4Z" />
    <path d="M5 10l7 4 7-4" />
    <path d="M5 14l7 4 7-4" />
  </IconBase>
);

const GitBranchIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="18" cy="19" r="2" />
    <path d="M8 5h6" />
    <path d="M18 7v10" />
    <path d="M6 7v7c0 2 2 4 4 4h6" />
  </IconBase>
);

const FilmIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 5v14" />
    <path d="M17 5v14" />
    <path d="M3 9h4" />
    <path d="M17 9h4" />
    <path d="M3 15h4" />
    <path d="M17 15h4" />
  </IconBase>
);

const GamepadIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="9" width="18" height="8" rx="4" />
    <path d="M8 13H6" />
    <path d="M7 12v2" />
    <circle cx="16.5" cy="12.5" r="0.8" />
    <circle cx="18.5" cy="14.5" r="0.8" />
  </IconBase>
);

const GaugeIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 14a8 8 0 1 1 16 0" />
    <path d="M12 14l4-4" />
    <path d="M12 14v1" />
  </IconBase>
);

const SigmaIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M17 5H8l6 7-6 7h9" />
  </IconBase>
);

const SearchIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.2-4.2" />
  </IconBase>
);

const LayersIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 16 9 5 9-5" />
  </IconBase>
);

const AtomIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="1.8" />
    <ellipse cx="12" cy="12" rx="8" ry="3.8" />
    <ellipse cx="12" cy="12" rx="3.8" ry="8" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="3.8" ry="8" transform="rotate(-30 12 12)" />
  </IconBase>
);

const UsersIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="9" cy="8" r="2.5" />
    <circle cx="17" cy="9" r="2" />
    <path d="M4.5 18a4.5 4.5 0 0 1 9 0" />
    <path d="M14 18a3.5 3.5 0 0 1 7 0" />
  </IconBase>
);

const MemoryIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 3v3" />
    <path d="M12 3v3" />
    <path d="M15 3v3" />
    <path d="M9 18v3" />
    <path d="M12 18v3" />
    <path d="M15 18v3" />
    <path d="M3 9h3" />
    <path d="M3 12h3" />
    <path d="M3 15h3" />
    <path d="M18 9h3" />
    <path d="M18 12h3" />
    <path d="M18 15h3" />
  </IconBase>
);

const WorkflowIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="4" width="6" height="4" rx="1" />
    <rect x="15" y="4" width="6" height="4" rx="1" />
    <rect x="9" y="16" width="6" height="4" rx="1" />
    <path d="M9 6h6" />
    <path d="M12 8v8" />
  </IconBase>
);

const ExternalLinkIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M14 5h5v5" />
    <path d="M10 14 19 5" />
    <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
  </IconBase>
);

const FilterIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 6h16" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </IconBase>
);

const TargetIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </IconBase>
);

const SparklesIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    <path d="M5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" />
    <path d="M19 14l.7 1.8L21.5 16l-1.8.7L19 18.5l-.7-1.8L16.5 16l1.8-.2L19 14Z" />
  </IconBase>
);

const RouteIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 18h3a5 5 0 0 0 5-5V8" />
    <path d="M11 8h5" />
  </IconBase>
);

/* ---------------------------------- Axes ---------------------------------- */

const AXES = [
  { key: "representation", label: "Представление" },
  { key: "dynamics", label: "Динамика" },
  { key: "planning", label: "Планирование" },
  { key: "uncertainty", label: "Неопределённость" },
  { key: "causality", label: "Каузальность" },
  { key: "horizon", label: "Горизонт" },
];

/* --------------------------------- Models --------------------------------- */

const TYPES = [
  {
    id: "latent-rl",
    title: "Latent dynamics / RL WM",
    short:
      "Dreamer-like модели: учат компактную латентную динамику и тренируют политику на imagined rollouts.",
    icon: BrainIcon,
    color: "from-indigo-500 to-violet-500",
    cluster: "Control",
    tags: ["RSSM", "RL", "imagination", "pixels-to-latents"],
    scores: {
      representation: 3,
      dynamics: 5,
      planning: 4,
      uncertainty: 3,
      causality: 1,
      horizon: 4,
    },
    formula:
      "\\begin{aligned} z_t &\\sim q_\\phi(z_t \\mid x_{\\le t},\\, a_{<t}) \\\\ z_{t+1} &\\sim p_\\theta(z_{t+1} \\mid z_t,\\, a_t),\\quad a_t \\sim \\pi(a_t \\mid z_t) \\end{aligned}",
    pipeline: [
      "observation",
      "encoder",
      "latent state",
      "recurrent dynamics",
      "imagined rollout",
      "actor-critic",
    ],
    details:
      "Эта семья строит модель переходов в скрытом пространстве: наблюдение сжимается в z_t, затем dynamics model предсказывает будущие z_{t+k}, reward и value. Политика обучается не только на реальных переходах, но и на воображаемых траекториях. Сильная сторона — sample efficiency и единый pipeline для визуального RL; слабая — монолитность latent state и слабая интерпретируемость.",
    math: [
      { label: "posterior", tex: "q_\\phi(z_t \\mid x_{\\le t}, a_{<t})" },
      { label: "transition", tex: "p_\\theta(z_{t+1} \\mid z_t, a_t)" },
      {
        label: "objective",
        tex: "\\max_{\\pi}\\; \\mathbb{E}_{\\text{imagined}}\\!\\left[\\sum_{t} \\gamma^{t}\\, r_t\\right]",
      },
    ],
    works: [
      { name: "World Models — Ha & Schmidhuber, 2018", url: "https://arxiv.org/abs/1803.10122" },
      { name: "DreamerV3 — Hafner et al., 2023", url: "https://arxiv.org/abs/2301.04104" },
      { name: "Dreamer project page", url: "https://danijar.com/project/dreamerv3/" },
    ],
  },
  {
    id: "value-equivalent",
    title: "Value-equivalent planning WM",
    short:
      "MuZero-like: модель мира не обязана реконструировать пиксели; она должна быть полезной для value/policy search.",
    icon: RouteIcon,
    color: "from-blue-500 to-cyan-500",
    cluster: "Planning",
    tags: ["MuZero", "MCTS", "value-equivalence", "latent search"],
    scores: {
      representation: 3,
      dynamics: 4,
      planning: 5,
      uncertainty: 2,
      causality: 1,
      horizon: 4,
    },
    formula:
      "\\begin{aligned} h_0 &= f_\\theta(o_{1:t}) \\\\ h_{k+1},\\, \\hat r_k &= g_\\theta(h_k,\\, a_k) \\\\ \\hat\\pi_k,\\, \\hat v_k &= p_\\theta(h_k) \\end{aligned}",
    pipeline: [
      "observation",
      "representation",
      "latent dynamics",
      "policy/value head",
      "tree search",
      "action",
    ],
    details:
      "Value-equivalent WM оптимизирует не точность восстановления мира, а достаточность latent dynamics для планирования. Это архитектура для задач, где можно сделать lookahead search: latent state разворачивается по действиям, а policy/value heads направляют поиск. Отлично работает в играх и дискретном планировании, но не является физически реалистичным симулятором по умолчанию.",
    math: [
      { label: "representation", tex: "h_0 = f_\\theta(o_{1:t})" },
      { label: "dynamics", tex: "h_{k+1},\\, \\hat r_k = g_\\theta(h_k, a_k)" },
      { label: "prediction", tex: "p_\\theta(h_k) = (\\hat\\pi_k,\\, \\hat v_k)" },
    ],
    works: [
      { name: "MuZero — Schrittwieser et al., 2019/2020", url: "https://arxiv.org/abs/1911.08265" },
      {
        name: "DeepMind MuZero overview",
        url: "https://deepmind.google/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules/",
      },
    ],
  },
  {
    id: "mpc",
    title: "MPC / decoder-free control WM",
    short:
      "TD-MPC-like: implicit latent dynamics + reward/value prediction + online trajectory optimization.",
    icon: GaugeIcon,
    color: "from-teal-500 to-emerald-500",
    cluster: "Control",
    tags: ["MPC", "continuous control", "decoder-free", "latent planning"],
    scores: {
      representation: 3,
      dynamics: 5,
      planning: 5,
      uncertainty: 3,
      causality: 1,
      horizon: 3,
    },
    formula:
      "a^{*}_{0:H} = \\arg\\max_{a_{0:H}} \\sum_{t=0}^{H} \\gamma^{t}\\, \\hat r(z_t, a_t) + \\gamma^{H}\\, \\hat V(z_H)",
    pipeline: [
      "observation",
      "latent encoder",
      "implicit dynamics",
      "reward/value",
      "MPC",
      "continuous action",
    ],
    details:
      "Эти модели ориентированы не на генерацию кадров, а на управление. Они часто обходятся без pixel decoder: латент должен быть полезен для локальной оптимизации траекторий. Планировщик многократно оценивает candidate action sequences и выбирает действие с лучшей expected return.",
    math: [
      { label: "latent transition", tex: "z_{t+1} = f_\\theta(z_t, a_t)" },
      {
        label: "trajectory score",
        tex: "\\sum_{t=0}^{H} \\gamma^{t}\\, r(z_t, a_t) + \\gamma^{H}\\, V(z_H)",
      },
      { label: "control", tex: "\\text{receding-horizon MPC}" },
    ],
    works: [
      { name: "TD-MPC2 — Hansen, Su, Wang, 2023", url: "https://arxiv.org/abs/2310.16828" },
      { name: "TD-MPC2 project", url: "https://www.tdmpc2.com/" },
    ],
  },
  {
    id: "video-token",
    title: "Generative video / token WM",
    short:
      "Мир как последовательность visual/action/text tokens: хорошо для сценариев, видео-будущего и synthetic data.",
    icon: FilmIcon,
    color: "from-rose-500 to-orange-500",
    cluster: "Generative",
    tags: ["video", "tokens", "diffusion", "scenario generation"],
    scores: {
      representation: 4,
      dynamics: 4,
      planning: 2,
      uncertainty: 3,
      causality: 1,
      horizon: 3,
    },
    formula:
      "p(x_{t+1:T} \\mid x_{\\le t}, a_{\\le t}, c) = \\prod_{i} p(\\tau_i \\mid \\tau_{<i}, c)",
    pipeline: [
      "video/text/action",
      "tokenizer",
      "sequence model",
      "future tokens",
      "decoder",
      "video/scenario",
    ],
    details:
      "Эта линия переносит scaling recipe из LLM и video generation в world modeling. Видео, действия и условия переводятся в токены; transformer или diffusion-transformer моделирует будущую последовательность. Сильна в генерации реалистичных сценариев, но action causality и точное планирование часто остаются слабым местом.",
    math: [
      { label: "tokenization", tex: "x \\to \\tau_1, \\tau_2, \\ldots, \\tau_n" },
      { label: "autoregression", tex: "p(\\tau_i \\mid \\tau_{<i},\\, c)" },
      {
        label: "condition",
        tex: "c \\in \\{\\text{text},\\, \\text{action},\\, \\text{route},\\, \\text{ego},\\, \\text{camera}\\}",
      },
    ],
    works: [
      { name: "GAIA-1 — Wayve, 2023", url: "https://arxiv.org/abs/2309.17080" },
      { name: "GAIA-1 project page", url: "https://anthonyhu.github.io/gaia1" },
    ],
  },
  {
    id: "interactive",
    title: "Interactive environment generators",
    short:
      "Genie-like: генерируют playable/action-controllable миры, а не только пассивное видео.",
    icon: GamepadIcon,
    color: "from-fuchsia-500 to-pink-500",
    cluster: "Generative",
    tags: ["Genie", "interactive", "latent actions", "simulator"],
    scores: {
      representation: 4,
      dynamics: 4,
      planning: 3,
      uncertainty: 2,
      causality: 2,
      horizon: 4,
    },
    formula:
      "\\begin{aligned} \\hat a_t &\\sim q(\\hat a_t \\mid o_t,\\, o_{t+1}) \\\\ o_{t+1} &\\sim p(o_{t+1} \\mid o_{\\le t},\\, \\hat a_t,\\, \\text{prompt}) \\end{aligned}",
    pipeline: [
      "prompt/image",
      "video tokenizer",
      "latent actions",
      "autoregressive dynamics",
      "interactive rollout",
    ],
    details:
      "Interactive WM пытаются создать среду, в которой агент или пользователь может действовать. Важный компонент — latent action model: когда исходные интернет-видео не размечены действиями, модель должна вывести скрытые action tokens, которые позволяют контролировать будущее. Это мост между video generation и обучающими симуляторами для агентов.",
    math: [
      { label: "latent action inference", tex: "q(\\hat a_t \\mid o_t, o_{t+1})" },
      { label: "dynamics", tex: "p(o_{t+1} \\mid o_{\\le t}, \\hat a_t)" },
      { label: "goal", tex: "\\text{action-controllable, temporally persistent worlds}" },
    ],
    works: [
      { name: "Genie — Generative Interactive Environments, 2024", url: "https://arxiv.org/abs/2402.15391" },
      { name: "Google DeepMind Genie", url: "https://deepmind.google/models/genie/" },
    ],
  },
  {
    id: "object-centric",
    title: "Object-centric / object-oriented WM",
    short:
      "Мир как набор объектов, атрибутов и отношений; динамика через GNN, relational attention или rules.",
    icon: BoxesIcon,
    color: "from-amber-500 to-yellow-500",
    cluster: "Structure",
    tags: ["slots", "objects", "relations", "GNN", "compositionality"],
    scores: {
      representation: 5,
      dynamics: 4,
      planning: 4,
      uncertainty: 2,
      causality: 3,
      horizon: 4,
    },
    formula:
      "\\begin{aligned} S_t &= \\{o_t^{i}\\}_{i=1}^{N} \\\\ o_{t+1}^{i} &= f_\\theta\\!\\left(o_t^{i},\\; \\textstyle\\sum_{j \\ne i} m_\\theta(o_t^{i},\\, o_t^{j}),\\; a_t\\right) \\end{aligned}",
    pipeline: [
      "pixels/state",
      "object slots",
      "relation graph",
      "message passing",
      "object transitions",
      "planner",
    ],
    details:
      "Object-centric WM факторизует сцену на сущности. Динамика задаётся не монолитным latent transition, а изменением объектов под влиянием действий и взаимодействий. Это даёт сильное композиционное обобщение: новые комбинации знакомых объектов проще переносить, чем полностью новые пиксельные сцены. Object-oriented вариант может начинаться не с пикселей, а с уже заданных объектов, attributes и predicates.",
    math: [
      { label: "object set", tex: "S_t = \\{o_t^{1}, \\ldots, o_t^{N}\\}" },
      { label: "messages", tex: "m_{ij} = \\varphi(o_i, o_j, e_{ij})" },
      { label: "update", tex: "o'_i = \\psi\\!\\left(o_i,\\, \\textstyle\\sum_{j} m_{ij},\\, a_t\\right)" },
    ],
    works: [
      { name: "Slot Attention — Locatello et al., 2020", url: "https://arxiv.org/abs/2006.15055" },
      { name: "Interaction Networks — Battaglia et al., 2016", url: "https://arxiv.org/abs/1612.00222" },
      { name: "Object-Oriented World Models — Zhao et al.", url: "https://lfzhao.com/oowm/" },
    ],
  },
  {
    id: "causal",
    title: "Causal WM",
    short:
      "Модель причинных переменных, графа и структурных уравнений; отвечает на do(), counterfactual и distribution shift.",
    icon: GitBranchIcon,
    color: "from-red-500 to-rose-500",
    cluster: "Structure",
    tags: ["SCM", "interventions", "counterfactuals", "robustness"],
    scores: {
      representation: 4,
      dynamics: 4,
      planning: 5,
      uncertainty: 4,
      causality: 5,
      horizon: 5,
    },
    formula:
      "\\begin{aligned} X_i &:= f_i(\\mathrm{PA}_i,\\, U_i) \\\\ p\\!\\left(x' \\mid \\mathrm{do}(a),\\, x\\right) &\\ne p(x' \\mid a, x) \\end{aligned}",
    pipeline: [
      "observations",
      "causal variables",
      "graph discovery",
      "structural equations",
      "interventions",
      "counterfactual planner",
    ],
    details:
      "Causal WM отличается от predictive WM тем, что моделирует не только статистические переходы, а причинные механизмы. Для агента действие является интервенцией do(a), поэтому causal dynamics лучше подходят для robust planning, объяснений и переноса между доменами. Главная трудность — causal representation learning: как из сенсорных данных получить переменные с причинной семантикой.",
    math: [
      { label: "SCM", tex: "X_i := f_i(\\mathrm{PA}_i,\\, U_i)" },
      { label: "intervention", tex: "\\mathrm{do}(A := a)" },
      { label: "counterfactual", tex: "Y_{A \\leftarrow a'} \\mid E" },
    ],
    works: [
      { name: "Robust agents learn causal world models — ICLR 2024", url: "https://arxiv.org/abs/2402.10877" },
      { name: "Causal Representation Learning — Schölkopf et al.", url: "https://arxiv.org/abs/2102.11107" },
      { name: "The Book of Why / SCM background", url: "https://bayes.cs.ucla.edu/WHY/" },
    ],
  },
  {
    id: "hierarchical",
    title: "Hierarchical WM",
    short:
      "Моделируют мир на нескольких временных масштабах: моторика, объекты, навыки, цели.",
    icon: LayersIcon,
    color: "from-sky-500 to-blue-600",
    cluster: "Abstraction",
    tags: ["options", "skills", "temporal abstraction", "long horizon"],
    scores: {
      representation: 4,
      dynamics: 4,
      planning: 5,
      uncertainty: 3,
      causality: 2,
      horizon: 5,
    },
    formula:
      "p(s_{t+K} \\mid s_t, \\omega) = \\prod_{k=0}^{K-1} p(s_{t+k+1} \\mid s_{t+k}, a_{t+k})",
    pipeline: [
      "low-level state",
      "skills/options",
      "abstract state",
      "high-level planner",
      "controller",
    ],
    details:
      "Иерархические WM нужны для длинных задач. Низкий уровень моделирует физические переходы, средний — skills/options и affordances, высокий — цели и подзадачи. Вместо симуляции каждого микродвижения high-level planner выбирает абстрактные действия, а low-level controller реализует их.",
    math: [
      { label: "option model", tex: "P(s' \\mid s, \\omega)" },
      {
        label: "semi-MDP value",
        tex: "V(s) = \\max_{\\omega}\\; \\mathbb{E}\\!\\left[R_\\omega + \\gamma^{\\tau} V(s')\\right]",
      },
      { label: "abstraction", tex: "\\text{reduces effective planning depth}" },
    ],
    works: [
      { name: "Options framework — Sutton, Precup, Singh, 1999", url: "https://www.sciencedirect.com/science/article/pii/S0004370299000521" },
      { name: "FeUdal Networks — Vezhnevets et al., 2017", url: "https://arxiv.org/abs/1703.01161" },
    ],
  },
  {
    id: "bayesian",
    title: "Bayesian / belief-state WM",
    short:
      "Модель не одного мира, а распределения возможных миров; ключ к POMDP, exploration и risk-aware control.",
    icon: SigmaIcon,
    color: "from-purple-500 to-indigo-600",
    cluster: "Uncertainty",
    tags: ["POMDP", "belief", "ensembles", "particles", "risk"],
    scores: {
      representation: 4,
      dynamics: 4,
      planning: 4,
      uncertainty: 5,
      causality: 2,
      horizon: 4,
    },
    formula:
      "b_{t+1}(s') = \\eta\\, p(o_{t+1} \\mid s') \\sum_{s} p(s' \\mid s, a_t)\\, b_t(s)",
    pipeline: [
      "observation",
      "belief update",
      "stochastic dynamics",
      "uncertainty",
      "risk-aware planner",
    ],
    details:
      "В частично наблюдаемых мирах агент не знает состояние напрямую. Поэтому world model должна поддерживать belief state — распределение над возможными состояниями. Это даёт calibrated uncertainty, active exploration и более безопасное планирование. Практически это реализуют через stochastic latent models, ensembles, particle filters или Bayesian neural nets.",
    math: [
      { label: "belief", tex: "b_t(s) = P(s_t = s \\mid o_{\\le t}, a_{<t})" },
      { label: "Bayes filter", tex: "b_{t+1} \\propto p(o_{t+1} \\mid s')\\, \\textstyle\\sum_{s} p(s' \\mid s, a_t)\\, b_t(s)" },
      { label: "objective", tex: "\\max_{\\pi}\\; \\mathbb{E}_{b}[U] \\;\\;\\text{or}\\;\\; \\text{CVaR}_{\\alpha}" },
    ],
    works: [
      { name: "POMDP survey — Kaelbling, Littman, Cassandra", url: "https://www.sciencedirect.com/science/article/pii/S000437029800023X" },
      { name: "Probabilistic Ensembles with Trajectory Sampling — PETS", url: "https://arxiv.org/abs/1805.12114" },
    ],
  },
  {
    id: "memory",
    title: "Memory-augmented WM",
    short:
      "World state обновляется с episodic, semantic, spatial и procedural memory; не только текущий контекст.",
    icon: MemoryIcon,
    color: "from-lime-500 to-green-600",
    cluster: "Memory",
    tags: ["episodic memory", "spatial memory", "retrieval", "persistence"],
    scores: {
      representation: 4,
      dynamics: 3,
      planning: 4,
      uncertainty: 3,
      causality: 2,
      horizon: 5,
    },
    formula:
      "\\begin{aligned} z_t &= f(o_t,\\, h_{t-1},\\, R(M,\\, q_t)) \\\\ M &\\leftarrow \\mathrm{update}(M,\\, o_t,\\, z_t) \\end{aligned}",
    pipeline: [
      "observation",
      "query",
      "memory retrieval",
      "state update",
      "prediction",
      "memory write",
    ],
    details:
      "Memory-augmented WM нужна для постоянства мира: объект может уйти из кадра, но агент должен помнить, где он был. Память бывает episodic, semantic, spatial, procedural и social. Архитектурно это retrieval-augmented state update: текущее наблюдение соединяется с релевантными воспоминаниями и обновляет world state.",
    math: [
      { label: "retrieval", tex: "m_t = R(M, q_t)" },
      { label: "state update", tex: "z_t = f(o_t,\\, h_{t-1},\\, m_t)" },
      { label: "write", tex: "M \\leftarrow W(M, z_t, o_t)" },
    ],
    works: [
      { name: "Neural Turing Machines — Graves et al.", url: "https://arxiv.org/abs/1410.5401" },
      { name: "Differentiable Neural Computers — DeepMind", url: "https://www.nature.com/articles/nature20101" },
    ],
  },
  {
    id: "neurosymbolic",
    title: "Programmatic / neuro-symbolic WM",
    short:
      "Переходы мира представлены правилами, predicates, constraints или программами поверх learned perception.",
    icon: WorkflowIcon,
    color: "from-slate-600 to-zinc-800",
    cluster: "Structure",
    tags: ["symbols", "rules", "predicates", "program induction", "planning"],
    scores: {
      representation: 5,
      dynamics: 3,
      planning: 5,
      uncertainty: 2,
      causality: 4,
      horizon: 5,
    },
    formula:
      "\\begin{aligned} P_1(s) \\wedge \\mathrm{action}(a) &\\;\\Rightarrow\\; P_2(s') \\\\ \\Pi^{*} &= \\arg\\min_{\\Pi}\\; \\mathrm{cost}\\!\\left(\\mathrm{Exec}(\\Pi,\\, W)\\right) \\end{aligned}",
    pipeline: [
      "perception",
      "symbols/predicates",
      "rules/programs",
      "symbolic planner",
      "executor",
    ],
    details:
      "Эта линия делает world model более дискретной и проверяемой. Перцепция может быть нейросетевой, но переходы задаются правилами, логикой или программами. Сильные стороны — interpretability, long-horizon reasoning и constraints; слабые — grounding, brittle symbol extraction и трудность обучения из сырых данных.",
    math: [
      { label: "state", tex: "S = \\{ P_i(\\mathrm{obj}_j) \\}" },
      { label: "rule", tex: "\\text{pre}(s) \\wedge a \\;\\Rightarrow\\; \\text{eff}(s')" },
      { label: "planning", tex: "\\Pi^{*} = \\arg\\min_{\\Pi}\\; \\mathrm{cost}(\\Pi)" },
    ],
    works: [
      { name: "Neural-Symbolic Learning and Reasoning survey", url: "https://arxiv.org/abs/1711.03902" },
      { name: "STRIPS background", url: "https://ai.stanford.edu/~nilsson/OnlinePubs-Nils/PublishedPapers/strips.pdf" },
    ],
  },
  {
    id: "hybrid-physics",
    title: "Hybrid physics / differentiable simulator WM",
    short:
      "Known physics engine + learned residual dynamics + differentiable rendering / system identification.",
    icon: AtomIcon,
    color: "from-cyan-500 to-teal-600",
    cluster: "Embodiment",
    tags: ["physics", "sim-to-real", "residual dynamics", "differentiable sim"],
    scores: {
      representation: 4,
      dynamics: 5,
      planning: 4,
      uncertainty: 3,
      causality: 4,
      horizon: 4,
    },
    formula:
      "s_{t+1} = F_{\\text{phys}}(s_t, a_t;\\, \\theta) + \\Delta_{\\psi}(s_t, a_t)",
    pipeline: [
      "state estimate",
      "physics simulator",
      "learned residual",
      "differentiable rollout",
      "control",
    ],
    details:
      "В роботике часто выгодно не учить физику с нуля. Hybrid WM использует известный simulator или уравнения движения, а нейросеть доучивает residual dynamics, контакты, трение, domain gaps. Это хорошо для sim-to-real, system identification и differentiable planning.",
    math: [
      { label: "base physics", tex: "F_{\\text{phys}}(s, a;\\, \\theta)" },
      { label: "residual", tex: "\\Delta_{\\psi}(s, a)" },
      {
        label: "calibration",
        tex: "\\theta^{*},\\, \\psi^{*} = \\arg\\min_{\\theta, \\psi}\\; \\mathcal{L}_{\\text{rollout}}",
      },
    ],
    works: [
      { name: "Differentiable Physics survey", url: "https://arxiv.org/abs/2109.07573" },
      { name: "Brax differentiable physics", url: "https://github.com/google/brax" },
    ],
  },
  {
    id: "multi-agent",
    title: "Multi-agent / theory-of-mind WM",
    short:
      "Модель мира включает beliefs, goals, policies и знания других агентов.",
    icon: UsersIcon,
    color: "from-violet-500 to-purple-700",
    cluster: "Social",
    tags: ["ToM", "opponent modeling", "intentions", "joint future"],
    scores: {
      representation: 5,
      dynamics: 4,
      planning: 5,
      uncertainty: 5,
      causality: 3,
      horizon: 5,
    },
    formula:
      "\\begin{aligned} s' &\\sim p(s' \\mid s,\\, a^{1}, \\ldots, a^{n}) \\\\ a^{j} &\\sim \\pi_j(a \\mid b_j,\\, g_j) \\end{aligned}",
    pipeline: [
      "environment",
      "agent models",
      "belief/goal inference",
      "joint rollout",
      "strategic planner",
    ],
    details:
      "В социальном мире динамика зависит от других агентов. Такая WM должна предсказывать не только физические события, но и действия других: их цели, убеждения, знания и стратегию. Это важно для переговоров, игр, автономного вождения, роботов рядом с людьми и LLM-агентов.",
    math: [
      { label: "joint transition", tex: "P(s' \\mid s, a_1, \\ldots, a_n)" },
      { label: "opponent policy", tex: "\\pi_j(a \\mid b_j, g_j)" },
      {
        label: "recursive belief",
        tex: "B_i^{(k)} = \\mathbb{E}\\!\\left[\\, B_j^{(k-1)} \\,\\right]",
      },
    ],
    works: [
      { name: "Machine Theory of Mind — Rabinowitz et al.", url: "https://arxiv.org/abs/1802.07740" },
      { name: "Opponent Modeling in Deep RL survey", url: "https://arxiv.org/abs/2206.09961" },
    ],
  },
  {
    id: "jepa-ebm",
    title: "JEPA / energy-based predictive WM",
    short:
      "Предсказывают будущие представления или совместимость состояний, а не пиксели напрямую.",
    icon: SparklesIcon,
    color: "from-orange-500 to-red-600",
    cluster: "Representation",
    tags: ["JEPA", "EBM", "self-supervised", "future embeddings"],
    scores: {
      representation: 5,
      dynamics: 3,
      planning: 3,
      uncertainty: 4,
      causality: 1,
      horizon: 3,
    },
    formula:
      "\\begin{aligned} \\hat y &= f_\\theta(x_{\\text{ctx}}) \\approx g(x_{\\text{fut}}) \\\\ E_\\theta(z_t,\\, a_t,\\, z_{t+1}) &\\to \\min \\;\\;\\text{for valid transitions} \\end{aligned}",
    pipeline: [
      "context",
      "encoder",
      "predictor / energy",
      "future embedding",
      "representation loss",
    ],
    details:
      "JEPA-like модели учатся предсказывать абстрактные представления будущего, а не каждый пиксель. Energy-based WM задают не явный next-state predictor, а функцию совместимости перехода. Это полезно для мультимодальных будущих, self-supervised learning и constraint-style reasoning, но для прямого control часто нужен дополнительный planner или policy head.",
    math: [
      { label: "JEPA", tex: "\\hat y = f_\\theta(x_{\\text{ctx}}) \\approx g(x_{\\text{fut}})" },
      { label: "EBM", tex: "E_\\theta(s, a, s') \\to \\min \\;\\;\\text{for valid transitions}" },
      {
        label: "objective",
        tex: "\\min_{\\theta}\\; \\mathcal{L}_{\\text{contrast}} \\;\\;\\text{or}\\;\\; \\mathcal{L}_{\\text{VICReg}}",
      },
    ],
    works: [
      { name: "I-JEPA — Assran et al., 2023", url: "https://arxiv.org/abs/2301.08243" },
      { name: "A Path Towards Autonomous Machine Intelligence — LeCun", url: "https://openreview.net/forum?id=BZ5a1r-kVsf" },
      { name: "Energy-Based Models overview — LeCun et al.", url: "http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf" },
    ],
  },
];

const CLUSTERS = ["All", ...Array.from(new Set(TYPES.map((t) => t.cluster)))];

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

// Run tests in environments where console.assert is visible.
// Safe because failures only log in console.
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

function MiniRadar({ model }) {
  const values = AXES.map((a) => model.scores[a.key]);
  const max = 5;
  const cx = 40;
  const cy = 40;
  const radius = 32;

  const points = values
    .map((v, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / values.length;
      const r = radius * (v / max);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");

  const outer = AXES.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / values.length;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
      <polygon points={outer} fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="1" />
      {AXES.map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / values.length;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,.12)"
          />
        );
      })}
      <polygon points={points} fill="rgba(255,255,255,.25)" stroke="white" strokeWidth="1.5" />
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

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <TargetIcon className="h-4 w-4 text-white" />
            Архитектурная суть
          </h4>
          <p className="mt-3 leading-relaxed text-zinc-300">{model.details}</p>
        </div>
        <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <MiniRadar model={model} />
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

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[.05] p-4">
          <h4 className="flex items-center gap-2 font-semibold text-white">
            <SigmaIcon className="h-4 w-4 text-white" />
            Математика
          </h4>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <MathBlock tex={model.formula} />
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {model.math.map((m) => {
              const item = typeof m === "string" ? { tex: m } : m;
              return (
                <li
                  key={(item.label || "") + item.tex}
                  className="flex items-center gap-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 px-3 py-2"
                >
                  {item.label && (
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-300">
                      {item.label}
                    </span>
                  )}
                  <MathInline tex={item.tex} className="text-zinc-100" />
                </li>
              );
            })}
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

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[390px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-zinc-950/60 p-4 shadow-xl backdrop-blur">
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

          <main className="self-start lg:sticky lg:top-6">
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

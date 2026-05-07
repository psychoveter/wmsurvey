import {
  BrainIcon,
  RouteIcon,
  GaugeIcon,
  FilmIcon,
  GamepadIcon,
  BoxesIcon,
  GitBranchIcon,
  LayersIcon,
  SigmaIcon,
  MemoryIcon,
  WorkflowIcon,
  AtomIcon,
  UsersIcon,
  NetworkIcon,
  SparklesIcon,
} from "./icons.jsx";

export const AXES = [
  { key: "representation", label: "Представление" },
  { key: "dynamics", label: "Динамика" },
  { key: "planning", label: "Планирование" },
  { key: "uncertainty", label: "Неопределённость" },
  { key: "causality", label: "Каузальность" },
  { key: "horizon", label: "Горизонт" },
];

// ──────────────────────────────────────────────────────────────────────────
// «Levels × Laws» таксономия из Agentic World Modeling (arXiv:2604.22748).
// Это ортогональная архитектурным семьям ось: capability level (L1/L2/L3) и
// governing-law regime (Physical / Digital / Social / Scientific).
// ──────────────────────────────────────────────────────────────────────────

export const LEVELS = [
  {
    id: "L1",
    name: "Predictor",
    short: "локальная одношаговая марковская предикция",
    desc: "Оператор p_θ(z_t | z_{t-1}, a_t) и сопровождающие state inference, observation decoding и inverse dynamics. Гарантирует точность на одном шаге, не гарантирует когерентности при композиции.",
    badge: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  },
  {
    id: "L2",
    name: "Simulator",
    short: "многошаговый rollout с интервенциями и проверкой инвариантов",
    desc: "Композиция L1-операторов в траектории p̂(τ | z_0, a_{1:H}, c). Должен удовлетворять long-horizon coherence, intervention sensitivity и constraint consistency.",
    badge: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  },
  {
    id: "L3",
    name: "Evolver",
    short: "пересмотр самой модели по новой evidence",
    desc: "Цикл (M_t, d_t) → M_{t+1}: design → execute → observe → reflect. Diagnose, distill в reusable assets, governed validation. Ядро autonomous discovery.",
    badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  },
];

export const REGIMES = [
  {
    id: "Physical",
    short: "контактная динамика, кинематика, robotics, видеогенерация",
    desc: "Контакт, гравитация, energy conservation, kinematic feasibility. Ground truth обычно проверяется аналитически или physics engine'ом.",
    badge: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  },
  {
    id: "Digital",
    short: "программные семантики: API, DOM, GUI, code execution",
    desc: "Детерминированные программы, типы, state machines. Constraint check механически проверяем (запустить → сравнить).",
    badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  },
  {
    id: "Social",
    short: "beliefs, goals, norms; multi-agent, диалоги, ToM",
    desc: "Reflexive (вера меняет состояние) + normative (что должно быть). Коммитменты, роли, нормы, repeating self-reference.",
    badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  },
  {
    id: "Scientific",
    short: "латентные каузальные механизмы, экспериментальная валидация",
    desc: "Управляющие уравнения известны лишь частично. Constraint check — через измерение / эксперимент, не через closed-form.",
    badge: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  },
];

export const L1_OP_LABELS = {
  SI: "State inference",
  FD: "Forward dynamics",
  OD: "Observation decoding",
  ID: "Inverse dynamics",
};

export const L2_COND_LABELS = {
  coherence: "Long-horizon coherence",
  intervention: "Intervention sensitivity",
  constraint: "Constraint consistency",
};

// ──────────────────────────────────────────────────────────────────────────

export const TYPES = [
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
    level: "L2",
    regimes: ["Physical"],
    l1Ops: { SI: true, FD: true, OD: true, ID: false },
    l2Conditions: { coherence: 4, intervention: 4, constraint: 2 },
    levelNote:
      "В режиме single-step prediction работает как L1; при тренировке политики на imagined rollouts превращается в L2-симулятор. До L3 не доходит — модель не пересматривает свою архитектуру по evidence.",
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
      {
        label: "posterior",
        tex: "q_\\phi(z_t \\mid x_{\\le t},\\, a_{<t})",
        desc: "Энкодер, который выводит распределение латента из истории наблюдений и действий. В RSSM это амортизированный variational posterior.",
      },
      {
        label: "transition",
        tex: "p_\\theta(z_{t+1} \\mid z_t,\\, a_t)",
        desc: "Прогноз следующего латента. В Dreamer это рекуррентная state-space модель: детерминированная часть (RNN) + стохастическая (Gaussian/Categorical).",
      },
      {
        label: "objective",
        tex: "\\max_{\\pi}\\; \\mathbb{E}_{\\text{imagined}}\\!\\left[\\sum_{t} \\gamma^{t}\\, r_t\\right]",
        desc: "Actor-critic обучается на воображаемых траекториях из dynamics model: пишем bellman-эстиматы по imagined rollouts, без обращения к среде.",
      },
    ],
    notation: [
      { sym: "x_t", desc: "наблюдение в момент t (например, кадр)" },
      { sym: "z_t", desc: "латентное состояние мира (low-dim)" },
      { sym: "a_t", desc: "действие агента" },
      { sym: "r_t", desc: "награда" },
      { sym: "\\pi(a \\mid z)", desc: "политика" },
      { sym: "q_\\phi", desc: "энкодер / posterior, параметры \\phi" },
      { sym: "p_\\theta", desc: "transition / prior, параметры \\theta" },
      { sym: "\\gamma", desc: "discount factor, \\gamma \\in [0,1)" },
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
    level: "L2",
    regimes: ["Digital", "Physical"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 5, intervention: 5, constraint: 3 },
    levelNote:
      "Полноценный L2 в правилах игр и Atari: latent-search в дереве — это интервенционные rollouts. Constraint consistency встроена в value-equivalence: latent отвечает за то, что важно для исхода.",
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
      {
        label: "representation",
        tex: "h_0 = f_\\theta(o_{1:t})",
        desc: "Representation network: история наблюдений превращается в скрытый корневой стейт дерева поиска.",
      },
      {
        label: "dynamics",
        tex: "h_{k+1},\\, \\hat r_k = g_\\theta(h_k,\\, a_k)",
        desc: "Dynamics network: имитирует один шаг среды в латенте — выдаёт следующий h и предсказанную награду. Pixels не реконструируются.",
      },
      {
        label: "prediction",
        tex: "p_\\theta(h_k) = (\\hat\\pi_k,\\, \\hat v_k)",
        desc: "Prediction network: для каждого узла дерева оценивает policy prior и value, чтобы направлять MCTS.",
      },
    ],
    notation: [
      { sym: "o_{1:t}", desc: "история наблюдений до момента t" },
      { sym: "h_k", desc: "латентный стейт на глубине k в дереве поиска" },
      { sym: "a_k", desc: "действие, ведущее в дочерний узел" },
      { sym: "\\hat r_k", desc: "предсказанная награда после действия a_k" },
      { sym: "\\hat v_k", desc: "value-оценка узла h_k" },
      { sym: "\\hat\\pi_k", desc: "policy prior для расширения узла" },
      { sym: "f_\\theta, g_\\theta, p_\\theta", desc: "representation / dynamics / prediction сети" },
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
    level: "L2",
    regimes: ["Physical"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 3, intervention: 5, constraint: 2 },
    levelNote:
      "L2 на коротком receding-horizon. Long-horizon coherence слабая (короткое окно H), но intervention sensitivity максимальная — это и есть смысл MPC.",
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
      {
        label: "latent transition",
        tex: "z_{t+1} = f_\\theta(z_t,\\, a_t)",
        desc: "Implicit dynamics в латенте, обучаются под reward/value, а не под реконструкцию пикселей.",
      },
      {
        label: "trajectory score",
        tex: "\\sum_{t=0}^{H} \\gamma^{t}\\, r(z_t, a_t) + \\gamma^{H}\\, V(z_H)",
        desc: "Скор кандидата на горизонте H: сумма дисконтированных предсказанных наград плюс terminal value, чтобы покрыть бесконечный хвост.",
      },
      {
        label: "control",
        tex: "a^{*}_{0:H} = \\arg\\max_{a_{0:H}}\\; \\text{score}",
        desc: "Receding-horizon MPC (CEM/MPPI): сэмплируем последовательности действий, оптимизируем, выполняем первое действие, перепланируем.",
      },
    ],
    notation: [
      { sym: "z_t", desc: "латентное состояние" },
      { sym: "a_t", desc: "непрерывное действие (вектор)" },
      { sym: "\\hat r(z, a)", desc: "предсказанная награда в латенте" },
      { sym: "\\hat V(z_H)", desc: "terminal value на горизонте H" },
      { sym: "H", desc: "горизонт планирования" },
      { sym: "\\gamma", desc: "discount factor" },
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
    level: "L2",
    regimes: ["Physical"],
    l1Ops: { SI: true, FD: true, OD: true, ID: false },
    l2Conditions: { coherence: 4, intervention: 2, constraint: 2 },
    levelNote:
      "L2 в смысле long-horizon генерации, но intervention sensitivity и constraint consistency остаются слабыми: «look like the world» ≠ «look like the constraints» (см. survey §4.3 о failure modes).",
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
      {
        label: "tokenization",
        tex: "x \\to \\tau_1, \\tau_2, \\ldots, \\tau_n",
        desc: "VQ-VAE / discrete или patch-tokenizer переводит видео и состояние в дискретные/латентные токены.",
      },
      {
        label: "autoregression",
        tex: "p(\\tau_i \\mid \\tau_{<i},\\, c)",
        desc: "Авторегрессивный (или diffusion) sequence model по всему окну токенов с условием c.",
      },
      {
        label: "condition",
        tex: "c \\in \\{\\text{text},\\, \\text{action},\\, \\text{route},\\, \\text{ego},\\, \\text{camera}\\}",
        desc: "Условие позволяет управлять генерацией: текстовый промпт, маршрут, состояние эго-машины, камера и т.п.",
      },
    ],
    notation: [
      { sym: "x_t", desc: "видео-кадр (или мультимодальный фрейм) в момент t" },
      { sym: "T", desc: "длина генерируемого окна" },
      { sym: "\\tau_i", desc: "i-й токен в плоской последовательности" },
      { sym: "c", desc: "условие генерации (текст, действие, маршрут…)" },
      { sym: "a_t", desc: "действие/команда" },
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
    level: "L2",
    regimes: ["Physical", "Digital"],
    l1Ops: { SI: true, FD: true, OD: true, ID: true },
    l2Conditions: { coherence: 4, intervention: 3, constraint: 2 },
    levelNote:
      "Единственная семья здесь, где inverse dynamics — основной операционный модуль (LAM). Это даёт явный «руль» в неразмеченном видео и поднимает intervention sensitivity, но constraint consistency всё ещё на уровне видео-генератора.",
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
      {
        label: "latent action inference",
        tex: "q(\\hat a_t \\mid o_t,\\, o_{t+1})",
        desc: "LAM (latent action model) выводит скрытое действие из пары соседних кадров — это даёт «руль» в неразмеченном видео.",
      },
      {
        label: "dynamics",
        tex: "p(o_{t+1} \\mid o_{\\le t},\\, \\hat a_t)",
        desc: "Условная авторегрессия: следующий кадр зависит от истории и от выбранного латентного действия.",
      },
      {
        label: "goal",
        tex: "\\text{action-controllable, temporally persistent worlds}",
        desc: "Цель — мир, в котором одно и то же действие даёт согласованный, временно-устойчивый эффект.",
      },
    ],
    notation: [
      { sym: "o_t", desc: "наблюдение/кадр" },
      { sym: "\\hat a_t", desc: "латентное (выученное) действие, дискретный токен" },
      { sym: "q(\\cdot)", desc: "inference-распределение latent action" },
      { sym: "p(\\cdot)", desc: "генеративная dynamics-модель" },
      { sym: "\\text{prompt}", desc: "стартовое условие — изображение или текст" },
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
    level: "L2",
    regimes: ["Physical"],
    l1Ops: { SI: true, FD: true, OD: true, ID: false },
    l2Conditions: { coherence: 4, intervention: 4, constraint: 4 },
    levelNote:
      "Композиционность даёт сильную constraint consistency: при правильной факторизации объекты не «плавятся». Хорошо обобщается на новые комбинации.",
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
      {
        label: "object set",
        tex: "S_t = \\{o_t^{1}, \\ldots, o_t^{N}\\}",
        desc: "Состояние мира — множество N слотов; каждый слот описывает один объект (позиция, скорость, тип, атрибуты).",
      },
      {
        label: "messages",
        tex: "m_{ij} = \\varphi(o_i,\\, o_j,\\, e_{ij})",
        desc: "Парная функция взаимодействия (GNN edge): что объект j делает с объектом i по ребру e_{ij}.",
      },
      {
        label: "update",
        tex: "o'_i = \\psi\\!\\left(o_i,\\; \\textstyle\\sum_{j} m_{ij},\\; a_t\\right)",
        desc: "Обновление слота i по агрегированным сообщениям от соседей и собственному действию.",
      },
    ],
    notation: [
      { sym: "S_t", desc: "состояние сцены = множество объектов" },
      { sym: "o_t^i", desc: "представление i-го объекта" },
      { sym: "N", desc: "число слотов / объектов" },
      { sym: "m_{ij}", desc: "сообщение от объекта j объекту i" },
      { sym: "e_{ij}", desc: "признак ребра / отношения (тип контакта и т.п.)" },
      { sym: "\\varphi, \\psi", desc: "edge- и node-функции (MLPs)" },
      { sym: "a_t", desc: "действие агента, влияющее на сцену" },
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
    level: "L2",
    regimes: ["Physical", "Social", "Scientific"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 4, intervention: 5, constraint: 5 },
    levelNote:
      "Лучший кандидат среди learned WM на роль шага к L3: интервенции и причинные правки графа — это и есть «реконструкция модели по evidence». Полноценный L3-loop обычно требует дополнительной petli causal discovery.",
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
      {
        label: "SCM",
        tex: "X_i := f_i(\\mathrm{PA}_i,\\, U_i)",
        desc: "Структурное уравнение: значение каждой переменной — детерминированная функция её родителей в графе и независимого шума U_i.",
      },
      {
        label: "intervention",
        tex: "\\mathrm{do}(A := a)",
        desc: "do-оператор обрезает входящие рёбра в A и фиксирует A=a; это не то же самое, что conditioning на A=a.",
      },
      {
        label: "counterfactual",
        tex: "Y_{A \\leftarrow a'} \\mid E",
        desc: "Контрфактуал: «что было бы с Y, если бы A было a' при тех же exogenous noise, что и наблюдаемое E».",
      },
    ],
    notation: [
      { sym: "X_i", desc: "i-я каузальная переменная" },
      { sym: "\\mathrm{PA}_i", desc: "родители X_i в каузальном графе" },
      { sym: "U_i", desc: "exogenous noise (независимая случайность)" },
      { sym: "f_i", desc: "структурная функция / закон" },
      { sym: "\\mathrm{do}(A=a)", desc: "интервенция: жёсткая установка A=a" },
      { sym: "Y_{A \\leftarrow a'}", desc: "контрфактуальное Y при гипотетическом A=a'" },
      { sym: "E", desc: "наблюдаемые свидетельства (evidence)" },
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
    level: "L2",
    regimes: ["Physical", "Digital"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 5, intervention: 4, constraint: 3 },
    levelNote:
      "Главный выигрыш — long-horizon coherence: эффективная глубина rollout сокращается в число раз, равное средней длине навыка.",
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
      {
        label: "option model",
        tex: "P(s' \\mid s, \\omega)",
        desc: "Закрытая модель навыка ω: распределение конечных стейтов и времени завершения, не разворачивая каждый шаг.",
      },
      {
        label: "semi-MDP value",
        tex: "V(s) = \\max_{\\omega}\\; \\mathbb{E}\\!\\left[R_\\omega + \\gamma^{\\tau} V(s')\\right]",
        desc: "Bellman-уравнение в semi-MDP: дисконт работает через длительность опции τ, а не через каждый низкоуровневый шаг.",
      },
      {
        label: "abstraction",
        tex: "\\text{horizon}_{\\text{eff}} \\ll \\text{horizon}_{\\text{raw}}",
        desc: "Эффективная глубина планирования сокращается в число раз, равное средней длине навыка.",
      },
    ],
    notation: [
      { sym: "s, s'", desc: "low-level стейты" },
      { sym: "\\omega", desc: "опция / навык (high-level действие)" },
      { sym: "\\tau", desc: "длительность опции (число low-level шагов)" },
      { sym: "R_\\omega", desc: "суммарная награда за выполнение опции" },
      { sym: "K", desc: "горизонт абстрактного планирования" },
      { sym: "\\gamma", desc: "discount factor" },
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
    level: "L2",
    regimes: ["Physical", "Scientific", "Social"],
    l1Ops: { SI: true, FD: true, OD: true, ID: false },
    l2Conditions: { coherence: 4, intervention: 4, constraint: 3 },
    levelNote:
      "Калиброванная неопределённость — ключевой ингредиент для перехода к L3: знать, где модель не знает, и направлять туда experiments.",
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
      {
        label: "belief",
        tex: "b_t(s) = P(s_t = s \\mid o_{\\le t},\\, a_{<t})",
        desc: "Полное состояние знаний агента — апостериорное распределение над скрытым стейтом.",
      },
      {
        label: "Bayes filter",
        tex: "b_{t+1}(s') \\propto p(o_{t+1} \\mid s')\\, \\textstyle\\sum_{s} p(s' \\mid s, a_t)\\, b_t(s)",
        desc: "Шаг predict (transition) + update (observation): стандартный рекурсивный bayesian filter.",
      },
      {
        label: "objective",
        tex: "\\max_{\\pi}\\; \\mathbb{E}_{b}[U] \\;\\;\\text{or}\\;\\; \\mathrm{CVaR}_{\\alpha}",
        desc: "Можно максимизировать ожидаемую полезность или risk-чувствительную метрику типа CVaR_α — последнее даёт безопасное управление.",
      },
    ],
    notation: [
      { sym: "s", desc: "истинное скрытое состояние мира" },
      { sym: "o_t", desc: "наблюдение" },
      { sym: "a_t", desc: "действие" },
      { sym: "b_t(s)", desc: "belief — распределение над стейтом" },
      { sym: "\\eta", desc: "константа нормировки" },
      { sym: "U", desc: "функция полезности" },
      { sym: "\\mathrm{CVaR}_\\alpha", desc: "Conditional Value at Risk на хвосте α" },
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
    level: "L1",
    regimes: ["Physical", "Digital", "Social"],
    l1Ops: { SI: true, FD: false, OD: false, ID: false },
    l2Conditions: { coherence: 5, intervention: 2, constraint: 2 },
    levelNote:
      "По сути — мощный модуль state inference (расширенный retrieval'ом): восстановление состояния по длинной истории. Сам по себе не делает rollout, но даёт persistence, без которой L2 быстро разваливается.",
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
      {
        label: "retrieval",
        tex: "m_t = R(M,\\, q_t)",
        desc: "Поиск по памяти: query q_t (часто построенный из текущего стейта) → набор релевантных воспоминаний.",
      },
      {
        label: "state update",
        tex: "z_t = f(o_t,\\, h_{t-1},\\, m_t)",
        desc: "Текущий мир-стейт строится из наблюдения, рекуррентного контекста и памяти, что даёт persistence через окно внимания.",
      },
      {
        label: "write",
        tex: "M \\leftarrow W(M,\\, z_t,\\, o_t)",
        desc: "Запись: что и когда сохранять (приоритеты, сжатие, забывание) — отдельная политика.",
      },
    ],
    notation: [
      { sym: "M", desc: "хранилище памяти (вектора, структурированные ячейки, граф)" },
      { sym: "q_t", desc: "запрос к памяти, построен из текущего контекста" },
      { sym: "m_t", desc: "извлечённое содержимое" },
      { sym: "R(\\cdot)", desc: "функция извлечения (attention / k-NN)" },
      { sym: "W(\\cdot)", desc: "функция записи / обновления" },
      { sym: "h_{t-1}", desc: "рекуррентный контекст агента" },
      { sym: "z_t", desc: "обновлённый world-state" },
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
    level: "L3",
    regimes: ["Digital", "Physical"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 5, intervention: 4, constraint: 5 },
    levelNote:
      "Из всех learned-семей наиболее близок к L3: symbolic rules — это first-class object, который можно править по evidence (Lakatos «hard core»). WorldCoder/CodeWM явно строят world model как код, проверяемый исполнением.",
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
      {
        label: "state",
        tex: "S = \\{ P_i(\\mathrm{obj}_j) \\}",
        desc: "Состояние — множество фактов: какой предикат на каких объектах истинен. Удобно для STRIPS/PDDL.",
      },
      {
        label: "rule",
        tex: "\\text{pre}(s) \\wedge a \\;\\Rightarrow\\; \\text{eff}(s')",
        desc: "Правило перехода: precondition + action ⇒ effect. Часто это add/del-списки фактов.",
      },
      {
        label: "planning",
        tex: "\\Pi^{*} = \\arg\\min_{\\Pi}\\; \\mathrm{cost}(\\Pi)",
        desc: "Поиск программы/плана минимальной стоимости в дискретном пространстве (A*, SAT, программный поиск).",
      },
    ],
    notation: [
      { sym: "P_i", desc: "предикат i (например, on(a,b))" },
      { sym: "\\mathrm{obj}_j", desc: "объект j в сцене" },
      { sym: "a", desc: "символическое действие" },
      { sym: "s, s'", desc: "состояние мира как множество фактов" },
      { sym: "\\Pi", desc: "программа / план — последовательность действий" },
      { sym: "\\mathrm{Exec}(\\Pi, W)", desc: "выполнение программы в world model W" },
      { sym: "\\mathrm{cost}(\\cdot)", desc: "функция стоимости плана" },
    ],
    works: [
      { name: "Neural-Symbolic Learning and Reasoning survey", url: "https://arxiv.org/abs/1711.03902" },
      { name: "WorldCoder — Tang et al., 2024", url: "https://arxiv.org/abs/2402.12275" },
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
    level: "L2",
    regimes: ["Physical"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 5, intervention: 5, constraint: 5 },
    levelNote:
      "Эталон constraint consistency в физическом регимe: аналитическое ядро гарантирует energy conservation и kinematic feasibility, а residual закрывает sim-to-real gap.",
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
      {
        label: "base physics",
        tex: "F_{\\text{phys}}(s,\\, a;\\, \\theta)",
        desc: "Аналитическая модель: уравнения движения, контактная динамика, дифференцируемый симулятор.",
      },
      {
        label: "residual",
        tex: "\\Delta_{\\psi}(s,\\, a)",
        desc: "Нейронная поправка: учит то, что не моделируется аналитически — трение, упругость, шум сенсоров, sim-to-real gap.",
      },
      {
        label: "calibration",
        tex: "\\theta^{*},\\, \\psi^{*} = \\arg\\min_{\\theta, \\psi}\\; \\mathcal{L}_{\\text{rollout}}",
        desc: "Совместная оптимизация физических параметров θ и residual ψ по rollout-ошибке на реальных данных.",
      },
    ],
    notation: [
      { sym: "s_t", desc: "физическое состояние (поза, скорости, контакты)" },
      { sym: "a_t", desc: "управляющее воздействие (моменты, силы)" },
      { sym: "\\theta", desc: "параметры физического симулятора (массы, инерции)" },
      { sym: "\\psi", desc: "веса residual-сети" },
      { sym: "F_{\\text{phys}}", desc: "аналитическая динамика" },
      { sym: "\\Delta_\\psi", desc: "выученный остаток" },
      { sym: "\\mathcal{L}_{\\text{rollout}}", desc: "потеря по предсказанным траекториям" },
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
    level: "L2",
    regimes: ["Social"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 4, intervention: 5, constraint: 3 },
    levelNote:
      "Высокая intervention sensitivity (другая стратегия — другой исход), но constraint consistency страдает: коммитменты, нормы и роли в LLM-симуляторах легко «забываются» (см. Sotopia, FANToM).",
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
      {
        label: "joint transition",
        tex: "P(s' \\mid s,\\, a^{1}, \\ldots, a^{n})",
        desc: "Среда зависит от совместного действия всех n агентов — нельзя просто условиться на собственное действие.",
      },
      {
        label: "opponent policy",
        tex: "\\pi_j(a \\mid b_j,\\, g_j)",
        desc: "Модель оппонента: его действие — функция его belief и goal, а не объективного состояния среды.",
      },
      {
        label: "recursive belief",
        tex: "B_i^{(k)} = \\mathbb{E}\\!\\left[\\, B_j^{(k-1)} \\,\\right]",
        desc: "Theory-of-mind k-уровня: «я думаю, что ты думаешь, что я думаю…». На практике обычно ограничиваются k=1 или 2.",
      },
    ],
    notation: [
      { sym: "s, s'", desc: "состояние среды" },
      { sym: "a^{j}", desc: "действие агента j" },
      { sym: "n", desc: "количество агентов" },
      { sym: "\\pi_j", desc: "политика агента j" },
      { sym: "b_j", desc: "belief агента j о мире и других агентах" },
      { sym: "g_j", desc: "цель / награда агента j" },
      { sym: "B_i^{(k)}", desc: "рекурсивный belief агента i порядка k" },
    ],
    works: [
      { name: "Machine Theory of Mind — Rabinowitz et al.", url: "https://arxiv.org/abs/1802.07740" },
      { name: "CICERO — Bakhtin et al., Science 2022", url: "https://doi.org/10.1126/science.ade9097" },
      { name: "Generative Agents — Park et al., 2023", url: "https://arxiv.org/abs/2304.03442" },
    ],
  },
  {
    id: "social-sandbox",
    title: "Social sandbox / generative society WM",
    short:
      "Симуляторы социумов: персонажи с памятью, reflection и нормами; emergent dynamics при scale (Generative Agents, Sotopia, OASIS).",
    icon: NetworkIcon,
    color: "from-pink-500 to-fuchsia-600",
    cluster: "Social",
    tags: ["generative agents", "sandbox", "norms", "personas", "reflection"],
    scores: {
      representation: 4,
      dynamics: 3,
      planning: 3,
      uncertainty: 3,
      causality: 2,
      horizon: 5,
    },
    level: "L2",
    regimes: ["Social"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 3, intervention: 4, constraint: 3 },
    levelNote:
      "L2 как sandbox-симулятор социума, не оппонента: тысячи агентов с устойчивыми персонами, эпизодической памятью и циклами reflection. Long-horizon coherence страдает от role drift и goal forgetting; constraint consistency — от того, что коммитменты в LLM легко «забываются» (FANToM, illusory ToM).",
    formula:
      "\\begin{aligned} S_t &= \\{(p_i,\\, m_i,\\, b_i,\\, g_i)\\}_{i=1}^{N},\\quad N \\in \\{25,\\, 1000,\\, 10^6\\} \\\\ s_{t+1} &\\propto \\textstyle\\prod_i \\pi_i(a_i \\mid b_i,\\, g_i,\\, m_i)\\, \\phi_{\\text{norm}}(s_{t+1}) \\end{aligned}",
    pipeline: [
      "personas + memory",
      "perception",
      "reflection / planning",
      "dialogue / action",
      "social state update",
      "emergent dynamics",
    ],
    details:
      "Где multi-agent / ToM моделирует оппонента изнутри агента, social sandbox моделирует социум как среду: что произойдёт, если запустить N агентов с такими ролями, такими целями и такими нормами. Generative Agents (Park et al., 2023) показали emergent дележ информации и социальную координацию на 25 агентах с reflective memory. Sotopia формализовал оценку социальных миров по 7 измерениям. ProjectSid и OASIS отмасштабировали до 1000 и 10^6 агентов с emergent governance, информационным каскадом и поляризацией. Silicon Sampling (Argyle et al.) показал, что LLM, обусловленные демографией, неплохо воспроизводят результаты социологических опросов. Базовый failure mode — отсутствие formal commitment tracking: агент даёт обещание и без последствий его нарушает.",
    math: [
      {
        label: "social state",
        tex: "S_t = \\{(p_i,\\, m_i,\\, b_i,\\, g_i)\\}_{i=1}^{N}",
        desc: "Состояние мира — множество агентов с устойчивыми персонами p_i, памятью m_i (episodic + semantic), beliefs b_i и целями g_i. Поверх — глобальные нормы и роли как трактуемые констрейнты.",
      },
      {
        label: "transition",
        tex: "s_{t+1} \\propto \\textstyle\\prod_i \\pi_i(a_i \\mid b_i,\\, g_i,\\, m_i)\\, \\phi_{\\text{norm}}(s_{t+1})",
        desc: "Локальные политики плюс глобальный normative compatibility ϕ_norm: нарушение коммитментов, выпадение из роли, забытое обещание — снижают вероятность траектории. На практике этот член часто равен 1 (нет проверки), отсюда illusory social coherence.",
      },
      {
        label: "reflection",
        tex: "m_i \\leftarrow \\mathrm{Reflect}(m_i,\\, \\text{recent events})",
        desc: "Периодическое обобщение опыта в долговременную память (Park et al., 2023): без этого агенты быстро теряют цели и репутацию.",
      },
    ],
    notation: [
      { sym: "p_i", desc: "персона агента i (профиль, биография, стиль)" },
      { sym: "m_i", desc: "эпизодическая + семантическая память" },
      { sym: "b_i, g_i", desc: "beliefs и цели агента i" },
      { sym: "\\phi_{\\text{norm}}(s)", desc: "normative compatibility (commitment tracking, role consistency)" },
      { sym: "N", desc: "численность сообщества (25 → 10^6)" },
      { sym: "\\mathrm{Reflect}", desc: "оператор reflection — синтез опыта в долгую память" },
    ],
    works: [
      { name: "Generative Agents — Park et al., 2023", url: "https://arxiv.org/abs/2304.03442" },
      { name: "Sotopia — Zhou et al., 2024", url: "https://arxiv.org/abs/2310.11667" },
      { name: "Project Sid (1000 agents) — AL et al., 2024", url: "https://arxiv.org/abs/2411.00114" },
      { name: "OASIS (1M agents) — Yang et al., 2024", url: "https://arxiv.org/abs/2411.11581" },
      { name: "FANToM — illusory ToM, Kim et al., 2023", url: "https://arxiv.org/abs/2310.15421" },
      { name: "Silicon Sampling — Argyle et al., 2023", url: "https://www.cambridge.org/core/journals/political-analysis/article/out-of-one-many-using-language-models-to-simulate-human-samples/035D7C8A55B237942FB6DBAD7CAA4E49" },
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
    level: "L1",
    regimes: ["Physical"],
    l1Ops: { SI: true, FD: true, OD: false, ID: false },
    l2Conditions: { coherence: 3, intervention: 2, constraint: 2 },
    levelNote:
      "JEPA — это про state inference + представление будущего, не про многошаговый rollout. Сильный L1-фундамент для последующих L2-семей; для управления нужен внешний planner.",
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
      {
        label: "JEPA",
        tex: "\\hat y = f_\\theta(x_{\\text{ctx}}) \\approx g(x_{\\text{fut}})",
        desc: "Учим предиктор f_θ предсказывать целевое embedding y, выданное target-encoder g по будущему. Лосс — в пространстве представлений, а не пикселей.",
      },
      {
        label: "EBM",
        tex: "E_\\theta(s,\\, a,\\, s') \\to \\min \\;\\;\\text{for valid transitions}",
        desc: "Energy-based взгляд: модель присваивает низкую энергию реальным переходам и высокую — невозможным. Допускает мультимодальные будущие.",
      },
      {
        label: "objective",
        tex: "\\min_{\\theta}\\; \\mathcal{L}_{\\text{contrast}} \\;\\;\\text{or}\\;\\; \\mathcal{L}_{\\text{VICReg}}",
        desc: "Чтобы избежать коллапса представлений — contrastive loss (с негативами) или non-contrastive (variance/invariance/covariance, как в VICReg).",
      },
    ],
    notation: [
      { sym: "x_{\\text{ctx}}", desc: "контекстный вход (видимое прошлое)" },
      { sym: "x_{\\text{fut}}", desc: "целевой будущий вход" },
      { sym: "f_\\theta", desc: "предиктор в пространстве embedding" },
      { sym: "g", desc: "target-encoder (часто — EMA-копия)" },
      { sym: "\\hat y", desc: "предсказанное embedding будущего" },
      { sym: "E_\\theta(s, a, s')", desc: "энергия перехода (валидность)" },
      { sym: "\\mathcal{L}_{\\text{VICReg}}", desc: "non-contrastive лосс против коллапса" },
    ],
    works: [
      { name: "I-JEPA — Assran et al., 2023", url: "https://arxiv.org/abs/2301.08243" },
      { name: "A Path Towards Autonomous Machine Intelligence — LeCun", url: "https://openreview.net/forum?id=BZ5a1r-kVsf" },
      { name: "Energy-Based Models overview — LeCun et al.", url: "http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Дополнения по «Agentic World Modeling» (arXiv:2604.22748): покрытие
  // L2-Digital, L2-Scientific и L3-Evolver, которых раньше явно не было.
  // ──────────────────────────────────────────────────────────────────────

  {
    id: "digital-agents",
    title: "Digital-world WM (web/GUI/code)",
    short:
      "Модель мира — программа, API, DOM и файловая система; transitions проверяются исполнением.",
    icon: WorkflowIcon,
    color: "from-emerald-500 to-cyan-500",
    cluster: "Agents",
    tags: ["web", "GUI", "code", "OSWorld", "SWE-bench", "WebArena"],
    scores: {
      representation: 4,
      dynamics: 4,
      planning: 4,
      uncertainty: 2,
      causality: 4,
      horizon: 4,
    },
    level: "L2",
    regimes: ["Digital"],
    l1Ops: { SI: true, FD: true, OD: false, ID: true },
    l2Conditions: { coherence: 3, intervention: 5, constraint: 5 },
    levelNote:
      "Цифровой мир уникален тем, что constraint check механически проверяем (тесты, типы, exit codes). Поэтому intervention sensitivity и constraint consistency в этом регимe максимальные; слабое место — long-horizon coherence на длинных эпизодах (state aliasing, brittle UI).",
    formula:
      "\\begin{aligned} z_t &= \\phi\\!\\left(\\text{DOM}_t \\cup \\text{state}_t \\cup \\text{trace}_t\\right) \\\\ z_{t+1} &= \\mathrm{Exec}(z_t,\\, a_t),\\quad v(z_{t+1}) \\in \\{\\text{ok},\\, \\text{err},\\, \\text{spec\\_fail}\\} \\end{aligned}",
    pipeline: [
      "DOM/AST/screen",
      "structured state",
      "tool/action",
      "exec env",
      "verifier",
      "next state",
    ],
    details:
      "Цифровой мир — это формальный артефакт: код, API-контракты, UI-state machines, файловая система. World model для таких сред обычно гибридная: нейронная perception (что я вижу на экране, что в DOM, что в трейсе) плюс детерминированный executor (browser, OS, interpreter). Главный плюс — verifiability: каждое действие проверяется запуском, что даёт почти идеальный constraint signal. Главные провалы — длинные эпизоды (state aliasing, race conditions), brittle UI и долгая обратная связь. Сюда попадают WebDreamer, WebArena/OSWorld-подобные simulator'ы, SWE-agent и family code-as-WM (CodeWM, WorldCoder, gWorld, Code2World).",
    math: [
      {
        label: "state",
        tex: "z_t = \\phi(\\text{DOM}_t \\cup \\text{state}_t \\cup \\text{trace}_t)",
        desc: "Стейт строится из видимого экрана/DOM, серверного состояния и истории трейса. Часто структурированный (JSON, AST), не чисто пиксельный — это упрощает планирование.",
      },
      {
        label: "transition",
        tex: "z_{t+1} = \\mathrm{Exec}(z_t,\\, a_t)",
        desc: "Переход — это запуск команды/инструмента/API в реальной среде. Не нужно учить динамику: достаточно её симулировать через детерминированный движок.",
      },
      {
        label: "verification",
        tex: "v(z_{t+1}) \\in \\{\\mathrm{ok},\\; \\mathrm{err},\\; \\mathrm{spec\\_fail}\\}",
        desc: "Каждый переход верифицируем: HTTP-коды, юнит-тесты, type checker, оракулы задач. Это даёт идеальный constraint signal — основа для regression-gated update в L3.",
      },
    ],
    notation: [
      { sym: "\\text{DOM}_t", desc: "видимая структура страницы / GUI" },
      { sym: "\\text{AST}", desc: "синтаксическое дерево кода / диффа" },
      { sym: "\\mathrm{Exec}(\\cdot)", desc: "детерминированное выполнение действия в среде" },
      { sym: "c_{\\text{API}}", desc: "контракт API / типов / разрешений" },
      { sym: "v(\\cdot)", desc: "верификатор: даёт ok / error / spec_fail" },
    ],
    works: [
      { name: "WebArena — Zhou et al., 2024", url: "https://arxiv.org/abs/2307.13854" },
      { name: "OSWorld — Xie et al., 2024", url: "https://arxiv.org/abs/2404.07972" },
      { name: "SWE-agent — Yang et al., 2024", url: "https://arxiv.org/abs/2405.15793" },
      { name: "WebDreamer — Gu et al., 2025", url: "https://arxiv.org/abs/2411.06559" },
      { name: "Agentic World Modeling, §4.2.2", url: "https://arxiv.org/abs/2604.22748" },
    ],
  },
  {
    id: "science-surrogate",
    title: "Scientific surrogate WM",
    short:
      "Нейронные суррогаты физических/химических/биологических процессов: AlphaFold, GraphCast, MatterGen, NeuralPDE.",
    icon: AtomIcon,
    color: "from-indigo-400 to-blue-600",
    cluster: "Science",
    tags: ["AlphaFold", "GraphCast", "MatterGen", "PDE", "neural operator"],
    scores: {
      representation: 5,
      dynamics: 5,
      planning: 3,
      uncertainty: 4,
      causality: 3,
      horizon: 5,
    },
    level: "L2",
    regimes: ["Scientific"],
    l1Ops: { SI: true, FD: true, OD: true, ID: false },
    l2Conditions: { coherence: 5, intervention: 3, constraint: 4 },
    levelNote:
      "L2 как forward simulator: модель честно разворачивает динамику на больших горизонтах, но интервенции (счётно правильно отвечать на «что если параметр X»?) и экстраполяция за пределы тренировочного режима остаются открытой проблемой. Полноценный L3 в этой ветке — autonomous lab (см. evolver-l3).",
    formula:
      "\\begin{aligned} z_t &\\sim q_\\phi(z_t \\mid \\text{measurements}_{\\le t}) \\\\ z_{t+1} &= F_\\theta(z_t,\\, c_{\\text{laws}}) \\end{aligned}",
    pipeline: [
      "measurement / sequence / config",
      "neural surrogate",
      "structure / field / property",
      "uncertainty",
      "downstream search",
    ],
    details:
      "В научном режиме governing equations известны лишь частично. World model — это нейронный суррогат, обученный на симуляциях или эксперименте: AlphaFold предсказывает 3D-структуру белка, GraphCast обгоняет ECMWF на 90% метрик и в тысячи раз быстрее, GNoME/MatterGen генерируют стабильные кристаллические материалы, FNO/Neural-GCM учатся PDE-операторам. Constraint validation тут не closed-form, а сравнение с измерением. Интервенционная семантика (real do(): изменить параметр и ожидать корректного смещения) и экстраполяция остаются основной болью, что и мотивирует L3.",
    math: [
      {
        label: "surrogate",
        tex: "z_{t+1} = F_\\theta(z_t,\\, c_{\\text{laws}})",
        desc: "Нейронный оператор переходов: учится сопоставлять текущий стейт следующему, опираясь на конструкции (graph/Fourier/Swin-операторы) и регуляризацию законами сохранения.",
      },
      {
        label: "calibration",
        tex: "\\theta^{*} = \\arg\\min_{\\theta}\\; \\mathbb{E}\\!\\left[\\, \\| F_\\theta(z) - z_{\\text{exp}} \\|^2 \\,\\right]",
        desc: "Параметры калибруются по ground truth: high-fidelity сим (DFT, спектральные solver'ы) и эксперимент.",
      },
      {
        label: "uncertainty",
        tex: "p(z_{t+1} \\mid z_t) = \\mathcal{N}\\!\\left(\\mu_\\theta(z_t),\\, \\Sigma_\\theta(z_t)\\right)",
        desc: "Калиброванная неопределённость через ансамбли или Bayesian neural ops — обязательна для научной валидности и risk-aware experimental design (мост к L3).",
      },
    ],
    notation: [
      { sym: "F_\\theta", desc: "нейронный оператор переходов / суррогат" },
      { sym: "c_{\\text{laws}}", desc: "известные физические инварианты (conservation, симметрии)" },
      { sym: "z_{\\text{exp}}", desc: "наблюдение из эксперимента / high-fidelity сим" },
      { sym: "\\Sigma_\\theta(z)", desc: "ковариация предсказания (uncertainty)" },
    ],
    works: [
      { name: "AlphaFold 2 — Jumper et al., Nature 2021", url: "https://www.nature.com/articles/s41586-021-03819-2" },
      { name: "GraphCast — Lam et al., Science 2023", url: "https://www.science.org/doi/10.1126/science.adi2336" },
      { name: "MatterGen — Zeni et al., 2024", url: "https://arxiv.org/abs/2312.03687" },
      { name: "Karniadakis et al., Physics-informed ML, 2021", url: "https://www.nature.com/articles/s42254-021-00314-5" },
    ],
  },
  {
    id: "evolver-l3",
    title: "Evidence-driven evolver (L3)",
    short:
      "Системы, которые сами правят свой world model по новой evidence: AI Scientist, AlphaEvolve, autonomous wet-labs.",
    icon: SparklesIcon,
    color: "from-amber-400 to-rose-500",
    cluster: "Meta",
    tags: ["L3", "self-evolving", "autonomous discovery", "model revision"],
    scores: {
      representation: 5,
      dynamics: 4,
      planning: 5,
      uncertainty: 5,
      causality: 5,
      horizon: 5,
    },
    level: "L3",
    regimes: ["Physical", "Digital", "Social", "Scientific"],
    l1Ops: { SI: true, FD: true, OD: true, ID: true },
    l2Conditions: { coherence: 5, intervention: 5, constraint: 5 },
    levelNote:
      "L3 не заменяет L1/L2, а добавляет третий контур — пересмотр самой модели. На сегодня полноценного L3 в открытых системах почти нет: большинство «L3-подобных» проектов реализуют только часть петли (без governance, без rollback). Самое близкое — autonomous chemistry labs и AI Scientist.",
    formula:
      "\\mathcal{M}_t \\xrightarrow{\\;\\text{design}\\;} a_t \\xrightarrow{\\;\\text{execute}\\;} o_t \\xrightarrow{\\;\\text{observe}\\;} d_t \\xrightarrow{\\;\\text{reflect}\\;} \\mathcal{M}_{t+1}",
    pipeline: [
      "deployment + evidence d_t",
      "failure diagnosis",
      "hypothesis space H",
      "asset distillation",
      "regression / canary validation",
      "revised model M_{t+1}",
    ],
    details:
      "Когда L2-симуляция систематически расходится с реальностью, L3-loop диагностирует, какой модуль виноват, генерирует кандидатов на правку (новая physics-routine, новый предикат, новый skill, новый closure), валидирует их через regression-suite и canary-rollout, и закрепляет как persistent asset. Соответствует Lakatos-различию: малые аномалии абсорбируются «protective belt» (параметры), систематические — требуют правки «hard core» (архитектура, инварианты). Примеры: AI Scientist (Lu et al., 2024) автоматически запускает эксперименты и переписывает гипотезы; AlphaEvolve эволюционирует код для алгоритмических открытий; автономные химические лаборатории Boiko et al. (Nature 2023) сами планируют синтез и обновляют kinetic model.",
    math: [
      {
        label: "evolution step",
        tex: "(\\mathcal{M}_t,\\, d_t)\\;\\to\\;\\mathcal{M}_{t+1}",
        desc: "Полный шаг: из текущего модельного стэка M_t и накопленных свидетельств d_t (трейсы, ошибки, тесты) собирается следующая версия M_{t+1}.",
      },
      {
        label: "diagnose",
        tex: "h^{*} = \\arg\\max_{h \\in \\mathcal{H}}\\; P(d_t \\mid h,\\, \\mathcal{M}_t)",
        desc: "Diagnose: ищем гипотезу h в пространстве правок H, которая лучше всего объясняет наблюдаемые провалы. Это — Duhem-Quine: винить надо конкретный модуль, а не «всю модель».",
      },
      {
        label: "validate",
        tex: "\\mathcal{M}_{t+1} = h^{*} \\oplus \\mathcal{M}_t,\\;\\;\\text{if}\\;\\; \\mathcal{L}_{\\text{regression}}(\\mathcal{M}_{t+1}) \\le \\tau",
        desc: "Закрепляем правку только если она проходит regression suite и canary-критерии. Иначе rollback. Это защита от paradigm-collapse и accidental regressions.",
      },
    ],
    notation: [
      { sym: "\\mathcal{M}_t", desc: "world-model stack на шаге t (модули, веса, правила)" },
      { sym: "d_t", desc: "deployment evidence: трейсы, ошибки, контрпримеры" },
      { sym: "\\mathcal{H}", desc: "пространство гипотез о правках (новые модули, законы, правила)" },
      { sym: "h^{*}", desc: "выбранная гипотеза-правка" },
      { sym: "\\oplus", desc: "оператор применения правки к стэку" },
      { sym: "\\mathcal{L}_{\\text{regression}}", desc: "loss на regression-наборе (поведение на старых задачах)" },
      { sym: "\\tau", desc: "порог приёмки на regression-тестах" },
    ],
    works: [
      { name: "Agentic World Modeling — survey, §5", url: "https://arxiv.org/abs/2604.22748" },
      { name: "AI Scientist — Lu et al., 2024", url: "https://arxiv.org/abs/2408.06292" },
      { name: "Autonomous chemistry — Boiko et al., Nature 2023", url: "https://www.nature.com/articles/s41586-023-06792-0" },
      { name: "AlphaEvolve — DeepMind, 2025", url: "https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/" },
    ],
  },
];

export const CLUSTERS = ["All", ...Array.from(new Set(TYPES.map((t) => t.cluster)))];

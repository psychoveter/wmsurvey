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
];

export const CLUSTERS = ["All", ...Array.from(new Set(TYPES.map((t) => t.cluster)))];

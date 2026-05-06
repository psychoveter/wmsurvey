# wmsurvey — World Models Map SPA

Интерактивная карта архитектур world models (Dreamer, MuZero, TD-MPC, GAIA, Genie, Slot Attention, SCM, JEPA и т. д.).

## Запуск

```bash
npm install
npm run dev
```

Откроется http://localhost:5173.

## Сборка

```bash
npm run build
npm run preview
```

## Структура

- `wm.js` — основной React-компонент (исходник пользователя).
- `src/main.jsx` — точка входа Vite.
- `src/index.css` — Tailwind directives.
- `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js` — конфиги.

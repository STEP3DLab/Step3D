# STEP_3D

Лендинг STEP_3D для GitHub Pages.

## Структура

```text
Step3D/
├── index.html
├── README.md
├── _headers
├── package.json
├── .htmlhintrc
├── .stylelintrc.json
├── .prettierrc.json
└── .github/workflows/quality-gate.yml
```

## Публикация

Сайт разворачивается из корня репозитория (ветка `main`, папка `/`).
Главная страница: `index.html`.

## Security headers

### GitHub Pages

GitHub Pages не позволяет выставлять произвольные HTTP headers на уровне платформы.
Поэтому минимально безопасные настройки продублированы в `index.html` через meta-теги (`Content-Security-Policy`, `Referrer-Policy`, `X-Content-Type-Options`).

### Прокси/CDN (Netlify, Cloudflare Pages, reverse proxy)

Для платформ, где headers поддерживаются на уровне ответа, используйте файл `_headers` в корне:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

Это приоритетнее и надежнее, чем meta-эквиваленты.

## Quality Gate (CI)

В репозитории добавлен workflow `.github/workflows/quality-gate.yml`.
Он запускает:

1. `npm run lint:html` — HTMLHint.
2. `npm run lint:css` — Stylelint для CSS внутри `index.html`.
3. `npm run format:check` — Prettier check.

Локальный запуск:

```bash
npm ci
npm run quality
```

## Definition of Done для изменений лендинга

Каждая задача по лендингу считается завершенной только если соблюдены все пункты:

### 1) Доступность (A11y)

- Семантическая структура страницы (landmarks: `header`, `nav`, `main`, `footer`, корректные `section`).
- Для интерактивных элементов есть корректные `aria-*`-атрибуты там, где это нужно (`aria-expanded`, `aria-selected`, `aria-controls`, `aria-live`, `aria-current`).
- Фокус с клавиатуры всегда видим (`:focus-visible`), сценарии доступны без мыши.
- Добавлен fallback для `prefers-reduced-motion`.
- Контраст текста и элементов управления достаточен для чтения на тёмной теме.

### 2) Перформанс

- Нет тяжелых зависимостей без необходимости.
- Анимации не мешают восприятию и не блокируют основной контент.
- 3D/визуальные эффекты не ломают UX при ограничениях устройства.

### 3) SEO и базовая техническая гигиена

- Есть валидные `title`, `description`, `lang`.
- Страница корректно индексируема и не содержит очевидных семантических ошибок.
- Минимальные security headers заданы (через прокси headers, либо meta как fallback).

### 4) Функциональность CTA

- Главные CTA-кнопки ведут в правильные секции.
- Форма/бриф собирается и копируется без ошибок.
- Навигация и якоря работают стабильно на desktop и mobile.

### 5) Quality gate

- Пройдены линтеры и форматирование в CI.
- Изменения не должны мерджиться при красном workflow.

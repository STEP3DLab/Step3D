# STEP_3D

Одностраничный промо-сайт STEP_3D (3D-сканирование, CAD/реверс-инжиниринг, 3D-печать) c деплоем на GitHub Pages.

## 1) Структура проекта

```text
Step3D/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── enhancement.yml
│   │   └── content_change.yml
│   ├── workflows/
│   │   └── ci.yml
│   └── pull_request_template.md
├── scripts/
│   └── build.mjs
├── .htmlhintrc
├── .stylelintrc.json
├── commitlint.config.cjs
├── .eslintrc.cjs
├── index.html
├── package.json
├── CHANGELOG.md
└── README.md
```

## 2) Локальный запуск и проверка

```bash
npm install
npm run lint
npm run build
```

Дополнительно:

- `npm run format` — автоформатирование.
- `npm run format:check` — проверка форматирования без изменений.
- `npm run check:commits` — проверка последних коммитов по Conventional Commits.

## 3) Как вносить изменения

### Базовый процесс

1. Создать ветку от `main`:
   ```bash
   git checkout -b feat/short-description
   ```
2. Внести изменения в `index.html`/документацию.
3. Прогнать локальные проверки:
   ```bash
   npm run lint
   npm run build
   npm run format:check
   ```
4. Сделать коммит по правилам Conventional Commits.
5. Открыть Pull Request в `main`.

### Единые правила коммитов

Используем **Conventional Commits**:

```text
<type>(optional-scope): <subject>
```

Примеры:

- `feat(hero): add CTA button for lead form`
- `fix(form): validate phone mask`
- `docs(readme): add release workflow`

Разрешённые `type`: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`, `revert`.

## 4) Линтеры и форматирование

В проекте включены:

- **HTML**: `htmlhint`
- **CSS (встроенный в HTML)**: `stylelint` + `stylelint-config-html`
- **JS (встроенный в HTML)**: `eslint` + `eslint-plugin-html`
- **Форматирование**: `prettier`

Минимальное требование перед PR: `npm run lint && npm run build && npm run format:check`.

## 5) GitHub Actions и контроль качества

Workflow: `.github/workflows/ci.yml`.

На каждый `pull_request` (в `main`) выполняются:

1. Установка зависимостей (`npm ci`)
2. Проверка форматирования (`npm run format:check`)
3. Линтинг (`npm run lint`)
4. Сборка (`npm run build`)
5. Проверка PR title на Conventional Commits

## 6) Деплой на GitHub Pages

### Модель деплоя

- Источник: ветка `main`.
- Публикация: GitHub Pages из корня репозитория (`/`).
- Точка входа: `index.html`.

### Релизный порядок

1. Мерж PR в `main`.
2. Обновление `CHANGELOG.md` и версии (см. раздел ниже).
3. Создание git tag `vX.Y.Z`.
4. GitHub Pages подхватывает обновление из `main`.

## 7) Релизный цикл (versioning + changelog + rollback)

### Семантическое версионирование

Используется `MAJOR.MINOR.PATCH`:

- `MAJOR` — несовместимые изменения.
- `MINOR` — новая функциональность без breaking changes.
- `PATCH` — исправления и мелкие улучшения.

### Changelog

Вести `CHANGELOG.md` по принципу Keep a Changelog:

- `Added`
- `Changed`
- `Fixed`
- `Removed`

Рекомендуется обновлять changelog в каждом PR.

### Rollback-инструкция

Если релиз некорректен:

1. Найти предыдущий стабильный tag, например `v1.4.2`.
2. Сделать rollback-коммит или `revert` проблемного merge-коммита.
3. Прогнать CI (`lint + build`).
4. Выпустить `PATCH`-релиз (`v1.4.3`) с описанием отката в `CHANGELOG.md`.

> Для GitHub Pages предпочтителен **forward-fix** (новый фикс-коммит), а не force-push в `main`.

## 8) SLA по лидам и ежемесячная оптимизация

### SLA обработки лидов

- **Первичный ответ:** до **4 рабочих часов**.
- **Квалификация лида:** до **1 рабочего дня**.
- **Подготовка КП / оценки:** до **2 рабочих дней** после квалификации.
- **Эскалация "горячих" лидов:** до **30 минут** в рабочее время.

### Операционный процесс по лидам

1. Лид приходит с формы/мессенджера/почты.
2. Фиксация в CRM/таблице: источник, услуга, срочность, бюджет.
3. Назначение ответственного (owner).
4. Контроль SLA и статусов: `new → contacted → qualified → proposal → won/lost`.

### Ежемесячная оптимизация (growth loop)

Периодичность: 1 раз в месяц (первый рабочий понедельник).

1. **Сбор метрик** за месяц:
   - conversion rate (visit → lead)
   - CTR CTA-кнопок
   - bounce rate
   - время до первого контакта
   - доля квалифицированных лидов
2. **Формирование гипотез** (3–5 штук) по ICE/RICE.
3. **A/B идеи** на следующий спринт:
   - заголовок hero-блока
   - оффер/формулировка CTA
   - структура блока кейсов
   - длина/поля формы заявки
4. **Запуск экспериментов** с чётким критерием успеха.
5. **Ретро и решение**: масштабировать / доработать / закрыть.

## 9) Полезные команды

```bash
npm run lint
npm run format
npm run format:check
npm run build
npm run check:commits
```

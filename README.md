# Step3D — 3D Print Cost Calculator

<div align="center">
  <img src="assets/logo.svg" alt="Step3D logo" width="160"/>
</div>

**Live demo:** [https://step3dlab.github.io/Step3D](https://step3dlab.github.io/Step3D)
**Author:** [https://github.com/Pagas](https://github.com/Pagas)

<p align="center">
  <a href="https://github.com/Pagas/Step3D/actions"><img alt="CI" src="https://github.com/Pagas/Step3D/workflows/CI/badge.svg"></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

> A lightweight, client‑side web‑app that lets anyone **upload an STL model, choose a material and instantly see the volume & cost** of 3D‑printing it.

---

## Table of Contents

* [Features](#features)
* [Screenshots](#screenshots)
* [Quick Start](#quick-start)
* [Configuration](#configuration)
* [Project Structure](#project-structure)
* [Development & Build](#development--build)
* [Contributing](#contributing)
* [License](#license)
* [Русская версия](#русская-версия)

---

## Features

* 📦 **Zero‑backend** — everything runs in the browser
* 🖼️ Interactive 3D preview (Three.js)
* 📐 Automatic volume calculation (cm³)
* 🏷️ Per‑material pricing via a JSON config
* 💸 Instant cost estimate & currency formatting
* 📑 Ready for GitHub Pages deploy via `gh‑pages`

## Screenshots

![Step3D main screen](assets/screenshot-main.png)

## Quick Start

```bash
# 1 — Clone the repo
$ git clone https://github.com/Pagas/Step3D.git
$ cd Step3D

# 2 — Install dependencies (only dev‑time tooling)
$ npm install

# 3 — Run a local dev server
$ npm run dev      # opens http://localhost:8080
```

Open the page in a modern browser, drag‑and‑drop an **STL** file, pick a material and you’re done.

## Configuration

All pricing and material parameters live in [`src/config.json`](src/config.json):

```json
{
  "currency": "RUB",
  "materials": {
    "pla": { "label": "PLA", "price_per_cm3": 4.5 },
    "abs": { "label": "ABS", "price_per_cm3": 5.0 }
  }
}
```

Feel free to add, rename or remove materials — the UI adapts automatically.

## Project Structure

```text
Step3D/
├── public/          # static files served as‑is (index.html)
├── src/             # ES‑module source
│   ├── calculator.js
│   ├── viewer.js    # Three.js viewer
│   ├── fileManager.js
│   └── style.css
├── assets/          # images, logo, screenshots
├── package.json
└── README.md        # this file
```

## Development & Build

| Command          | What it does                                                       |
| ---------------- | ------------------------------------------------------------------ |
| `npm run dev`    | Serves `public/` on [http://localhost:8080](http://localhost:8080) |
| `npm run deploy` | Publishes `public/` to **GitHub Pages**                            |

The app is pure HTML + JS, so no bundle step is required.

## Contributing

1. **Fork** the repository and create your branch: `git checkout -b feature/my‑feature`
2. Commit your changes: `git commit -am "Add my feature"`
3. Push to the branch: `git push origin feature/my‑feature`
4. Open a **Pull Request**.

All contributions, issues and feature requests are welcome!

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## Русская версия

### О проекте

**Step3D** — браузерный калькулятор стоимости 3D‑печати. Загрузите модель в формате **STL**, выберите материал и мгновенно получите объём и цену печати.

### Быстрый старт

```bash
# Клонируем репозиторий
$ git clone https://github.com/Pagas/Step3D.git
$ cd Step3D

# Устанавливаем dev‑зависимости
$ npm install

# Запускаем локальный сервер
$ npm run dev
```

Страница откроется на [http://localhost:8080](http://localhost:8080). Перетащите STL‑файл и выберите материал.

### Настройка цен

Файл [`src/config.json`](src/config.json) содержит курсы и цены для каждого материала. Измените параметры по своему усмотрению.

### Сборка и деплой

Команда `npm run deploy` публикует содержимое папки `public/` в **GitHub Pages** ветки `gh‑pages`.

### Лицензия

Проект распространяется по лицензии MIT.

# STEP_3D

Финальная production-ready версия сайта для GitHub Pages.

## Структура

```text
Step3D/
├── index.html
├── README.md
└── .gitignore
```

## Публикация

Сайт разворачивается из корня репозитория (ветка `main`, папка `/`).
Главная страница: `index.html`.

## SEO checklist

- [ ] Проверить и заменить production URL в `canonical`, `og:url` и `Organization.url`.
- [ ] Проверить и заменить production URL изображения в `og:image`.
- [ ] Убедиться, что `title` и `meta description` соответствуют текущему позиционированию и ключевым услугам.
- [ ] Подтвердить базовые robots-правила: `index, follow` и `googlebot` ограничения на сниппеты/превью.
- [ ] Актуализировать JSON-LD (`Organization`): `telephone`, `areaServed`, `serviceType`.
- [ ] Проверить SEO-иерархию заголовков (`h1` один на страницу, далее `h2` секции, `h3` внутри секций).
- [ ] После изменений прогнать быстрый контроль:
  - `rg -n "<h1\\b" index.html` (ожидается 1 результат)
  - `rg -n "<h[23]\\b" index.html` (проверка структурной вложенности)

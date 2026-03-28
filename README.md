# STEP_3D

Финальная production-ready версия сайта для GitHub Pages.

## Структура

```text
Step3D/
├── index.html
├── styles-deferred.css
├── README.md
└── .gitignore
```

## Публикация

Сайт разворачивается из корня репозитория (ветка `main`, папка `/`).
Главная страница: `index.html`.

## Performance-бюджет и метрики

Целевые Web Vitals для мобильных (4G, mid-tier device):

- `LCP < 2.5s`
- `CLS < 0.1`
- `INP < 200ms`
- `FCP < 1.8s`
- `TBT < 200ms`

## Регламент регулярной проверки

1. **Перед релизом**: прогон Lighthouse (Mobile) минимум 3 раза и фиксация медианных значений.
2. **Еженедельно**: проверка в PageSpeed Insights по прод-URL (mobile + desktop).
3. **После изменений UI/CSS/шрифтов**:
   - проверить LCP/CLS/INP;
   - убедиться, что above-the-fold стили остаются в `index.html`, а остальной CSS — в `styles-deferred.css`.
4. **После добавления медиа**:
   - задавать явные `width`/`height` (или резервировать место через CSS aspect-ratio);
   - ставить `loading="lazy"` для внеэкранных изображений/iframe/видео;
   - использовать современные форматы (`webp`/`avif` для изображений, `webm` для видео при возможности).
5. **После изменения шрифтов**:
   - сохранять `preconnect` к Google Fonts;
   - контролировать минимальный набор начертаний;
   - проверять `font-display=swap`.

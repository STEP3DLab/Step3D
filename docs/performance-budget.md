# Performance Budget (Step3D)

## Цели Core Web Vitals (mobile, p75)

- **LCP**: ≤ **2.5s**
- **CLS**: ≤ **0.10**
- **INP**: ≤ **200ms**

## Бюджеты загрузки (первая загрузка)

- Критический CSS (до первого рендера): **до 70 KB gzip**
- JS initial (main + stories + cases): **до 120 KB gzip**
- Изображения above-the-fold: **до 220 KB**
- Шрифты (если подключаются webfont): **до 100 KB gzip**, `font-display: swap`

## Бюджеты runtime

- Long tasks > 50ms: **0 в зоне first interaction**
- Scroll/update handlers: только passive + `requestAnimationFrame`-throttle
- Анимации и декоративные эффекты: отключение/упрощение при `prefers-reduced-motion` и low-power профиле

## Контроль и регрессии

- Lighthouse Performance (mobile): **>= 85**
- Lighthouse Accessibility: **>= 95**
- Проверка в CI/перед релизом:
  1. Lighthouse (mobile, throttling)
  2. WebPageTest (Slow 4G profile)
  3. RUM (если подключен): контроль p75 LCP/CLS/INP еженедельно

## План по lazy-loading

- Stories media/video: лениво назначать `src` только при входе блока в viewport.
- Необязательные блоки ниже первого экрана: откладывать тяжелые ассеты (видео, крупные изображения, внешние виджеты) до пересечения с `IntersectionObserver`.
- Для fallback без `IntersectionObserver`: загружать медиа при первом пользовательском взаимодействии с блоком.

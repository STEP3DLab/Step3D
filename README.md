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

## Форма заявки и endpoint

Форма заявки находится в блоке `#contact` (`form#leadForm`) и отправляет JSON через `POST` на endpoint:

1. По умолчанию: `data-endpoint` у формы (сейчас `/api/leads`).
2. Переопределение через JS-конфиг:

```html
<script>
  window.STEP3D_CONFIG = {
    leadEndpoint: 'https://your-domain.tld/hooks/leads'
  };
</script>
```

Поле `channel` в форме поддерживает варианты: `email`, `api`, `crm_webhook`.

## События аналитики

На странице используется `window.dataLayer` и кастомное событие `step3d:analytics`.

### 1) `cta_click`
Срабатывает на CTA-кнопках сценариев (заявка/звонок/мессенджер).

Параметры:
- `event`: `cta_click`
- `page`: `index`
- `ts`: ISO timestamp
- `cta_type`: `application | call | messenger`
- `cta_place`: например `hero | services | footer | sticky`
- `cta_label`: текст CTA-кнопки

### 2) `validation_error`
Срабатывает при ошибках клиентской валидации формы заявки.

Параметры:
- `event`: `validation_error`
- `page`: `index`
- `ts`: ISO timestamp
- `field`: идентификатор поля (например `leadName`, `leadConsent`)
- `message`: текст ошибки

### 3) `form_submit_attempt`
Срабатывает при попытке отправки формы после нажатия «Отправить заявку».

Параметры:
- `event`: `form_submit_attempt`
- `page`: `index`
- `ts`: ISO timestamp
- `form_id`: `leadForm`
- `channel`: `email | api | crm_webhook`
- `endpoint`: фактический URL отправки

### 4) `form_submit_success`
Срабатывает при успешном ответе endpoint (`HTTP 2xx`).

Параметры:
- `event`: `form_submit_success`
- `page`: `index`
- `ts`: ISO timestamp
- `form_id`: `leadForm`
- `channel`: `email | api | crm_webhook`
- `endpoint`: фактический URL отправки

### 5) `form_submit_error`
Срабатывает при ошибке сети/endpoint или неуспешном HTTP-статусе.

Параметры:
- `event`: `form_submit_error`
- `page`: `index`
- `ts`: ISO timestamp
- `form_id`: `leadForm`
- `channel`: `email | api | crm_webhook`
- `endpoint`: фактический URL отправки
- `reason`: причина ошибки (например `HTTP 500`)

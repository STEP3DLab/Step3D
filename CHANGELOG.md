# Changelog

Все заметные изменения этого проекта фиксируются в этом файле.

Формат основан на Keep a Changelog и SemVer.

## [Unreleased]

### Added
- Добавлены единые линтеры/форматирование и CI для Pull Request.
- Добавлены шаблоны issue/PR и правила релизного цикла.

### Fixed
- Убраны предупреждения Node.js `MODULE_TYPELESS_PACKAGE_JSON` при запуске тестов за счёт явного `type: "module"` в `package.json`.

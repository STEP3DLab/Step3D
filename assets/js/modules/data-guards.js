function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStats(stats) {
  return Array.isArray(stats) && stats.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every(isNonEmptyString));
}

function isColumns(columns) {
  return (
    Array.isArray(columns) &&
    columns.every((column) => isNonEmptyString(column?.title) && Array.isArray(column.items) && column.items.every(isNonEmptyString))
  );
}

export function validateCaseData(caseId, data) {
  if (!isNonEmptyString(data?.title)) {
    throw new Error(`Invalid case data for "${caseId}": field "title" is required.`);
  }
  if (!isStats(data?.stats)) {
    throw new Error(`Invalid case data for "${caseId}": field "stats" must be [label, value][] with non-empty strings.`);
  }
  if (!isColumns(data?.columns)) {
    throw new Error(`Invalid case data for "${caseId}": field "columns" must be [{ title, items[] }].`);
  }
}

export function validateEstimateState(state) {
  if (!Array.isArray(state?.bullets) || state.bullets.length === 0 || !state.bullets.every(isNonEmptyString)) {
    throw new Error('Invalid estimate state: field "bullets" must contain at least one non-empty string.');
  }
}

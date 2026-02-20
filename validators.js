// scripts/validators.js — Regex validation rules

// --- RULE 1: Description (no leading/trailing spaces, no collapse doubles) ---
const RE_DESCRIPTION = /^\S(?:.*\S)?$/;

// --- RULE 2: Numeric amount (currency format) ---
const RE_AMOUNT = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// --- RULE 3: Date (YYYY-MM-DD) ---
const RE_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// --- RULE 4: Category/tag (letters, spaces, hyphens) ---
const RE_CATEGORY = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// --- ADVANCED RULE: Duplicate word detection (back-reference) ---
const RE_DUPLICATE_WORD = /\b(\w+)\s+\1\b/i;

// --- Rate validation (positive decimal) ---
const RE_RATE = /^\d+(\.\d{1,6})?$/;

/**
 * Validate a transaction description
 * @param {string} val
 * @returns {string} error message or empty string
 */
export function validateDescription(val) {
  if (!val || val.trim() === '') return 'Description is required.';
  if (!RE_DESCRIPTION.test(val)) return 'Description must not start or end with spaces.';
  if (val.length > 200) return 'Description must be 200 characters or fewer.';
  return '';
}

/**
 * Check for duplicate words in text (advanced back-reference regex)
 * @param {string} val
 * @returns {string} warning message or empty string
 */
export function checkDuplicateWords(val) {
  const match = RE_DUPLICATE_WORD.exec(val);
  if (match) return `Duplicate word detected: "${match[1]}"`;
  return '';
}

/**
 * Validate amount
 * @param {string} val
 * @returns {string} error message or empty string
 */
export function validateAmount(val) {
  if (!val || val.trim() === '') return 'Amount is required.';
  if (!RE_AMOUNT.test(val.trim())) return 'Enter a valid amount (e.g. 12.50).';
  const num = parseFloat(val);
  if (num <= 0) return 'Amount must be greater than zero.';
  if (num > 1_000_000) return 'Amount must be below $1,000,000.';
  return '';
}

/**
 * Validate date string
 * @param {string} val
 * @returns {string} error message or empty string
 */
export function validateDate(val) {
  if (!val || val.trim() === '') return 'Date is required.';
  if (!RE_DATE.test(val.trim())) return 'Enter a valid date (YYYY-MM-DD).';
  return '';
}

/**
 * Validate category
 * @param {string} val
 * @returns {string} error message or empty string
 */
export function validateCategory(val) {
  if (!val || val.trim() === '') return 'Please select a category.';
  if (!RE_CATEGORY.test(val.trim())) return 'Category may only contain letters, spaces, and hyphens.';
  return '';
}

/**
 * Validate a currency exchange rate
 * @param {string} val
 * @returns {string} error message or empty string
 */
export function validateRate(val) {
  if (!val || val.trim() === '') return 'Rate is required.';
  if (!RE_RATE.test(val.trim())) return 'Enter a valid positive number (e.g. 0.92).';
  const num = parseFloat(val);
  if (num <= 0) return 'Rate must be greater than zero.';
  return '';
}

/**
 * Validate budget cap
 * @param {string} val
 * @returns {string}
 */
export function validateBudgetCap(val) {
  if (!val || val.trim() === '') return ''; // Optional field
  if (!RE_AMOUNT.test(val.trim())) return 'Enter a valid amount (e.g. 500.00).';
  const num = parseFloat(val);
  if (num <= 0) return 'Cap must be greater than zero.';
  return '';
}

/**
 * Validate a full transaction object
 * @param {Object} data
 * @returns {Object} map of field → error string
 */
export function validateTransaction(data) {
  const errors = {};
  const descErr = validateDescription(data.description);
  if (descErr) errors.description = descErr;

  const amtErr = validateAmount(String(data.amount));
  if (amtErr) errors.amount = amtErr;

  const dateErr = validateDate(data.date);
  if (dateErr) errors.date = dateErr;

  const catErr = validateCategory(data.category);
  if (catErr) errors.category = catErr;

  return errors;
}

/**
 * Safe regex compiler for search
 * @param {string} input
 * @param {string} flags
 * @returns {RegExp|null}
 */
export function compileRegex(input, flags = 'i') {
  try {
    return input ? new RegExp(input, flags) : null;
  } catch {
    return null;
  }
}

/**
 * Highlight regex matches in text (returns HTML string)
 * @param {string} text
 * @param {RegExp|null} re
 * @returns {string}
 */
export function highlightMatches(text, re) {
  if (!re) return escapeHtml(text);
  // Split on matches and reassemble with <mark> tags
  const parts = [];
  let lastIndex = 0;
  re.lastIndex = 0;
  const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let match;
  while ((match = globalRe.exec(text)) !== null) {
    parts.push(escapeHtml(text.slice(lastIndex, match.index)));
    parts.push(`<mark>${escapeHtml(match[0])}</mark>`);
    lastIndex = globalRe.lastIndex;
    if (globalRe.lastIndex === match.index) globalRe.lastIndex++; // prevent infinite loop
  }
  parts.push(escapeHtml(text.slice(lastIndex)));
  return parts.join('');
}

/**
 * Escape HTML special chars
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

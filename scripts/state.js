// scripts/state.js — Application state management

import { loadTransactions, saveTransactions, loadSettings, saveSettings } from './storage.js';

/** @type {Array<Object>} */
let transactions = [];

/** @type {Object} */
let settings = {};

/** @type {string} Current sort key */
let sortKey = 'date';

/** @type {'asc'|'desc'} Current sort direction */
let sortDir = 'desc';

/** @type {string} Current search query */
let searchQuery = '';

/** @type {boolean} Case sensitive search */
let caseSensitive = false;

/** @type {string} Type filter */
let filterType = 'all';

/** @type {string} Category filter */
let filterCategory = 'all';

// ─── Init ─────────────────────────────────────────────────────────────

export function initState() {
  transactions = loadTransactions();
  settings = loadSettings();
}

// ─── Transactions ──────────────────────────────────────────────────────

export function getTransactions() {
  return [...transactions];
}

export function addTransaction(tx) {
  transactions.unshift(tx);
  saveTransactions(transactions);
}

export function updateTransaction(id, updates) {
  const idx = transactions.findIndex(t => t.id === id);
  if (idx === -1) return false;
  transactions[idx] = {
    ...transactions[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveTransactions(transactions);
  return true;
}

export function deleteTransaction(id) {
  const before = transactions.length;
  transactions = transactions.filter(t => t.id !== id);
  if (transactions.length < before) {
    saveTransactions(transactions);
    return true;
  }
  return false;
}

export function getTransactionById(id) {
  return transactions.find(t => t.id === id) || null;
}

export function replaceAllTransactions(newList) {
  transactions = newList;
  saveTransactions(transactions);
}

// ─── Settings ──────────────────────────────────────────────────────────

export function getSettings() {
  return { ...settings };
}

export function updateSettings(updates) {
  settings = { ...settings, ...updates };
  saveSettings(settings);
}

// ─── Filtering & Sorting ───────────────────────────────────────────────

export function setSort(key, dir) {
  sortKey = key;
  sortDir = dir;
}

export function getSort() {
  return { sortKey, sortDir };
}

export function setSearch(query, cs = false) {
  searchQuery = query;
  caseSensitive = cs;
}

export function getSearch() {
  return { searchQuery, caseSensitive };
}

export function setFilterType(val) { filterType = val; }
export function setFilterCategory(val) { filterCategory = val; }
export function getFilters() { return { filterType, filterCategory }; }

// ─── Derived / Computed ────────────────────────────────────────────────

export function getTotals() {
  let income = 0;
  let expenses = 0;
  for (const tx of transactions) {
    if (tx.type === 'income') income += tx.amount;
    else expenses += tx.amount;
  }
  return { income, expenses, balance: income - expenses };
}

export function getMonthTotals() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  let income = 0;
  let expenses = 0;
  for (const tx of transactions) {
    const d = new Date(tx.date);
    if (d.getFullYear() === y && d.getMonth() === m) {
      if (tx.type === 'income') income += tx.amount;
      else expenses += tx.amount;
    }
  }
  return { income, expenses };
}

export function getLast7DaysTotals() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });
    const dayTxs = transactions.filter(tx => tx.date === dateStr);
    const income = dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    days.push({ date: dateStr, label: dayLabel, income, expense });
  }
  return days;
}

export function getLast7DaysSpend() {
  return getLast7DaysTotals().reduce((s, d) => s + d.expense, 0);
}

export function getTopCategory() {
  const counts = {};
  for (const tx of transactions) {
    if (tx.type === 'expense') {
      counts[tx.category] = (counts[tx.category] || 0) + tx.amount;
    }
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : '—';
}

export function getAvgTransaction() {
  if (transactions.length === 0) return 0;
  const total = transactions.reduce((s, t) => s + t.amount, 0);
  return total / transactions.length;
}

export function getCategories() {
  const cats = new Set(transactions.map(t => t.category));
  return [...cats].sort();
}

/**
 * Generate a unique ID in format txn_XXXX
 */
export function generateId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `txn_${timestamp}${rand}`;
}

# ◈ FlowFunds — Student Finance Tracker

> A fully accessible, responsive, vanilla HTML/CSS/JS student finance tracking app.  
> **Theme:** Student Finance Tracker  
> **Live Demo:** [GitHub Pages URL]  

---

## Overview

FlowFunds helps students take control of their money — log income from jobs, scholarships, and gifts; track everyday expenses; visualize 7-day trends; and export data for backup or analysis.

Built with **no frameworks** (pure HTML5, CSS3, ES Modules) with a focus on accessibility, mobile-first design, and clean modular code.

---

## Features

| Feature | Details |
|---|---|
| Add Income | Form with real-time regex validation |
| Add Expense | Form with duplicate-word detection (advanced regex) |
| Edit Transactions | Modal with full re-validation |
| Delete Transactions | Confirm dialog before deletion |
| Regex Search | Live search with safe compiler, case toggle, match highlighting |
| Sort | By date, amount, or description (A↕Z) |
| Filter | By type (income/expense) and category |
| 7-Day Chart | CSS/JS bar chart of daily income vs expenses |
| Stats Dashboard | Income, expenses, net balance, budget cap |
| Budget Cap | Set monthly limit with ARIA live alerts (polite under, assertive over) |
| localStorage | Auto-save on every change, load on startup |
| JSON Export | Download all data as timestamped JSON |
| JSON Import | Upload and validate JSON, merges or replaces |
| Currency Settings | Base + 2 alt currencies with manual rates |
| Quick Converter | Live currency conversion tool |
| Responsive | Mobile-first: 360px / 480px / 768px / 1024px+ |
| Accessibility | WCAG 2.1 AA target, keyboard nav, ARIA live regions |

---

## Regex Catalog

| Rule | Pattern | Valid Example | Invalid Example |
|---|---|---|---|
| Description (no leading/trailing spaces) | `/^\S(?:.*\S)?$/` | `"Coffee with friends"` | `" leading"` |
| Amount (currency, up to 2 decimals) | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | `"12.50"` | `"12.500"` |
| Date (YYYY-MM-DD) | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `"2025-09-29"` | `"09/29/2025"` |
| Category (letters, spaces, hyphens) | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `"Part-time"` | `"Food@Home"` |
| **Duplicate word (back-reference)** | `/\b(\w+)\s+\1\b/i` | — | `"the the shop"` |
| Rate (positive decimal) | `/^\d+(\.\d{1,6})?$/` | `"0.92"` | `"-0.5"` |
| Budget cap (optional positive) | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | `"500.00"` | `"abc"` |

**Search patterns users can try:**
- `(coffee|tea)` — Find beverages
- `\.\d{2}\b` — Find amounts with cents
- `\b(\w+)\s+\1\b` — Find duplicate words in descriptions
- `^[A-Z]` — Descriptions starting with capital
- `food|books` — Multiple categories (regex OR)

---

## Keyboard Navigation Map

| Key / Shortcut | Action |
|---|---|
| `Tab` | Move focus forward |
| `Shift+Tab` | Move focus backward |
| `Enter` / `Space` | Activate button or link |
| `Escape` | Close modal / close mobile sidebar |
| `Enter` (on form) | Submit form |
| Arrow keys | Navigate select dropdowns |
| `Tab` to skip link | Jump to main content (first Tab press) |

All interactive elements have **visible focus rings** (2px gold outline).

---

## Accessibility Notes

- Semantic HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- All form `<input>` and `<select>` elements have associated `<label>` elements
- Skip-to-content link appears on first Tab press
- ARIA live regions:
  - `role="alert" aria-live="assertive"` — inline field errors
  - `role="status" aria-live="polite"` — form success messages, result counts
  - Budget cap: `polite` when under cap, `assertive` when exceeded
- `aria-current="page"` on active nav link
- `aria-expanded` on hamburger button
- `aria-modal="true"` + `aria-labelledby` on dialog modals
- `aria-pressed` on case-sensitive search toggle
- `<mark>` for search highlights (accessible by screen readers)
- Color contrast: Gold on dark background meets WCAG AA (4.5:1+)
- No reliance on color alone to convey information

---

## File Structure

```
finance-tracker/
├── index.html          # Main HTML (all pages/sections)
├── tests.html          # Regex validation test suite
├── seed.json           # 12 diverse seed records
├── README.md           # This file
├── styles/
│   ├── main.css        # Design system, base, layout
│   ├── components.css  # UI components, animations
│   └── responsive.css  # Mobile-first breakpoints
└── scripts/
    ├── app.js          # Main entry — navigation, events, wiring
    ├── state.js        # App state management
    ├── storage.js      # localStorage + import/export
    ├── ui.js           # Rendering functions
    └── validators.js   # All regex rules + highlight/escape utils
```

---

## Running Tests

1. Open `tests.html` in a browser (must be served, not `file://` due to ES modules)
2. A local server is recommended:
   ```bash
   npx serve .
   # or
   python3 -m http.server 3000
   ```
3. Navigate to `http://localhost:3000/tests.html`

---

## Importing Seed Data

1. Go to **Settings** → **Data Management**
2. Click **Import JSON**
3. Select `seed.json` from the project folder
4. 12 diverse records will be loaded instantly

---

## Deployment

Deployed via **GitHub Pages** — see the live URL at the top of this README.

To deploy your own:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker.git
git push -u origin main
# Enable GitHub Pages in repo Settings → Pages → main branch
```

---

## Academic Integrity

All UI, logic, and design is original work. No external libraries, frameworks, or Bootstrap used. Accessibility patterns referenced from MDN Web Docs and WCAG 2.1 guidelines.

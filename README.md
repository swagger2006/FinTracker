# FinTracker

A responsive personal finance dashboard UI built for the Zorvyn Frontend Developer Intern assignment.

## Overview

This project simulates a polished finance dashboard where users can:

- review balance, income, and expense summaries
- explore monthly trend and category breakdown charts
- search, filter, and sort transactions
- export the currently filtered transactions to CSV
- switch between `Viewer` and `Admin` roles
- add or edit transactions in `Admin` mode
- toggle between light and dark mode with persisted theme preference
- use the app comfortably on desktop and mobile layouts

The app uses mock data only and does not depend on a backend.

## Features

- Single-page dashboard with anchored sections for Overview, Transactions, and Insights
- Persistent Zustand store for role, theme, filters, and transactions
- Role-based UI with read-only `Viewer` mode and editable `Admin` mode
- CSV export for the visible filtered transaction list
- Dark mode toggle with persisted preference
- Mobile-friendly layout with:
  mobile section navigation
  stacked action controls
  responsive chart sizing
  card-based transaction list on small screens
- Graceful empty state for filtered transaction results

## Tech Stack

- React 19
- Vite
- Zustand with persistence
- Tailwind CSS v4
- Recharts
- React Icons

## Project Structure

```text
FinTracker/
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- assets/
|   |   |-- hero.png
|   |   |-- react.svg
|   |   `-- vite.svg
|   |-- components/
|   |   |-- Layout.jsx
|   |   |-- Sidebar.jsx
|   |   `-- Topbar.jsx
|   |-- data/
|   |   `-- mockData.js
|   |-- pages/
|   |   |-- Dashboard.jsx
|   |   |-- Insights.jsx
|   |   `-- Transactions.jsx
|   |-- store/
|   |   `-- useFinanceStore.js
|   |-- utils/
|   |   `-- helpers.js
|   |-- App.css
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- eslint.config.js
|-- vite.config.js
|-- package.json
`-- README.md
```

## State Management

Zustand is used for:

- transaction data
- selected role
- selected theme
- transaction filters
- add/edit update actions

The store is persisted in local storage so role changes, theme preference, and transaction updates survive refreshes.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Submission Notes

- Mock transactions cover multiple months to support trend and comparison visuals.
- The role switcher in the top bar is the main RBAC demonstration control.
- The theme toggle persists between refreshes.
- CSV export downloads the currently filtered transaction set.
- On mobile screens, section navigation moves to the top bar and transactions switch to a card layout for readability.
- If you want to restore the original mock dataset after editing, use the reset action available in the transactions empty state or clear browser storage for this app.

# FinTracker

A responsive finance dashboard UI built for the Zorvyn Frontend Developer Intern assignment.

## Overview

This project simulates a personal finance dashboard where users can:

- review balance, income, and expense summaries
- explore time-based and category-based charts
- search, filter, and sort transactions
- switch between `Viewer` and `Admin` roles
- add or edit transactions in `Admin` mode
- review quick insights such as highest spending category and monthly comparisons

The app uses mock data only and does not depend on a backend.

## Tech Stack

- React 19
- Vite
- Zustand with persistence
- Tailwind CSS v4
- Recharts

## State Management

Zustand is used for:

- transaction data
- selected role
- transaction filters
- add/edit update actions

The store is persisted in local storage so role changes and transaction updates survive refreshes.

## Design Notes

- Single-page dashboard with anchored sections for Overview, Transactions, and Insights
- Responsive layout with a desktop sidebar and mobile-friendly stacked content
- Read-only viewer experience and admin-enabled editing flow for role-based UI demonstration
- Graceful empty state for filtered transaction results

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
- If you want to restore the original mock dataset after editing, use the reset action available in the transactions empty state or clear browser storage for this app.

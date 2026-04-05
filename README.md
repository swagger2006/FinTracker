 FinTracker

A modern, responsive Finance Dashboard UI built for the Zorvyn Frontend Developer Intern Assignment.

 Live Demo: https://fin-tracker-lac.vercel.app/
 
 GitHub Repository: https://github.com/swagger2006/FinTracker

---

# Overview

FinTracker is a frontend-focused finance dashboard designed to help users track, analyze, and understand financial activity through an intuitive and visually rich interface.

It demonstrates:

- Clean UI/UX design
- Component-based architecture
- Real-world dashboard patterns
- Efficient state management

« Built using mock data only (no backend).»

---

 Key Highlights

-  Interactive financial dashboard
-  Role-based UI (Viewer/Admin)
-  Dark mode with persistence
-  CSV export functionality
-  Fully responsive design
-  Smooth user experience



 Transactions Management

- Search, filter, and sort transactions
- View detailed financial records
- Admin can add/edit entries

---

 Insights

- Highest spending category
- Monthly comparisons
- Financial trends & observations

---

 Tech Stack

-  React 19 + Vite
-  Zustand (State Management + Persistence)
-  Tailwind CSS v4
-  Recharts

---

 Project Structure

FinTracker
├─ public      → favicon.svg, icons.svg
├─ src         → assets(hero.png, react.svg, vite.svg)
│               components(Layout.jsx, Sidebar.jsx, Topbar.jsx)
│               pages(Dashboard.jsx, Insights.jsx, Transactions.jsx)
│               data(mockData.js)
│               store(useFinanceStore.js)
│               utils(helpers.js)
│               App.jsx, App.css, main.jsx, index.css
├─ config      → .gitignore, eslint.config.js, vite.config.js
├─ packages    → package.json, package-lock.json
└─ root files  → index.html, README.md

---

 State Management

Zustand manages:

- Transactions data
- Role switching (Viewer/Admin)
- Filters & search
- Add/Edit actions

 Persisted using localStorage

---

 Run Locally

npm install
npm run dev

---

 Build

npm run build

---

 What Makes This Stand Out

- Real-world fintech dashboard experience
- Clean and modern UI design
- Role-based interaction simulation
- Persistent dark mode
- CSV export (practical feature)
- Scalable and maintainable structure

---


 Dashboard Preview


![dashboard](https://github.com/user-attachments/assets/82e47770-dd7d-440e-a062-c282773d02a1)


«A unified view showing financial summaries, role-based actions, and key metrics.»

---

 Analytics & Visualization


![analytics](https://github.com/user-attachments/assets/107804e8-258d-4bec-8905-a54705a8b0de)


«Includes time-based balance trends and category-wise spending breakdown using Recharts.»

---

 Future Enhancements

- Backend integration
- Authentication system

- Advanced filtering (date range)
- Export to PDF
- Real-time updates

---

 Author

Aruni Sharma
 arunisharma2006@gmail.com

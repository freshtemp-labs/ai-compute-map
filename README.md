# 🌐 AI Compute Map

> AI 基础设施全球实时可视化平台 — Global AI Infrastructure Real-Time Visualization

An interactive, multilingual dashboard that maps the global AI compute supply chain — from rare earth minerals and EUV lithography equipment to advanced foundries and hyperscale data centers.

## ✨ Features

### 🗺️ Interactive Map
- Multi-layer map with supply chain nodes, foundry facilities, and data centers
- Click any pin to see detailed facility info, metrics, and supply chain relationships
- Color-coded layers with toggle controls

### 📊 Supply Chain Dashboard
- Rare earth production quotas with pie chart visualization
- Lithography equipment market breakdown (ASML, Nikon, Canon, SMEE)
- Design firms and energy/labor analytics
- Filterable data table with CSV/JSON export

### 🏭 Foundries & Data Centers
- Global semiconductor fabrication facility directory
- Data center locations with power capacity and PUE metrics
- Status badges: Operational, Construction, Planned, Expansion

### 📈 History & Trends
- Year-over-year trends (2019–2030) for data centers, capacity, power, revenue, EUV units
- Interactive year slider with compare mode
- Regional distribution pie chart

### 🔌 Developer API
- REST API documentation with interactive examples
- JavaScript (fetch) and cURL code samples
- Endpoint reference with parameters and response schemas

### 🌍 Internationalization (i18n)
- 4 languages: 中文, English, 日本語, 한국어
- Full key parity across all locale files
- Browser language auto-detection

## 📸 Screenshots

| Page | Description |
|------|-------------|
| **Home** | Hero section with animated headline, 3-layer cards, KPI dashboard, and footer |
| **Map** | Full-screen interactive map with sidebar layer toggles, search, and detail panel |
| **Supply Chain** | Rare earth pie chart, lithography cards, design firms grid, filterable data table |
| **Foundries** | Foundry cards with process nodes, capacity, and company details |
| **Data Centers** | Data center table with region/provider filters, power capacity metrics |
| **History** | Year slider, multi-metric trend chart, compare mode, regional distribution |
| **Sources** | Source reference table with tier badges and verification status |
| **Developers** | API docs with syntax-highlighted code, interactive endpoint explorer |

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript 5.9
- **Build**: Vite 7 (code-splitting, lazy-loaded pages)
- **Styling**: Tailwind CSS 3.4 + custom design tokens
- **Charts**: ECharts, Recharts
- **Map**: amCharts 5 with geodata
- **Animation**: Framer Motion
- **Routing**: React Router 7 (HashRouter)
- **i18n**: i18next + react-i18next + browser language detector
- **Testing**: Vitest + Testing Library + jsdom
- **Icons**: Lucide React

## 🚀 Getting Started

```bash
# Install dependencies
cd app && npm install

# Start dev server (http://localhost:3000)
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── map/          # MapPage, DetailPanel, useMapData
│   │   ├── ui/           # Reusable UI components (shadcn-style)
│   │   ├── Layout.tsx    # App shell with nav + footer
│   │   └── ErrorBoundary.tsx
│   ├── pages/            # Route pages (lazy-loaded)
│   │   ├── Home.tsx
│   │   ├── MapPage.tsx
│   │   ├── SupplyChainPage.tsx
│   │   ├── FoundriesPage.tsx
│   │   ├── DataCentersPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── SourcesPage.tsx
│   │   └── DevelopersPage.tsx
│   ├── data/             # Mock data & type definitions
│   ├── i18n/locales/     # {zh,en,ja,ko}/{common,map,...}.json
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── constants/        # Color constants, config
│   ├── types/            # TypeScript interfaces
│   └── __tests__/        # Test suites
├── vite.config.ts
└── package.json
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch
```

Test suites:
- **smoke.test.ts** — All page modules export valid React components
- **detailPanel.test.ts** — DetailPanel, HistoryPage, and all page module smoke tests
- **data.test.ts** — Data integrity: unique IDs, valid coordinates, required fields
- **i18n.test.ts** — Key parity across all 4 languages, no empty values, namespace consistency

## 📦 API Reference

The Developers page documents a REST API with these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/data-centers` | List data centers (filter by region, provider, power) |
| GET | `/api/v1/supply-chain` | Supply chain nodes (filter by type, country) |
| GET | `/api/v1/foundries` | Foundry facilities (filter by company, process node) |
| GET | `/api/v1/market-share` | Market share data by company |
| GET | `/api/v1/export/csv` | Export filtered dataset as CSV |

Base URL: `https://api.aicomputemap.org`

## 📄 License

This project is licensed under the **CC BY-SA 4.0** (Creative Commons Attribution-ShareAlike 4.0 International License).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose

Under the following terms:
- **Attribution** — You must give appropriate credit
- **ShareAlike** — Distribute contributions under the same license

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm run test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📊 Data Sources

All data is sourced from public reports and industry analysis:
- **Tier 1** — Official company reports, government filings
- **Tier 2** — Industry analyst reports (TrendForce, Gartner, IDC)
- **Tier 3** — Model-based estimates and projections

Data is updated regularly. See the Sources page in the app for full attribution.

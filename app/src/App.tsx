import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import { PageSkeleton } from './components/PageSkeleton'

// Eagerly load Home (landing page, small and first-visible)
import Home from './pages/Home'

// Lazy-load all other pages for code splitting
const MapPage = lazy(() => import('./pages/MapPage'))
const SupplyChainPage = lazy(() => import('./pages/SupplyChainPage'))
const FoundriesPage = lazy(() => import('./pages/FoundriesPage'))
const DataCentersPage = lazy(() => import('./pages/DataCentersPage'))
const SourcesPage = lazy(() => import('./pages/SourcesPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const DevelopersPage = lazy(() => import('./pages/DevelopersPage'))

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<LazyPage><MapPage /></LazyPage>} />
          <Route path="/supply-chain" element={<LazyPage><SupplyChainPage /></LazyPage>} />
          <Route path="/foundries" element={<LazyPage><FoundriesPage /></LazyPage>} />
          <Route path="/datacenters" element={<LazyPage><DataCentersPage /></LazyPage>} />
          <Route path="/sources" element={<LazyPage><SourcesPage /></LazyPage>} />
          <Route path="/history" element={<LazyPage><HistoryPage /></LazyPage>} />
          <Route path="/developers" element={<LazyPage><DevelopersPage /></LazyPage>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

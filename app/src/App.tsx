/**
 * @file App.tsx
 * @description AI算力地图应用根组件。配置路由、Provider层级和页面懒加载。
 *   首页采用同步加载（首屏关键路径），其余页面全部通过React.lazy实现代码分割。
 * @dependencies react, react-router-dom, @/components/Layout, @/components/ErrorBoundary,
 *   @/components/PageSkeleton, @/context/CompareContext, @/context/SettingsContext,
 *   @/context/FavoritesContext
 */
import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import { PageSkeleton } from './components/PageSkeleton'
import { CompareProvider } from './context/CompareContext'
import { SettingsProvider } from './context/SettingsContext'
import { FavoritesProvider } from './context/FavoritesContext'

// 同步加载首页（首屏关键路径，体积小，优先呈现）
import Home from './pages/Home'

// 其余页面全部通过 React.lazy 实现代码分割，按需加载
const MapPage = lazy(() => import('./pages/MapPage'))
const SupplyChainPage = lazy(() => import('./pages/SupplyChainPage'))
const FoundriesPage = lazy(() => import('./pages/FoundriesPage'))
const DataCentersPage = lazy(() => import('./pages/DataCentersPage'))
const SourcesPage = lazy(() => import('./pages/SourcesPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const DevelopersPage = lazy(() => import('./pages/DevelopersPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const CountryDetailPage = lazy(() => import('./pages/CountryDetailPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const CountryComparePage = lazy(() => import('./pages/CountryComparePage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

/**
 * 懒加载页面包装组件
 * 为每个懒加载页面包裹 ErrorBoundary（错误隔离）和 Suspense（骨架屏）
 * @param children - 懒加载的页面内容
 */
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

/**
 * 应用根组件
 * Provider嵌套顺序：Settings → Favorites → Compare → HashRouter
 * 所有页面通过 Layout 组件共享导航栏和页脚
 * @returns 完整的应用路由树
 */
export default function App() {
  return (
    <SettingsProvider>
      <FavoritesProvider>
      <CompareProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<LazyPage><MapPage /></LazyPage>} />
              <Route path="/supply-chain" element={<LazyPage><SupplyChainPage /></LazyPage>} />
              <Route path="/foundries" element={<LazyPage><FoundriesPage /></LazyPage>} />
              <Route path="/datacenters" element={<LazyPage><DataCentersPage /></LazyPage>} />
              <Route path="/compare" element={<LazyPage><ComparePage /></LazyPage>} />
              <Route path="/sources" element={<LazyPage><SourcesPage /></LazyPage>} />
              <Route path="/history" element={<LazyPage><HistoryPage /></LazyPage>} />
              <Route path="/developers" element={<LazyPage><DevelopersPage /></LazyPage>} />
              <Route path="/country/:code" element={<LazyPage><CountryDetailPage /></LazyPage>} />
              <Route path="/news" element={<LazyPage><NewsPage /></LazyPage>} />
              <Route path="/compare-countries" element={<LazyPage><CountryComparePage /></LazyPage>} />
              <Route path="/insights" element={<LazyPage><InsightsPage /></LazyPage>} />
              <Route path="/settings" element={<LazyPage><SettingsPage /></LazyPage>} />
            </Route>
          </Routes>
        </HashRouter>
      </CompareProvider>
      </FavoritesProvider>
    </SettingsProvider>
  )
}

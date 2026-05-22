import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import SupplyChainPage from './pages/SupplyChainPage'
import FoundriesPage from './pages/FoundriesPage'
import DataCentersPage from './pages/DataCentersPage'
import SourcesPage from './pages/SourcesPage'
import HistoryPage from './pages/HistoryPage'
import DevelopersPage from './pages/DevelopersPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/supply-chain" element={<SupplyChainPage />} />
          <Route path="/foundries" element={<FoundriesPage />} />
          <Route path="/datacenters" element={<DataCentersPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

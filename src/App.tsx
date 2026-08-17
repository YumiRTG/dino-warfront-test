import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import HomeModesNetworkPortal from '@/components/HomeModesNetworkPortal'

const StoryPage = lazy(() => import('@/pages/StoryPage'))
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage'))
const BaseFeaturePage = lazy(() => import('@/pages/BaseFeaturePage'))
const HeroesFeaturePage = lazy(() => import('@/pages/HeroesFeaturePage'))
const DinosFeaturePage = lazy(() => import('@/pages/DinosFeaturePage'))
const CampaignFeaturePage = lazy(() => import('@/pages/CampaignFeaturePage'))
const PartnerSystemPage = lazy(() => import('@/pages/PartnerSystemPage'))
const WorldBossPage = lazy(() => import('@/pages/WorldBossPage'))
const PlayPage = lazy(() => import('@/pages/PlayPage'))
const BestiaryPage = lazy(() => import('@/pages/BestiaryPage'))
const DownloadPage = lazy(() => import('@/pages/DownloadPage'))
const DevlogPage = lazy(() => import('@/pages/DevlogPage'))
const ModesPage = lazy(() => import('@/pages/ModesPage'))
const CommanderPage = lazy(() => import('@/pages/CommanderPage'))
const RedeemPage = lazy(() => import('@/pages/RedeemPage'))
const AlliancePage = lazy(() => import('@/pages/AlliancePage'))
const TowerDefensePage = lazy(() => import('@/pages/modes/TowerDefensePage'))
const ArenaPage = lazy(() => import('@/pages/modes/ArenaPage'))
const WorldMapPage = lazy(() => import('@/pages/modes/WorldMapPage'))
const CampaignModePage = lazy(() => import('@/pages/modes/CampaignPage'))

function RouteFallback() {
  return <div className="min-h-[45vh]" aria-hidden />
}

const deferred = (node: React.ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{node}</Suspense>
)

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="story" element={deferred(<StoryPage />)} />
          <Route path="features" element={deferred(<FeaturesPage />)} />
          <Route path="features/base" element={deferred(<BaseFeaturePage />)} />
          <Route path="features/heroes" element={deferred(<HeroesFeaturePage />)} />
          <Route path="features/dinos" element={deferred(<DinosFeaturePage />)} />
          <Route path="features/campaign" element={deferred(<CampaignFeaturePage />)} />
          <Route path="features/partner-system" element={deferred(<PartnerSystemPage />)} />
          <Route path="features/world-boss" element={deferred(<WorldBossPage />)} />
          <Route path="modes" element={deferred(<ModesPage />)} />
          <Route path="modes/tower-defense" element={deferred(<TowerDefensePage />)} />
          <Route path="modes/arena" element={deferred(<ArenaPage />)} />
          <Route path="modes/world-map" element={deferred(<WorldMapPage />)} />
          <Route path="modes/campaign" element={deferred(<CampaignModePage />)} />
          <Route path="play" element={deferred(<PlayPage />)} />
          <Route path="bestiary" element={deferred(<BestiaryPage />)} />
          <Route path="download" element={deferred(<DownloadPage />)} />
          <Route path="progress" element={deferred(<DevlogPage />)} />
          <Route path="redeem" element={deferred(<RedeemPage />)} />
          <Route path="commander/:id" element={deferred(<CommanderPage />)} />
          <Route path="alliance/:id" element={deferred(<AlliancePage />)} />
          <Route path="tower-defense" element={<Navigate to="/modes/tower-defense" replace />} />
          <Route path="arena" element={<Navigate to="/modes/arena" replace />} />
          <Route path="world-map" element={<Navigate to="/modes/world-map" replace />} />
          <Route path="campaign" element={<Navigate to="/modes/campaign" replace />} />
          <Route path="partner-system" element={<Navigate to="/features/partner-system" replace />} />
          <Route path="world-boss" element={<Navigate to="/features/world-boss" replace />} />
          <Route path="daily" element={<Navigate to="/play" replace />} />
          <Route path="roulette" element={<Navigate to="/play" replace />} />
          <Route path="dinos" element={<Navigate to="/features/dinos" replace />} />
          <Route path="heroes" element={<Navigate to="/features/heroes" replace />} />
          <Route path="devlog" element={<Navigate to="/progress" replace />} />
          <Route path="apk" element={<Navigate to="/download" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <HomeModesNetworkPortal />
    </BrowserRouter>
  )
}

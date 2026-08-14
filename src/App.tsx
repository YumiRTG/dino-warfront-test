import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import StoryPage from '@/pages/StoryPage'
import FeaturesPage from '@/pages/FeaturesPage'
import BaseFeaturePage from '@/pages/BaseFeaturePage'
import HeroesFeaturePage from '@/pages/HeroesFeaturePage'
import DinosFeaturePage from '@/pages/DinosFeaturePage'
import CampaignFeaturePage from '@/pages/CampaignFeaturePage'
import PlayPage from '@/pages/PlayPage'
import BestiaryPage from '@/pages/BestiaryPage'
import DownloadPage from '@/pages/DownloadPage'
import DevlogPage from '@/pages/DevlogPage'
import ModesPage from '@/pages/ModesPage'
import CommanderPage from '@/pages/CommanderPage'
import RedeemPage from '@/pages/RedeemPage'
import AlliancePage from '@/pages/AlliancePage'
import TowerDefensePage from '@/pages/modes/TowerDefensePage'
import ArenaPage from '@/pages/modes/ArenaPage'
import WorldMapPage from '@/pages/modes/WorldMapPage'
import CampaignModePage from '@/pages/modes/CampaignPage'

/**
 * Premium multi-page site.
 * Kept: Account system + Home, Story, Features
 * Rest: curated high-impact pages only
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="features/base" element={<BaseFeaturePage />} />
          <Route path="features/heroes" element={<HeroesFeaturePage />} />
          <Route path="features/dinos" element={<DinosFeaturePage />} />
          <Route path="features/campaign" element={<CampaignFeaturePage />} />
          {/* Major modes */}
          <Route path="modes" element={<ModesPage />} />
          <Route path="modes/tower-defense" element={<TowerDefensePage />} />
          <Route path="modes/arena" element={<ArenaPage />} />
          <Route path="modes/world-map" element={<WorldMapPage />} />
          <Route path="modes/campaign" element={<CampaignModePage />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="bestiary" element={<BestiaryPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="progress" element={<DevlogPage />} />
          <Route path="redeem" element={<RedeemPage />} />
          {/* Public profiles */}
          <Route path="commander/:id" element={<CommanderPage />} />
          <Route path="alliance/:id" element={<AlliancePage />} />
          {/* Short aliases */}
          <Route path="tower-defense" element={<Navigate to="/modes/tower-defense" replace />} />
          <Route path="arena" element={<Navigate to="/modes/arena" replace />} />
          <Route path="world-map" element={<Navigate to="/modes/world-map" replace />} />
          <Route path="campaign" element={<Navigate to="/modes/campaign" replace />} />
          {/* Legacy redirects */}
          <Route path="daily" element={<Navigate to="/play" replace />} />
          <Route path="roulette" element={<Navigate to="/play" replace />} />
          <Route path="dinos" element={<Navigate to="/features/dinos" replace />} />
          <Route path="heroes" element={<Navigate to="/features/heroes" replace />} />
          <Route path="devlog" element={<Navigate to="/progress" replace />} />
          <Route path="apk" element={<Navigate to="/download" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import React, { useState } from 'react';
import { TopNavbar } from './TopNavbar';
import { GlobalLayersModal } from '../modals/GlobalLayersModal';
import { LayerState } from '../../types';

interface NavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode = false, onToggleTheme }) => {
  const [isLayersModalOpen, setIsLayersModalOpen] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    surface: true,
    temperature: true,
    salinity: true,
    currents: true,
    northwardCurrent: false,
    eastwardCurrent: false,
    ssh: false,
    reliability: false,
    confidence: true,
    argo: true,
    buoys: true,
    observationPoints: false,
    predictionLayer: true,
    alerts: true,
    anomalyLayer: false,
    bathymetry: false,
  });

  const handleToggleLayer = (key: keyof LayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = (query: string) => {
    console.log('Search queried in global navbar:', query);
  };

  return (
    <>
      <TopNavbar
        onSearch={handleSearch}
        onToggleLayers={() => setIsLayersModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        apiOnline={true}
        dbOnline={true}
        modelActive={true}
      />
      <GlobalLayersModal
        isOpen={isLayersModalOpen}
        onClose={() => setIsLayersModalOpen(false)}
        layers={layers}
        onToggleLayer={handleToggleLayer}
      />
    </>
  );
};


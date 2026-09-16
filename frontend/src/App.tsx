import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { GlobePage } from './pages/Globe/GlobePage';
import { ReliabilityPage } from './pages/Reliability/ReliabilityPage';
import { ForecastPage } from './pages/Forecast/ForecastPage';
import { AlertsPage } from './pages/Alerts/AlertsPage';
import { RegionsPage } from './pages/Regions/RegionsPage';
import { ModelAnalyticsPage } from './pages/ModelAnalytics/ModelAnalyticsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { AboutPage } from './pages/About/AboutPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleGlobalRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // If on root route `/`, render standalone full operational platform
  if (location.pathname === '/') {
    return <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-ocean-500 selection:text-white">
      <Navbar onRefresh={handleGlobalRefresh} isRefreshing={isRefreshing} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/globe" element={<GlobePage />} />
          <Route path="/reliability" element={<ReliabilityPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/models" element={<ModelAnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

export default App;


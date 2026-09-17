import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Search, Layers, Clock, Sun, Moon, Settings, Database, Globe, ShieldCheck, Navigation, BarChart3, AlertTriangle, Cpu, FileText, Info, ChevronDown } from 'lucide-react';
import { SystemSettingsModal } from '../modals/SystemSettingsModal';

interface TopNavbarProps {
  onSearch: (query: string) => void;
  onToggleLayers?: () => void;
  onToggleTime?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  apiOnline?: boolean;
  dbOnline?: boolean;
  modelActive?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onSearch,
  onToggleLayers,
  onToggleTime,
  isDarkMode = false,
  onToggleTheme,
  apiOnline = true,
  dbOnline = true,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleQuickPresetSearch = (preset: string) => {
    setSearchQuery(preset);
    onSearch(preset);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Waves },
    { path: '/globe', label: 'Globe', icon: Globe },
    { path: '/reliability', label: 'Reliability', icon: ShieldCheck },
    { path: '/routing', label: 'Routing', icon: Navigation },
    { path: '/forecast', label: 'Forecast', icon: BarChart3 },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { path: '/regions', label: 'Regions', icon: Globe },
    { path: '/models', label: 'Models', icon: Cpu },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="h-[70px] bg-white dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-50 flex items-center px-3 sm:px-5">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-2 overflow-hidden">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ocean-600 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-ocean-500/20 ring-1 ring-ocean-400/30 group-hover:scale-105 transition-transform">
            <Waves className="w-4 h-4 text-white animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Ocean<span className="text-ocean-600">Sphere</span>
              </h1>
              <span className="hidden 2xl:inline-block px-1.5 py-0.5 rounded bg-ocean-50 dark:bg-ocean-950 border border-ocean-200 dark:border-ocean-800 text-[9px] font-bold text-ocean-700 dark:text-ocean-400 uppercase tracking-wider">
                v2.0
              </span>
            </div>
          </div>
        </Link>

        {/* Center-Left: Compact & Sleek Search Bar */}
        <div className="w-40 sm:w-48 lg:w-56 shrink-0 relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                onSearch(val);
              }}
              placeholder="Search sea or coords..."
              className="w-full pl-8 pr-9 py-1 text-[11px] sm:text-xs bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100/90 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500/20 outline-none transition-all shadow-inner font-medium"
            />
            <div className="absolute inset-y-0 right-1 flex items-center z-10">
              <button
                type="submit"
                className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-ocean-600 hover:bg-ocean-700 rounded transition-colors"
              >
                Go
              </button>
            </div>
          </form>
        </div>

        {/* Center-Right: All 10 Navigation Links Inline Without Scrollbar */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1 px-1.5 xl:px-2 py-1.5 rounded-lg text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-ocean-50 dark:bg-ocean-950 text-ocean-600 dark:text-ocean-400 border border-ocean-200/80 dark:border-ocean-800 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ocean-500' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Operational Controls & Badges */}
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            onClick={onToggleLayers}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-ocean-500/10 hover:bg-ocean-500/20 border border-ocean-500/30 text-ocean-600 dark:text-ocean-300 text-xs font-bold transition-all shadow-xs"
            title="Toggle Scientific Ocean Layers"
          >
            <Layers className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
            <span>Layers</span>
          </button>

          <button
            onClick={onToggleTime}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
            title="Timeline Controls"
          >
            <Clock className="w-3.5 h-3.5 text-ocean-600" />
            <span>Time</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="System Preferences & Settings"
          >
            <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* System Preferences Modal */}
      <SystemSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme || (() => {})}
      />
    </header>
  );
};



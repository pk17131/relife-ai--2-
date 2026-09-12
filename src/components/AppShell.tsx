import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Battery, 
  ShoppingBag, 
  ShieldCheck, 
  Bot, 
  Settings, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Globe, 
  ChevronRight,
  Sparkles,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ReLifeLogo } from './ReLifeLogo';
import { AppPage } from '../types';

interface AppShellProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  onExitToLanding: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  activePage,
  onNavigate,
  onExitToLanding,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-battery', label: 'Add Battery', icon: PlusCircle, badge: 'New' },
    { id: 'my-batteries', label: 'My Batteries', icon: Battery },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'passport', label: 'Battery Passport', icon: ShieldCheck },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getPageTitle = (page: AppPage) => {
    switch (page) {
      case 'dashboard':
        return 'Battery Lifecycle Intelligence Dashboard';
      case 'add-battery':
        return 'Assess New Battery';
      case 'analysis-results':
        return 'Battery Diagnostic Results';
      case 'my-batteries':
        return 'Fleet Battery Inventory';
      case 'marketplace':
        return 'Second-Life B2B Marketplace';
      case 'passport':
        return 'Digital Battery Passport Registry';
      case 'assistant':
        return 'Battery Intelligence Assistant';
      case 'settings':
        return 'Enterprise Workspace Settings';
      default:
        return 'ReLife AI Intelligence';
    }
  };

  const handleNavClick = (pageId: AppPage) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  const notifications = [
    { id: 'n1', title: 'RL-EV-001 Assessment Ready', text: '72.5% SOH calculated. Solar BESS candidate.', time: '5m ago', unread: true },
    { id: 'n2', title: 'Marketplace Inquiry', text: 'CleanMotion Labs reserved 150Ah pack.', time: '2h ago', unread: true },
    { id: 'n3', title: 'EU Passport Audit Passed', text: 'ISO 14044 carbon calculation verified.', time: '1d ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#070D1D] text-slate-100 flex flex-col md:flex-row antialiased font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#081023] border-r border-slate-800/80 shrink-0 select-none z-30">
        
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('dashboard')} 
            className="cursor-pointer"
          >
            <ReLifeLogo size="sm" showText={true} />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (activePage === 'analysis-results' && item.id === 'add-battery');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as AppPage)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
                id={`nav-item-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold ${
                    item.badge === 'AI' 
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Landing Page Switcher */}
          <button
            onClick={onExitToLanding}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-colors border border-slate-800 cursor-pointer"
            id="sidebar-exit-landing-btn"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Landing Page</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Environment Status Badge */}
          <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Intelligence Engine
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>

      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 bg-[#081023]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          
          {/* Left: Mobile Menu Toggle & Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate tracking-tight">
                {getPageTitle(activePage)}
              </h2>
            </div>
          </div>

          {/* Center/Right: Search Bar & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search */}
            <div className="relative hidden lg:block w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search batteries, passports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
                id="topbar-notifications-btn"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0C1427] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 px-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <span className="text-[10px] font-mono text-emerald-400">2 Unread</span>
                  </div>
                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-900 transition-colors text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-snug">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demo User Avatar & Status */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl hover:bg-slate-800 transition-colors border border-slate-800 cursor-pointer"
                id="topbar-user-avatar-btn"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
                  IN
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-none">Innovator</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Demo User</div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0C1427] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 duration-200">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-white">Innovator Energy Labs</div>
                    <div className="text-[10px] text-slate-400 font-mono">innovator@relife.ai</div>
                    <span className="inline-block px-1.5 py-0.5 mt-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-[9px]">
                      DEMO SESSION
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-900 hover:text-white flex items-center gap-2 text-left transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Workspace Settings
                    </button>
                    <button
                      onClick={onExitToLanding}
                      className="w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-900 hover:text-white flex items-center gap-2 text-left transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-teal-400" />
                      View Landing Page
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-72 bg-[#081023] h-full p-5 flex flex-col justify-between border-r border-slate-800 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <ReLifeLogo size="sm" showText={true} />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id as AppPage)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={onExitToLanding}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-900"
                >
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span>Exit to Landing Page</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#081023]/95 backdrop-blur-md border-t border-slate-800 px-3 flex items-center justify-around z-30">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              activePage === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => handleNavClick('add-battery')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              activePage === 'add-battery' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assess</span>
          </button>

          <button
            onClick={() => handleNavClick('my-batteries')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              activePage === 'my-batteries' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Battery className="w-4 h-4" />
            <span>Batteries</span>
          </button>

          <button
            onClick={() => handleNavClick('marketplace')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              activePage === 'marketplace' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Market</span>
          </button>

          <button
            onClick={() => handleNavClick('passport')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
              activePage === 'passport' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Passport</span>
          </button>
        </nav>

      </div>

    </div>
  );
};

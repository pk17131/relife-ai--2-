/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ImpactSection } from './components/ImpactSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { Footer } from './components/Footer';
import { InteractiveModals, ModalType } from './components/InteractiveModals';

// Stage 2 App Shell & Views
import { AppShell } from './components/AppShell';
import { DashboardView } from './components/DashboardView';
import { AddBatteryView } from './components/AddBatteryView';
import { AnalysisResultsView } from './components/AnalysisResultsView';
import { MyBatteriesView } from './components/MyBatteriesView';
import { MarketplaceView } from './components/MarketplaceView';
import { BatteryPassportView } from './components/BatteryPassportView';
import { AIAssistantView } from './components/AIAssistantView';
import { SettingsView } from './components/SettingsView';
import { DemoModeControl, DemoBatteryId } from './components/DemoModeControl';
import { AnalysisLoadingScreen } from './components/AnalysisLoadingScreen';
import { ExhibitionDemoModal } from './components/ExhibitionDemoModal';

import { AppPage, AssessmentRecord, MarketplaceListing, QuoteRequest, ListingStatus } from './types';
import { INITIAL_DEMO_BATTERIES } from './data/batteryData';
import { INITIAL_MARKETPLACE_LISTINGS, INITIAL_QUOTE_REQUESTS } from './data/marketplaceData';
import { LayoutDashboard, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Safe helper to read from localStorage
function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Navigation & Shell State
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('app');
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  
  // Exhibition Demo Modal State
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState<boolean>(false);

  // Battery Data State with persistent localStorage support (defaulting to 3 demo batteries)
  const [batteries, setBatteries] = useState<AssessmentRecord[]>(() =>
    getStoredItem('relife_batteries_exhibition_v2', INITIAL_DEMO_BATTERIES)
  );
  const [selectedBattery, setSelectedBattery] = useState<AssessmentRecord | null>(() =>
    getStoredItem('relife_selected_battery', INITIAL_DEMO_BATTERIES[0])
  );

  // Marketplace State with persistent localStorage support
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(() =>
    getStoredItem('relife_marketplace_listings', INITIAL_MARKETPLACE_LISTINGS)
  );
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(() =>
    getStoredItem('relife_quote_requests', INITIAL_QUOTE_REQUESTS)
  );

  // Demo Mode State
  const [demoBatteryId, setDemoBatteryId] = useState<DemoBatteryId>('RL-EV-001');
  const [isDemoAnalyzing, setIsDemoAnalyzing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('relife_batteries_exhibition_v2', JSON.stringify(batteries));
    } catch {}
  }, [batteries]);

  useEffect(() => {
    try {
      if (selectedBattery) {
        localStorage.setItem('relife_selected_battery', JSON.stringify(selectedBattery));
      }
    } catch {}
  }, [selectedBattery]);

  useEffect(() => {
    try {
      localStorage.setItem('relife_marketplace_listings', JSON.stringify(marketplaceListings));
    } catch {}
  }, [marketplaceListings]);

  useEffect(() => {
    try {
      localStorage.setItem('relife_quote_requests', JSON.stringify(quoteRequests));
    } catch {}
  }, [quoteRequests]);

  // Landing Page Modals & Section Tracking
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Track active section for landing navbar highlighting
  useEffect(() => {
    if (viewMode !== 'landing') return;

    const handleScroll = () => {
      const sections = ['product', 'how-it-works', 'impact', 'marketplace'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const handleOpenModal = (type: ModalType) => {
    // If user clicks login on landing page, let them also jump straight to app shell or view modal
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleAnalysisComplete = (result: AssessmentRecord) => {
    setSelectedBattery(result);
    // Add to batteries fleet if not already present
    setBatteries((prev) => {
      const exists = prev.some((b) => b.batteryId === result.batteryId);
      if (exists) {
        return prev.map((b) => (b.batteryId === result.batteryId ? result : b));
      }
      return [result, ...prev];
    });
    // Navigate to the Analysis Results page as specified
    setActivePage('analysis-results');
    showToast(`Assessment completed for ${result.batteryId}`);
  };

  const handleSelectBattery = (record: AssessmentRecord) => {
    setSelectedBattery(record);
    setActivePage('analysis-results');
  };

  const handleOpenBatteryPassport = (record: AssessmentRecord) => {
    setSelectedBattery(record);
    setActivePage('passport');
  };

  const handleSaveToBatteries = (record: AssessmentRecord) => {
    setBatteries((prev) => {
      const exists = prev.some((b) => b.batteryId === record.batteryId);
      if (exists) {
        return prev.map((b) => (b.batteryId === record.batteryId ? record : b));
      }
      return [record, ...prev];
    });
    showToast(`Battery ${record.batteryId} saved to fleet inventory.`);
  };

  const handleDeleteBattery = (batteryId: string) => {
    setBatteries((prev) => prev.filter((b) => b.batteryId !== batteryId));
    setMarketplaceListings((prev) => prev.filter((l) => l.batteryId !== batteryId));
    if (selectedBattery?.batteryId === batteryId) {
      setSelectedBattery(batteries.find((b) => b.batteryId !== batteryId) || null);
    }
    showToast(`Battery ${batteryId} removed from inventory.`);
  };

  const handleListBatteryOnMarketplace = (battery: AssessmentRecord, status: ListingStatus = 'Available') => {
    const exists = marketplaceListings.some((l) => l.batteryId === battery.batteryId);
    if (!exists) {
      const newListing: MarketplaceListing = {
        id: `LIST-${Math.floor(100 + Math.random() * 900)}`,
        batteryId: battery.batteryId,
        batteryType: battery.batteryType,
        chemistry: battery.chemistry,
        soh: battery.soh,
        currentCapacity: battery.currentCapacity,
        originalCapacity: battery.originalCapacity,
        nominalVoltage: battery.nominalVoltage,
        recommendedApplication: battery.recommendation,
        estimatedValueInr: battery.estimatedValueInr,
        status: status,
        location: 'Bengaluru Hub',
        vendor: 'Innovator Circular Fleet',
        verified: true,
        warrantyMonths: 12,
        listedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        description: battery.pathwayDetail || `Certified ${battery.chemistry} pack with ${battery.soh}% SOH.`,
      };
      setMarketplaceListings((prev) => [newListing, ...prev]);
    }
    setBatteries((prev) =>
      prev.map((b) => (b.batteryId === battery.batteryId ? { ...b, status: 'Listed' } : b))
    );
    setActivePage('marketplace');
    showToast(`Battery ${battery.batteryId} listed on Marketplace.`);
  };

  const handleOpenPassportFromMarketplace = (batteryId: string) => {
    const match = batteries.find((b) => b.batteryId === batteryId);
    if (match) {
      setSelectedBattery(match);
    } else {
      const demo = INITIAL_DEMO_BATTERIES.find((b) => b.batteryId === batteryId);
      if (demo) {
        setSelectedBattery(demo);
      }
    }
    setActivePage('passport');
  };

  const handleSubmitQuoteRequest = (quoteData: Omit<QuoteRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newQuote: QuoteRequest = {
      ...quoteData,
      id: `QR-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
    };
    setQuoteRequests((prev) => [newQuote, ...prev]);
    showToast('Quote request sent successfully.');
  };

  const handleDeleteQuote = (quoteId: string) => {
    setQuoteRequests((prev) => prev.filter((q) => q.id !== quoteId));
    showToast('Quote request withdrawn.');
  };

  const handleAddMarketplaceListing = (listing: MarketplaceListing) => {
    setMarketplaceListings((prev) => [listing, ...prev]);
    setBatteries((prev) =>
      prev.map((b) => (b.batteryId === listing.batteryId ? { ...b, status: 'Listed' } : b))
    );
    showToast('Listing created on Marketplace.');
  };

  // Demo Mode Flow Handlers
  const handleStartDemo = (batteryId: DemoBatteryId = demoBatteryId) => {
    setDemoBatteryId(batteryId);
    setIsDemoAnalyzing(true);
  };

  const handleDemoAnalysisComplete = () => {
    setIsDemoAnalyzing(false);
    const match = batteries.find((b) => b.batteryId === demoBatteryId) ||
                  INITIAL_DEMO_BATTERIES.find((b) => b.batteryId === demoBatteryId) ||
                  INITIAL_DEMO_BATTERIES[0];
    setSelectedBattery(match);
    setActivePage('analysis-results');
    showToast(`Assessment completed for ${demoBatteryId}`);
  };

  const handleResetDemo = () => {
    try {
      localStorage.removeItem('relife_batteries_exhibition_v2');
      localStorage.removeItem('relife_batteries');
      localStorage.removeItem('relife_selected_battery');
      localStorage.removeItem('relife_marketplace_listings');
      localStorage.removeItem('relife_quote_requests');
    } catch {}
    setBatteries(INITIAL_DEMO_BATTERIES);
    setMarketplaceListings(INITIAL_MARKETPLACE_LISTINGS);
    setQuoteRequests(INITIAL_QUOTE_REQUESTS);
    setDemoBatteryId('RL-EV-001');
    setSelectedBattery(INITIAL_DEMO_BATTERIES[0]);
    setActivePage('dashboard');
    showToast('Demo environment reset successfully to initial baseline.');
  };

  // If in Authenticated App Shell Mode
  if (viewMode === 'app') {
    return (
      <div className="flex flex-col min-h-screen bg-[#070D1D]">
        {/* Persistent Demo Mode Control Bar across all pages */}
        <DemoModeControl
          selectedBatteryId={demoBatteryId}
          onSelectBattery={(id) => {
            setDemoBatteryId(id);
            const match = batteries.find((b) => b.batteryId === id) || INITIAL_DEMO_BATTERIES.find((b) => b.batteryId === id);
            if (match) setSelectedBattery(match);
          }}
          onStartDemo={handleStartDemo}
          onResetDemo={handleResetDemo}
          activePage={activePage}
          onNavigate={setActivePage}
          isDemoActive={true}
        />

        {/* Demo Analysis Animation Overlay */}
        {isDemoAnalyzing && (
          <AnalysisLoadingScreen
            batteryId={demoBatteryId}
            onComplete={handleDemoAnalysisComplete}
          />
        )}

        {/* Unified Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0C152B] border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <AppShell
          activePage={activePage}
          onNavigate={setActivePage}
          onExitToLanding={() => setViewMode('landing')}
        >
        {activePage === 'dashboard' && (
          <DashboardView
            onNavigate={setActivePage}
            onSelectBattery={handleSelectBattery}
            batteries={batteries}
            marketplaceCount={marketplaceListings.length}
            onLaunchExhibitionDemo={() => setIsExhibitionModalOpen(true)}
            onSaveBattery={handleSaveToBatteries}
          />
        )}

        {activePage === 'add-battery' && (
          <AddBatteryView
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {activePage === 'analysis-results' && (
          <AnalysisResultsView
            assessment={selectedBattery}
            onNavigate={setActivePage}
            onSaveToBatteries={handleSaveToBatteries}
            onListOnMarketplace={handleListBatteryOnMarketplace}
            isSaved={Boolean(selectedBattery && batteries.some((b) => b.batteryId === selectedBattery.batteryId))}
            isListed={Boolean(selectedBattery && marketplaceListings.some((l) => l.batteryId === selectedBattery.batteryId))}
          />
        )}

        {activePage === 'my-batteries' && (
          <MyBatteriesView
            batteries={batteries}
            onNavigate={setActivePage}
            onSelectBattery={handleSelectBattery}
            onOpenPassport={handleOpenBatteryPassport}
            onListOnMarketplace={handleListBatteryOnMarketplace}
            onDeleteBattery={handleDeleteBattery}
          />
        )}

        {activePage === 'marketplace' && (
          <MarketplaceView
            onNavigate={setActivePage}
            listings={marketplaceListings}
            quoteRequests={quoteRequests}
            onOpenPassport={handleOpenPassportFromMarketplace}
            onSubmitQuote={handleSubmitQuoteRequest}
            onAddListing={handleAddMarketplaceListing}
            userBatteries={batteries}
            onDeleteQuote={handleDeleteQuote}
          />
        )}

        {activePage === 'passport' && (
          <BatteryPassportView
            onNavigate={setActivePage}
            selectedBattery={selectedBattery}
            onSelectBattery={(b) => setSelectedBattery(b)}
            batteries={batteries}
          />
        )}

        {activePage === 'assistant' && (
          <AIAssistantView
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'settings' && (
          <SettingsView
            onNavigate={setActivePage}
          />
        )}
      </AppShell>

      {/* College Exhibition Guided Walkthrough Modal */}
      {isExhibitionModalOpen && (
        <ExhibitionDemoModal
          isOpen={isExhibitionModalOpen}
          onClose={() => setIsExhibitionModalOpen(false)}
          onNavigate={(page) => {
            setIsExhibitionModalOpen(false);
            setActivePage(page);
          }}
          onSelectBattery={(b) => setSelectedBattery(b)}
          batteries={batteries}
        />
      )}
      </div>
    );
  }

  // Otherwise: Stage 1 Landing Page Mode (Preserved intact)
  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
      
      {/* Floating Switcher to return to Dashboard */}
      <div className="bg-[#081023] border-b border-emerald-500/30 py-2 px-4 text-center sticky top-0 z-50 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 hidden sm:inline">Previewing Public Landing Page.</span>
          <span className="text-emerald-400 font-semibold">Stage 2 Authenticated App Shell is Live.</span>
        </div>
        <button
          onClick={() => {
            setViewMode('app');
            setActivePage('dashboard');
          }}
          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          id="landing-banner-launch-app-btn"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Launch Dashboard <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Top Navigation */}
      <Navbar 
        onOpenModal={handleOpenModal} 
        activeSection={activeSection} 
      />

      {/* Main Landing Page Content */}
      <main className="flex-grow">
        {/* HERO with Visual Lifecycle */}
        <HeroSection onOpenModal={handleOpenModal} />

        {/* FEATURES (Product) */}
        <FeaturesSection onOpenModal={handleOpenModal} />

        {/* HOW IT WORKS (01 Assess, 02 Analyze, 03 Match, 04 Reuse) */}
        <HowItWorksSection onOpenModal={handleOpenModal} />

        {/* IMPACT SECTION (Demo Metrics & Carbon Avoidance) */}
        <ImpactSection onOpenModal={handleOpenModal} />

        {/* MARKETPLACE SECTION (Verified Second-Life Directory) */}
        <MarketplaceSection onOpenModal={handleOpenModal} />
      </main>

      {/* FOOTER */}
      <Footer onOpenModal={handleOpenModal} />

      {/* Interactive Modals System */}
      <InteractiveModals
        activeModal={activeModal}
        onClose={handleCloseModal}
        onOpenModal={handleOpenModal}
      />
    </div>
  );
}

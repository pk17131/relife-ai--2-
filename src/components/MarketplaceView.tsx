import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Tag, 
  Building2, 
  MapPin, 
  RotateCcw, 
  QrCode, 
  Send, 
  Layers, 
  DollarSign, 
  Battery, 
  FileCheck2, 
  Clock, 
  ChevronDown, 
  Plus, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Users,
  Trash2
} from 'lucide-react';
import { AppPage, AssessmentRecord, ChemistryType, BatteryType, ListingStatus, MarketplaceListing, QuoteRequest } from '../types';
import { RequestQuoteModal } from './RequestQuoteModal';

interface MarketplaceViewProps {
  onNavigate: (page: AppPage) => void;
  listings: MarketplaceListing[];
  quoteRequests: QuoteRequest[];
  onOpenPassport: (batteryId: string) => void;
  onSubmitQuote: (quote: Omit<QuoteRequest, 'id' | 'submittedAt' | 'status'>) => void;
  onAddListing: (listing: MarketplaceListing) => void;
  userBatteries: AssessmentRecord[];
  onDeleteQuote?: (quoteId: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onNavigate,
  listings,
  quoteRequests,
  onOpenPassport,
  onSubmitQuote,
  onAddListing,
  userBatteries,
  onDeleteQuote,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedChemistry, setSelectedChemistry] = useState<string>('ALL');
  const [selectedHealthRange, setSelectedHealthRange] = useState<string>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('ALL');

  // Modals & Drawers
  const [quoteModalListing, setQuoteModalListing] = useState<MarketplaceListing | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isQuotesDrawerOpen, setIsQuotesDrawerOpen] = useState(false);

  // List Battery Form state
  const [selectedBatteryIdToList, setSelectedBatteryIdToList] = useState<string>(
    userBatteries[0]?.batteryId || ''
  );
  const [listingLocation, setListingLocation] = useState('Bengaluru Hub');
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [listingVendor, setListingVendor] = useState('My Circular Fleet');
  const [listingSuccessToast, setListingSuccessToast] = useState<string | null>(null);

  // Filter application options based on available listings
  const availableApplications = useMemo(() => {
    const apps = new Set<string>();
    listings.forEach(item => {
      if (item.recommendedApplication) apps.add(item.recommendedApplication);
    });
    return Array.from(apps);
  }, [listings]);

  // Locations list
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    listings.forEach(item => {
      if (item.location) locs.add(item.location);
    });
    return Array.from(locs);
  }, [listings]);

  // Filter Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          item.batteryId.toLowerCase().includes(q) ||
          item.chemistry.toLowerCase().includes(q) ||
          item.recommendedApplication.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.vendor.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Battery Type
      if (selectedType !== 'ALL' && item.batteryType !== selectedType) {
        return false;
      }

      // 3. Chemistry
      if (selectedChemistry !== 'ALL' && item.chemistry !== selectedChemistry) {
        return false;
      }

      // 4. Health Range
      if (selectedHealthRange !== 'ALL') {
        if (selectedHealthRange === 'HIGH' && item.soh < 70) return false;
        if (selectedHealthRange === 'MEDIUM' && (item.soh < 50 || item.soh >= 70)) return false;
        if (selectedHealthRange === 'LOW' && item.soh >= 50) return false;
      }

      // 5. Recommended Application
      if (selectedApplication !== 'ALL' && item.recommendedApplication !== selectedApplication) {
        return false;
      }

      // 6. Location
      if (selectedLocation !== 'ALL' && item.location !== selectedLocation) {
        return false;
      }

      // 7. Price Range
      if (selectedPriceRange !== 'ALL') {
        if (selectedPriceRange === 'UNDER_10K' && item.estimatedValueInr >= 10000) return false;
        if (selectedPriceRange === '10K_25K' && (item.estimatedValueInr < 10000 || item.estimatedValueInr > 25000)) return false;
        if (selectedPriceRange === '25K_100K' && (item.estimatedValueInr <= 25000 || item.estimatedValueInr > 100000)) return false;
        if (selectedPriceRange === 'ABOVE_100K' && item.estimatedValueInr <= 100000) return false;
      }

      // 8. Availability / Status
      if (selectedAvailability !== 'ALL' && item.status !== selectedAvailability) {
        return false;
      }

      return true;
    });
  }, [
    listings,
    searchQuery,
    selectedType,
    selectedChemistry,
    selectedHealthRange,
    selectedApplication,
    selectedLocation,
    selectedPriceRange,
    selectedAvailability
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedChemistry('ALL');
    setSelectedHealthRange('ALL');
    setSelectedApplication('ALL');
    setSelectedLocation('ALL');
    setSelectedPriceRange('ALL');
    setSelectedAvailability('ALL');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedType !== 'ALL' || 
    selectedChemistry !== 'ALL' || 
    selectedHealthRange !== 'ALL' || 
    selectedApplication !== 'ALL' || 
    selectedLocation !== 'ALL' || 
    selectedPriceRange !== 'ALL' || 
    selectedAvailability !== 'ALL';

  // KPI Calculations
  const availableCount = listings.filter(l => l.status === 'Available').length;
  const totalListings = listings.length;
  const totalCircularValue = listings.reduce((sum, l) => sum + (l.estimatedValueInr || 0), 0);
  const totalQuotesCount = quoteRequests.length;

  // Handle List Battery Submission
  const handleConfirmListBattery = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBattery = userBatteries.find(b => b.batteryId === selectedBatteryIdToList);
    if (!targetBattery) return;

    const price = customPrice !== '' ? Number(customPrice) : targetBattery.estimatedValueInr;

    const newListing: MarketplaceListing = {
      id: `LIST-${Math.floor(100 + Math.random() * 900)}`,
      batteryId: targetBattery.batteryId,
      batteryType: targetBattery.batteryType,
      chemistry: targetBattery.chemistry,
      soh: targetBattery.soh,
      currentCapacity: targetBattery.currentCapacity,
      originalCapacity: targetBattery.originalCapacity,
      nominalVoltage: targetBattery.nominalVoltage,
      recommendedApplication: targetBattery.recommendation,
      estimatedValueInr: price,
      status: 'Available',
      location: listingLocation,
      vendor: listingVendor || 'Private Circular Partner',
      verified: true,
      warrantyMonths: 12,
      listedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: targetBattery.pathwayDetail || `Certified ${targetBattery.chemistry} pack with ${targetBattery.soh}% SOH.`,
    };

    onAddListing(newListing);
    setIsListModalOpen(false);
    setListingSuccessToast(`Successfully listed ${targetBattery.batteryId} on the marketplace!`);
    setTimeout(() => setListingSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {listingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{listingSuccessToast}</span>
        </div>
      )}

      {/* 1. POSITIONING & HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          {/* Tagline */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              VERIFIED SECOND-LIFE EXCHANGE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-slate-400">
              Circularity Protocol
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Second-Life Battery Marketplace
          </h1>

          {/* User Requested Positioning Quote */}
          <p className="text-base text-emerald-300/90 font-medium mt-1 italic font-serif">
            &ldquo;Find the right second life for every battery.&rdquo;
          </p>

          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Connecting battery owners, second-life buyers, refurbishers, and certified recyclers with transparent SOH telemetry and digital passports.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsQuotesDrawerOpen(true)}
            id="view-quotes-btn"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>Quote Requests</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold">
              {totalQuotesCount}
            </span>
          </button>

          <button
            onClick={() => setIsListModalOpen(true)}
            id="list-battery-modal-btn"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>List on Marketplace</span>
          </button>
        </div>
      </div>

      {/* 2. MARKETPLACE DASHBOARD (KPI SUMMARY CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="marketplace-kpi-dashboard">
        
        {/* KPI 1: Available Batteries */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0C1427] border border-slate-800 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Available Batteries</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight" id="kpi-available-count">
            {availableCount}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Ready for instant B2B dispatch
          </span>
        </div>

        {/* KPI 2: Second-Life Listings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0C1427] border border-slate-800 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Second-Life Listings</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight" id="kpi-total-listings">
            {totalListings}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Active catalog items
          </span>
        </div>

        {/* KPI 3: Estimated Circular Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0C1427] border border-slate-800 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Estimated Circular Value</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight" id="kpi-circular-value">
            ₹{(totalCircularValue / 100000).toFixed(2)}L
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Direct asset residual capital
          </span>
        </div>

        {/* KPI 4: Quote Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0C1427] border border-slate-800 flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Quote Requests</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight" id="kpi-quotes-count">
            {totalQuotesCount}
          </div>
          <span className="text-[11px] text-teal-400 font-mono">
            In negotiation & review
          </span>
        </div>

      </div>

      {/* 3. SEARCH & ADVANCED MULTI-DIMENSIONAL FILTERS */}
      <div className="p-5 rounded-2xl bg-[#0C1427] border border-slate-800 space-y-4" id="marketplace-filters-panel">
        
        {/* Search Bar Row */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search battery ID, chemistry, application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              id="marketplace-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              id="reset-filters-btn"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs">
          
          {/* Filter 1: Battery Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Battery Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="filter-type-select"
            >
              <option value="ALL">All Types</option>
              <option value="EV">EV</option>
              <option value="UPS">UPS</option>
              <option value="Solar">Solar</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Filter 2: Chemistry */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Chemistry</label>
            <select
              value={selectedChemistry}
              onChange={(e) => setSelectedChemistry(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="filter-chemistry-select"
            >
              <option value="ALL">All Chemistries</option>
              <option value="LFP">LFP</option>
              <option value="NMC">NMC</option>
              <option value="Lead Acid">Lead Acid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Filter 3: Health Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Health Range</label>
            <select
              value={selectedHealthRange}
              onChange={(e) => setSelectedHealthRange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="filter-health-select"
            >
              <option value="ALL">All Health</option>
              <option value="HIGH">High (&gt;70% SOH)</option>
              <option value="MEDIUM">Medium (50% - 70%)</option>
              <option value="LOW">Low (&lt;50% SOH)</option>
            </select>
          </div>

          {/* Filter 4: Recommended Application */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Application</label>
            <select
              value={selectedApplication}
              onChange={(e) => setSelectedApplication(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 truncate"
              id="filter-application-select"
            >
              <option value="ALL">All Applications</option>
              {availableApplications.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
          </div>

          {/* Filter 5: Location */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="filter-location-select"
            >
              <option value="ALL">All Hubs</option>
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Filter 6: Price Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Price Range</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="filter-price-select"
            >
              <option value="ALL">All Prices</option>
              <option value="UNDER_10K">&lt; ₹10,000</option>
              <option value="10K_25K">₹10K - ₹25K</option>
              <option value="25K_100K">₹25K - ₹100K</option>
              <option value="ABOVE_100K">&gt; ₹100K</option>
            </select>
          </div>

          {/* Filter 7: Availability / Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Availability</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="filter-status-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Assessment Required">Assessment Required</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

        </div>

        {/* Active Filters readout */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredListings.length}</strong> of {listings.length} verified listings
          </span>
          {hasActiveFilters && (
            <span className="text-emerald-400 font-mono text-[11px]">
              Filters active
            </span>
          )}
        </div>

      </div>

      {/* 4. MARKETPLACE CARDS GRID */}
      {filteredListings.length === 0 ? (
        /* PROFESSIONAL EMPTY STATE */
        <div className="p-12 rounded-2xl bg-[#0C1427] border border-slate-800 text-center space-y-4" id="marketplace-empty-state">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No listings match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your chemistry, application, health range, or location filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="marketplace-cards-grid">
          {filteredListings.map((item) => {
            const isAvailable = item.status === 'Available';
            const isAssessmentReq = item.status === 'Assessment Required';
            const isReserved = item.status === 'Reserved';
            const isSold = item.status === 'Sold';

            return (
              <div 
                key={item.id}
                className="bg-[#0C1427] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between space-y-5 relative shadow-lg group"
                id={`listing-card-${item.id.toLowerCase()}`}
              >
                <div>
                  
                  {/* Top Header: ID & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xs font-bold text-white">{item.batteryId}</span>
                      <span className="text-[11px] text-slate-500">#{item.id}</span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      isAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isReserved
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : isAssessmentReq
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`} id={`status-badge-${item.id.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Chemistry & Spec Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                      {item.batteryType} • {item.chemistry}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
                      {item.soh}% SOH
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-teal-300">
                      {item.nominalVoltage}V • {item.currentCapacity}Ah
                    </span>
                  </div>

                  {/* Recommended Application Highlight */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Recommended Application
                    </span>
                    <div className="text-xs font-bold text-white leading-snug">
                      {item.recommendedApplication}
                    </div>
                  </div>

                  {/* Description / Summary */}
                  {item.description && (
                    <p className="text-[11px] text-slate-400 mt-3 line-clamp-2 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  )}

                  {/* Vendor & Location */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[140px]" title={item.vendor}>
                      {item.vendor}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[110px]">{item.location}</span>
                    </span>
                  </div>

                </div>

                {/* Card Footer: Price & Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
                  
                  {/* Price display */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Value:</span>
                    <span className="text-lg font-black font-mono text-amber-400">
                      ₹{item.estimatedValueInr.toLocaleString()}
                    </span>
                  </div>

                  {/* Required Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Button 1: View Digital Passport */}
                    <button
                      onClick={() => onOpenPassport(item.batteryId)}
                      id={`view-passport-btn-${item.id.toLowerCase()}`}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      title={`View Digital Passport for ${item.batteryId}`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Passport</span>
                    </button>

                    {/* Button 2: Request Quote (Available Listings) */}
                    {isAvailable ? (
                      <button
                        onClick={() => setQuoteModalListing(item)}
                        id={`request-quote-btn-${item.id.toLowerCase()}`}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Request Quote</span>
                      </button>
                    ) : isAssessmentReq ? (
                      <button
                        disabled
                        className="px-3 py-2 rounded-xl bg-slate-800/80 text-orange-400/80 border border-orange-500/20 text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed opacity-80"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Needs Assessment</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-3 py-2 rounded-xl bg-slate-800/60 text-slate-500 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
                      >
                        <span>{item.status}</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. REQUEST QUOTE MODAL */}
      {quoteModalListing && (
        <RequestQuoteModal
          listing={quoteModalListing}
          isOpen={Boolean(quoteModalListing)}
          onClose={() => setQuoteModalListing(null)}
          onSubmitQuote={onSubmitQuote}
        />
      )}

      {/* 6. LIST BATTERY MODAL (FLEET INTEGRATION) */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#0C1427] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">List Battery on Marketplace</h3>
              </div>
              <button 
                onClick={() => setIsListModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmListBattery} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Select Assessed Battery from Fleet</label>
                <select
                  value={selectedBatteryIdToList}
                  onChange={(e) => setSelectedBatteryIdToList(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  id="select-battery-to-list"
                >
                  {userBatteries.map((b) => (
                    <option key={b.batteryId} value={b.batteryId}>
                      {b.batteryId} — {b.batteryType} ({b.chemistry}, {b.soh}% SOH) — Est. ₹{b.estimatedValueInr.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview target battery details */}
              {(() => {
                const target = userBatteries.find(b => b.batteryId === selectedBatteryIdToList);
                if (!target) return null;
                return (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ReLife Health (SOH):</span>
                      <span className="text-emerald-400 font-bold">{target.soh}% ({target.grade})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capacity & Voltage:</span>
                      <span className="text-white">{target.currentCapacity}Ah @ {target.nominalVoltage}V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recommended Life:</span>
                      <span className="text-teal-300 truncate max-w-[200px]">{target.recommendation}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Warehouse / Logistics Hub</label>
                  <select
                    value={listingLocation}
                    onChange={(e) => setListingLocation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Bengaluru Hub">Bengaluru Hub</option>
                    <option value="Pune Facility">Pune Facility</option>
                    <option value="Delhi NCR Hub">Delhi NCR Hub</option>
                    <option value="Hyderabad CleanTech Hub">Hyderabad CleanTech Hub</option>
                    <option value="Chennai Tech Park">Chennai Tech Park</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Asking Price (₹ INR)</label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Leave empty for AI estimate"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Vendor / Organization Title</label>
                <input
                  type="text"
                  value={listingVendor}
                  onChange={(e) => setListingVendor(e.target.value)}
                  placeholder="e.g. CleanFleet Enterprises"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                  id="confirm-list-battery-btn"
                >
                  Confirm & List on Marketplace
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 7. QUOTE REQUESTS DRAWER / MODAL */}
      {isQuotesDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#0C1427] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Active Quote Requests ({quoteRequests.length})</h3>
              </div>
              <button 
                onClick={() => setIsQuotesDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="p-6 overflow-y-auto space-y-3.5 flex-1 text-xs">
              {quoteRequests.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No quote requests submitted yet.</p>
                </div>
              ) : (
                quoteRequests.map((quote) => (
                  <div 
                    key={quote.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-sm">{quote.batteryId}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          {quote.status}
                        </span>
                        {onDeleteQuote && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Withdraw quote request for ${quote.batteryId}?`)) {
                                onDeleteQuote(quote.id);
                              }
                            }}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Withdraw Quote Request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                      <div><strong>Buyer:</strong> {quote.fullName}</div>
                      <div><strong>Company:</strong> {quote.company}</div>
                      <div><strong>Email:</strong> {quote.email}</div>
                      <div><strong>Submitted:</strong> {quote.submittedAt}</div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Intended Application:</strong> {quote.intendedApplication}
                    </div>

                    {quote.message && (
                      <p className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300 font-sans italic text-[11px]">
                        &ldquo;{quote.message}&rdquo;
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-right shrink-0">
              <button
                onClick={() => setIsQuotesDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

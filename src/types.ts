export type BatteryType = 'EV' | 'UPS' | 'Laptop' | 'Solar' | 'Other';
export type ChemistryType = 'LFP' | 'NMC' | 'Lead Acid' | 'Other';
export type ApplicationType = 
  | 'Electric Vehicle' 
  | 'Home Backup' 
  | 'UPS' 
  | 'Solar Storage' 
  | 'Laptop' 
  | 'Other';

export interface BatteryFormData {
  batteryId: string;
  batteryType: BatteryType;
  chemistry: ChemistryType;
  originalCapacity: number | '';
  currentCapacity: number | '';
  nominalVoltage: number | '';
  cycleCount: number | '';
  temperature: number | '';
  manufacturingYear: number | '';
  currentApplication: ApplicationType;
}

export type FeasibilityLevel = 'Low' | 'Medium' | 'High';

export interface LifecycleOptions {
  reuse: FeasibilityLevel;
  refurbish: FeasibilityLevel;
  repurpose: FeasibilityLevel;
  recycle: FeasibilityLevel;
  recommended: 'Reuse' | 'Refurbish' | 'Repurpose' | 'Recycle';
}

export type LifecycleOutcome = 'Reuse' | 'Refurbish' | 'Repurpose' | 'Recycle';

export interface AIAnalysisResult {
  healthClassification: string;
  reLifeScore: number;
  lifecycleRecommendation: LifecycleOutcome | string;
  secondLifeRecommendation: string;
  reasoning: string;
  alternativeApplications: string[];
  riskFlags: string[];
  confidence: number;
  engineUsed?: 'gemini-3.8-flash' | 'demo-intelligence';
  disclaimer: string;
}

export interface AssessmentRecord {
  id: string;
  batteryId: string;
  batteryType: BatteryType;
  chemistry: ChemistryType;
  originalCapacity: number;
  currentCapacity: number;
  nominalVoltage: number;
  cycleCount: number;
  temperature: number;
  manufacturingYear: number;
  currentApplication: ApplicationType;
  soh: number; // in percentage e.g. 72.5
  relifeScore: number; // 0 - 100
  grade: 'Grade A+' | 'Grade A' | 'Grade B+' | 'Grade B' | 'Recycle Grade';
  classification: string; // e.g. "Second-Life Ready"
  recommendation: string;
  pathwayDetail: string;
  alternativeApplications: string[];
  whyRecommendation: string;
  lifecycleOptions: LifecycleOptions;
  usableEnergyWh: number; // e.g. 1392 Wh
  estimatedRemainingCycles: number;
  estimatedExtendedYears: string;
  estimatedValueInr: number;
  estimatedValue?: string;
  wasteDivertedKg: number;
  carbonOffsetKg?: number;
  safetyNotice: string;
  riskFlags?: string[];
  confidence?: number;
  aiAnalysis?: AIAnalysisResult;
  status: 'Assessed' | 'Listed' | 'Repurposed' | 'Recycling';
  assessedAt: string;
  passportId: string;
}

export type ListingStatus = 'Available' | 'Reserved' | 'Sold' | 'Assessment Required';

export interface MarketplaceListing {
  id: string;
  batteryId: string;
  batteryType: BatteryType;
  chemistry: ChemistryType;
  soh: number;
  currentCapacity: number;
  originalCapacity?: number;
  nominalVoltage: number;
  recommendedApplication: string;
  estimatedValueInr: number;
  status: ListingStatus;
  location: string;
  vendor: string;
  verified: boolean;
  warrantyMonths?: number;
  listedAt: string;
  description?: string;
}

export interface QuoteRequest {
  id: string;
  listingId: string;
  batteryId: string;
  fullName: string;
  company: string;
  email: string;
  intendedApplication: string;
  message?: string;
  submittedAt: string;
  status: 'Pending' | 'Accepted' | 'Under Review';
}

export type AppPage = 
  | 'dashboard'
  | 'add-battery'
  | 'analysis-results'
  | 'my-batteries'
  | 'marketplace'
  | 'passport'
  | 'assistant'
  | 'settings';

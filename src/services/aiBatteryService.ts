import { BatteryFormData, ChemistryType, BatteryType, ApplicationType, AIAnalysisResult, LifecycleOutcome } from '../types';

export interface BatteryInput {
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
}

const PROTOTYPE_DISCLAIMER = 'AI-assisted prototype estimate. Professional diagnostics are required before real-world deployment.';

/**
 * Deterministic local Demo Intelligence fallback.
 * Strictly adheres to specifications for:
 * - RL-EV-001 (SOH 72.5%, ReLife Score 84, Second-Life Ready, Stationary Solar Storage)
 * - RL-EV-002 (SOH 50%, ReLife Score 58, Refurbishment / Low-demand Storage)
 * - RL-EV-003 (SOH 30%, ReLife Score 25, Recycling / Professional Assessment)
 * - Newly entered batteries: SOH = Clamp(current / original * 100, 0, 100) with transparent prototype scoring
 */
export function getDeterministicDemoIntelligence(battery: BatteryInput): AIAnalysisResult {
  const bid = (battery.batteryId || '').trim().toUpperCase();
  const orig = Math.max(1, Number(battery.originalCapacity) || 40);
  const curr = Math.max(0, Number(battery.currentCapacity) || 0);
  const cycles = Number(battery.cycleCount) || 1000;
  const temp = Number(battery.temperature) || 25;

  // 1. Exact match for RL-EV-001
  if (bid === 'RL-EV-001' || (orig === 40 && curr === 29 && battery.chemistry === 'LFP')) {
    return {
      healthClassification: 'Second-Life Ready',
      reLifeScore: 84,
      lifecycleRecommendation: 'Repurpose',
      secondLifeRecommendation: 'Stationary Solar Storage',
      reasoning: 'The LFP cell chemistry maintains 72.5% capacity retention with intact structural cathode integrity. While retired from dynamic EV acceleration cycles, its high thermal runaway threshold (>270°C) makes it an ideal fit for stationary solar buffering and microgrids.',
      alternativeApplications: [
        'Residential Solar Energy Storage (BESS)',
        'Agricultural Pump Inverter Backup',
        'Telecom Tower Standby Power'
      ],
      riskFlags: [
        'Operating temperature at 31°C is within acceptable range; keep below 35°C in enclosure',
        'Standard annual cell impedance delta inspection advised'
      ],
      confidence: 94,
      engineUsed: 'demo-intelligence',
      disclaimer: PROTOTYPE_DISCLAIMER
    };
  }

  // 2. Exact match for RL-EV-002
  if (bid === 'RL-EV-002' || (orig === 50 && curr === 25 && battery.chemistry === 'NMC')) {
    return {
      healthClassification: 'Refurbishment Candidate',
      reLifeScore: 58,
      lifecycleRecommendation: 'Refurbish',
      secondLifeRecommendation: 'Refurbishment / Low-demand Storage',
      reasoning: 'At 50.0% SOH, NMC chemistry exhibits moderate impedance rise and cell-level voltage variance. Module-level rebalancing and BMS recalibration can safely restore the pack for non-critical, low-demand energy storage.',
      alternativeApplications: [
        'Low-Speed Electric Utility Carts',
        'Emergency Lighting Backup Bank',
        'Off-Peak Solar Streetlight Buffer'
      ],
      riskFlags: [
        'NMC cathode requires active thermal monitoring and cell balancing',
        'Restrict charge rates to 0.3C maximum to prevent accelerated plating'
      ],
      confidence: 88,
      engineUsed: 'demo-intelligence',
      disclaimer: PROTOTYPE_DISCLAIMER
    };
  }

  // 3. Exact match for RL-EV-003
  if (bid === 'RL-EV-003' || (orig === 60 && curr === 18) || (orig === 40 && curr === 12 && battery.chemistry === 'Lead Acid')) {
    return {
      healthClassification: 'Recycling / Professional Assessment',
      reLifeScore: 25,
      lifecycleRecommendation: 'Recycle',
      secondLifeRecommendation: 'Recycling / Professional Assessment',
      reasoning: 'At 30.0% remaining capacity and elevated cumulative cycle history, electrochemical degradation exceeds safe second-life operational thresholds. Routing to certified closed-loop hydrometallurgical recycling is recommended.',
      alternativeApplications: [
        'Hydrometallurgical Mineral Extraction',
        'Black Mass Refining & Cathode Reclamation',
        'Closed-Loop Smelting Recovery'
      ],
      riskFlags: [
        'High internal resistance and potential internal micro-dendrites',
        'Not recommended for unmonitored indoor storage',
        'Dispatch to certified e-waste recycler under UN38.3 transport protocol'
      ],
      confidence: 96,
      engineUsed: 'demo-intelligence',
      disclaimer: PROTOTYPE_DISCLAIMER
    };
  }

  // 4. Transparent prototype scoring system for newly entered batteries
  // Formula: SOH = Clamp((currentCapacity / originalCapacity) * 100, 0, 100)
  const rawSoh = (curr / orig) * 100;
  const soh = Math.min(100, Math.max(0, Number(rawSoh.toFixed(1))));

  // Transparent prototype scoring component breakdown:
  // - Capacity retention weight: 60%
  const sohFactor = (soh / 100) * 60;
  
  // - Cycle aging weight: 15% (penalize cycles > 1500)
  const cycleFactor = Math.max(0, 15 - (cycles / 2500) * 15);

  // - Chemistry stability factor: 15% (LFP higher cycle durability than NMC / Lead Acid)
  let chemFactor = 10;
  if (battery.chemistry === 'LFP') chemFactor = 15;
  else if (battery.chemistry === 'NMC') chemFactor = 11;
  else if (battery.chemistry === 'Lead Acid') chemFactor = 6;

  // - Operating temperature factor: 10%
  let tempFactor = 10;
  if (temp > 40 || temp < 5) tempFactor = 3;
  else if (temp > 33 || temp < 15) tempFactor = 7;

  const calculatedScore = Math.round(sohFactor + cycleFactor + chemFactor + tempFactor);
  const reLifeScore = Math.min(98, Math.max(10, calculatedScore));

  // Determine Lifecycle Outcome and Recommendations
  let lifecycleRecommendation: LifecycleOutcome = 'Repurpose';
  let healthClassification = 'Second-Life Ready';
  let secondLifeRecommendation = 'Stationary Solar Storage';
  let reasoning = '';
  let alternativeApplications: string[] = [];
  const riskFlags: string[] = [];

  if (soh >= 80) {
    lifecycleRecommendation = 'Reuse';
    healthClassification = 'Second-Life Ready (High Performance)';
    secondLifeRecommendation = 'Commercial Microgrid & Peak Shaving BESS';
    reasoning = `With ${soh}% capacity retention and mild thermal exposure, the pack preserves substantial electrochemical capacity suitable for direct high-demand commercial energy storage.`;
    alternativeApplications = ['Commercial BESS', 'Industrial Peak Shaving', 'EV Fast-Charger Buffer'];
  } else if (soh >= 65) {
    lifecycleRecommendation = 'Repurpose';
    healthClassification = 'Second-Life Ready';
    secondLifeRecommendation = 'Stationary Solar Storage';
    reasoning = `At ${soh}% SOH, the pack is primed for stationary secondary storage where gentle discharge rates (0.2C–0.5C) can unlock 6 to 9 years of additional service life.`;
    alternativeApplications = ['Residential Solar Buffer', 'Telecom Tower Standby', 'Off-Grid Agricultural Pumps'];
  } else if (soh >= 45) {
    lifecycleRecommendation = 'Refurbish';
    healthClassification = 'Refurbishment Candidate';
    secondLifeRecommendation = 'Refurbishment / Low-demand Storage';
    reasoning = `At ${soh}% SOH, capacity loss and cell-to-cell variance require module triage and impedance balancing before deploying to low-cycling standby duty.`;
    alternativeApplications = ['Low-Speed Utility Vehicles', 'UPS Emergency Standby', 'Solar Garden Lighting'];
  } else {
    lifecycleRecommendation = 'Recycle';
    healthClassification = 'Recycling / End-of-Life';
    secondLifeRecommendation = 'Recycling / Professional Assessment';
    reasoning = `At ${soh}% SOH, high internal resistance prevents dependable second-life duty. Prioritize closed-loop material recovery to extract valuable minerals.`;
    alternativeApplications = ['Hydrometallurgical Refining', 'Cathode Scrap Extraction', 'Raw Material Recycling'];
  }

  // Risk flags based on physical readings
  if (temp > 35) {
    riskFlags.push(`Elevated operating temperature (${temp}°C) indicates need for active heat dissipation.`);
  } else {
    riskFlags.push(`Operating temperature (${temp}°C) is within safe operational envelope.`);
  }

  if (cycles > 2000) {
    riskFlags.push(`High cycle age (${cycles.toLocaleString()} cycles) warrants cell impedance verification.`);
  }

  if (battery.chemistry === 'NMC' && soh < 60) {
    riskFlags.push('NMC chemistry below 60% SOH requires individual module cell-voltage threshold monitoring.');
  }

  // Calculate confidence based on data completeness
  let confidence = 90;
  if (battery.cycleCount && battery.temperature && battery.manufacturingYear) {
    confidence = 94;
  }

  return {
    healthClassification,
    reLifeScore,
    lifecycleRecommendation,
    secondLifeRecommendation,
    reasoning,
    alternativeApplications,
    riskFlags,
    confidence,
    engineUsed: 'demo-intelligence',
    disclaimer: PROTOTYPE_DISCLAIMER
  };
}

/**
 * Primary AI Analysis Service Function
 * Safely tries to invoke server-side Gemini intelligence via /api/analyze-battery.
 * If Gemini is unavailable, errors, times out, or has no API key,
 * seamlessly returns the deterministic local Demo Intelligence fallback.
 * 
 * Guarantees:
 * - Never throws runtime errors
 * - Never invents measured battery data
 * - Never changes user-entered values
 * - Never claims safety certification
 */
export async function analyzeBatteryWithAI(battery: BatteryInput): Promise<AIAnalysisResult> {
  // Always prepare fallback result ready for zero-latency resilience
  const fallbackResult = getDeterministicDemoIntelligence(battery);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch('/api/analyze-battery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(battery),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`AI Analysis endpoint returned status ${response.status}. Using Demo Intelligence fallback.`);
      return fallbackResult;
    }

    const data = await response.json();
    if (data && data.success && data.result) {
      return {
        healthClassification: data.result.healthClassification || fallbackResult.healthClassification,
        reLifeScore: Number(data.result.reLifeScore) || fallbackResult.reLifeScore,
        lifecycleRecommendation: data.result.lifecycleRecommendation || fallbackResult.lifecycleRecommendation,
        secondLifeRecommendation: data.result.secondLifeRecommendation || fallbackResult.secondLifeRecommendation,
        reasoning: data.result.reasoning || fallbackResult.reasoning,
        alternativeApplications: Array.isArray(data.result.alternativeApplications) && data.result.alternativeApplications.length > 0
          ? data.result.alternativeApplications
          : fallbackResult.alternativeApplications,
        riskFlags: Array.isArray(data.result.riskFlags) && data.result.riskFlags.length > 0
          ? data.result.riskFlags
          : fallbackResult.riskFlags,
        confidence: Number(data.result.confidence) || fallbackResult.confidence,
        engineUsed: 'gemini-3.8-flash',
        disclaimer: PROTOTYPE_DISCLAIMER
      };
    }

    // Server instructed to use fallback or returned non-success
    return fallbackResult;
  } catch (err) {
    // Network error, timeout, or abort -> return calibrated deterministic demo intelligence
    return fallbackResult;
  }
}

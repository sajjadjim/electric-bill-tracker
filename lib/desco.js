/**
 * DESCO Residential (LT-A) Tariff Rates & Utilities
 * Electricity in Bangladesh operates on a block-billing system.
 */

export const DEFAULT_STEP_RATES = {
  lifeline: 4.63,  // 0-50 units (only if total <= 50)
  step1: 4.85,     // 0-75 units (if total > 50)
  step2: 6.63,     // 76-200 units
  step3: 6.95,     // 201-300 units
  step4: 12.03     // Above 300 units
};

export const DEFAULT_FIXED = {
  demandCharge: 80, // Default 2kW connection (৳40/kW)
  meterRent: 40,    // Default single phase prepaid meter
  vatPercent: 5     // 5% VAT
};

/**
 * Calculates the total bill amount in Taka for a given number of units (kWh) consumed.
 */
export function calculateBill(units, demandCharge = DEFAULT_FIXED.demandCharge, meterRent = DEFAULT_FIXED.meterRent, vatPercent = DEFAULT_FIXED.vatPercent, stepRates = DEFAULT_STEP_RATES) {
  const u = Math.max(0, Number(units) || 0);
  let energyCharge = 0;

  if (u <= 50 && u > 0) {
    // Lifeline: 0-50 units
    energyCharge = u * stepRates.lifeline;
  } else {
    let remaining = u;

    // Step 1: Up to 75 units
    const u1 = Math.min(remaining, 75);
    energyCharge += u1 * stepRates.step1;
    remaining -= u1;

    // Step 2: 76-200 units (next 125 units)
    if (remaining > 0) {
      const u2 = Math.min(remaining, 125);
      energyCharge += u2 * stepRates.step2;
      remaining -= u2;
    }

    // Step 3: 201-300 units (next 100 units)
    if (remaining > 0) {
      const u3 = Math.min(remaining, 100);
      energyCharge += u3 * stepRates.step3;
      remaining -= u3;
    }

    // Step 4: Above 300 units
    if (remaining > 0) {
      energyCharge += remaining * stepRates.step4;
    }
  }

  const subtotal = energyCharge + demandCharge + meterRent;
  const vat = subtotal * (vatPercent / 100);
  return {
    energyCharge,
    subtotal,
    vat,
    total: subtotal + vat
  };
}

/**
 * Estimates the units (kWh) consumed from a paid bill amount in Taka (reverse calculation).
 */
export function calculateUnitsFromBill(billAmount, demandCharge = DEFAULT_FIXED.demandCharge, meterRent = DEFAULT_FIXED.meterRent, vatPercent = DEFAULT_FIXED.vatPercent, stepRates = DEFAULT_STEP_RATES) {
  const total = Number(billAmount) || 0;
  if (total <= 0) return 0;

  // Reverse VAT
  const subtotal = total / (1 + vatPercent / 100);
  const energyCharge = subtotal - demandCharge - meterRent;

  if (energyCharge <= 0) return 0;

  // Check if Lifeline is possible (max energy charge = 50 * 4.63 = 231.5)
  if (energyCharge <= 50 * stepRates.lifeline) {
    return energyCharge / stepRates.lifeline;
  }

  // Otherwise, calculate regular block billing steps
  let remainingCharge = energyCharge;
  let units = 0;

  // Step 1: Up to 75 units
  const maxCharge1 = 75 * stepRates.step1;
  if (remainingCharge <= maxCharge1) {
    return remainingCharge / stepRates.step1;
  }
  units += 75;
  remainingCharge -= maxCharge1;

  // Step 2: Next 125 units (up to 200 total)
  const maxCharge2 = 125 * stepRates.step2;
  if (remainingCharge <= maxCharge2) {
    return units + (remainingCharge / stepRates.step2);
  }
  units += 125;
  remainingCharge -= maxCharge2;

  // Step 3: Next 100 units (up to 300 total)
  const maxCharge3 = 100 * stepRates.step3;
  if (remainingCharge <= maxCharge3) {
    return units + (remainingCharge / stepRates.step3);
  }
  units += 100;
  remainingCharge -= maxCharge3;

  // Step 4: Above 300 units
  return units + (remainingCharge / stepRates.step4);
}

/**
 * Returns descriptive info of the slab tier based on unit usage.
 */
export function getSlabInfo(units) {
  const u = Number(units) || 0;
  if (u <= 0) return { label: "Zero Consumption", range: "0 units", color: "rgba(148, 163, 184, 0.45)" };
  if (u <= 50) return { label: "Life Line", range: "0–50 units", color: "#38bdf8" }; // Sky blue
  if (u <= 75) return { label: "First Step", range: "0–75 units", color: "#34d399" }; // Green
  if (u <= 200) return { label: "Second Step", range: "76–200 units", color: "#fbbf24" }; // Amber
  if (u <= 300) return { label: "Third Step", range: "201–300 units", color: "#f97316" }; // Orange
  return { label: "Higher Steps", range: "300+ units", color: "#f87171" }; // Red
}

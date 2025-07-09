/**
 * Unit Conversion Utility
 *
 * Provides functions for converting between different scientific units,
 * primarily for weight and volume, to allow for standardized stock calculations.
 */

// Base units for conversion to ensure consistency
const BASE_UNITS = {
  weight: 'g',
  volume: 'L'
};

// Conversion factors relative to the base unit
const CONVERSION_FACTORS = {
  // Weight (base: g)
  g: { factor: 1, type: 'weight', aliases: ['gramos', 'gramo'] },
  kg: { factor: 1000, type: 'weight', aliases: ['kilogramos', 'kilogramo'] },
  mg: { factor: 0.001, type: 'weight', aliases: ['miligramos', 'miligramo'] },
  ug: { factor: 0.000001, type: 'weight', aliases: ['microgramos', 'microgramo', 'µg'] },

  // Volume (base: L)
  L: { factor: 1, type: 'volume', aliases: ['litros', 'litro'] },
  mL: { factor: 0.001, type: 'volume', aliases: ['mililitros', 'mililitro'] },

  // Amount of substance (base: mol)
  mol: { factor: 1, type: 'amount', aliases: ['moles', 'mol'] },
  mmol: { factor: 0.001, type: 'amount', aliases: ['milimoles', 'milimol'] },
};

/**
 * Normalizes a unit by checking its name and aliases.
 * @param {string} unit - The unit to normalize (e.g., 'gramos').
 * @returns {string|null} The normalized unit key (e.g., 'g') or null if not found.
 */
function getNormalizedUnit(unit) {
  if (!unit) return null;
  const lowerUnit = unit.toLowerCase();
  if (CONVERSION_FACTORS[lowerUnit]) {
    return lowerUnit;
  }
  for (const key in CONVERSION_FACTORS) {
    if (CONVERSION_FACTORS[key].aliases?.includes(lowerUnit)) {
      return key;
    }
  }
  return null;
}

/**
 * Checks if two units are of the same measurement type (e.g., both are weights).
 * @param {string} unitA - The first unit (e.g., 'kg').
 * @param {string} unitB - The second unit (e.g., 'g').
 * @returns {boolean} - True if units are of the same type.
 */
export function areUnitsCompatible(unitA, unitB) {
  const normA = getNormalizedUnit(unitA);
  const normB = getNormalizedUnit(unitB);
  const typeA = CONVERSION_FACTORS[normA]?.type;
  const typeB = CONVERSION_FACTORS[normB]?.type;
  return typeA && typeB && typeA === typeB;
}

/**
 * Converts a value from a source unit to a target unit.
 *
 * @param {number} value - The numeric value to convert.
 * @param {string} fromUnit - The source unit (e.g., 'g').
 * @param {string} toUnit - The target unit (e.g., 'kg').
 * @returns {number|null} The converted value, or null if units are incompatible or unknown.
 */
export function convertUnit(value, fromUnit, toUnit) {
  const normFrom = getNormalizedUnit(fromUnit);
  const normTo = getNormalizedUnit(toUnit);

  if (!normFrom || !normTo || !areUnitsCompatible(normFrom, normTo)) {
    return null;
  }

  const fromFactor = CONVERSION_FACTORS[normFrom].factor;
  const toFactor = CONVERSION_FACTORS[normTo].factor;

  // Convert `fromUnit` to the base unit, then convert from base to `toUnit`
  const valueInBase = value * fromFactor;
  const valueInTarget = valueInBase / toFactor;

  return valueInTarget;
} 
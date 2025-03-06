// optionsUtil.ts - Utility functions for option management
import { CharacterOption, Character, RangeOption, CONFIG_VERSION } from './types.js';
import { characterOptions, rangeOptions, actionOptions } from './characterOptions.js';

/**
 * Gets the default option for a property
 */
export function getDefaultOption(propertyName: string): string {
  const options = characterOptions[propertyName];
  if (!options || options.length === 0) return '';
  
  const defaultOption = options.find(opt => opt.isDefault);
  return defaultOption?.id || options[0].id;
}

/**
 * Gets the default value for a range property
 */
export function getDefaultRangeValue(propertyName: string): number {
  const options = rangeOptions[propertyName];
  if (!options || options.length === 0) return 0;
  
  const defaultOption = options.find(opt => opt.isDefault);
  return defaultOption?.value || options[0].value;
}

/**
 * Gets the label for an option id
 */
export function getOptionLabel(propertyName: string, optionId: string): string {
  const option = characterOptions[propertyName]?.find(opt => opt.id === optionId);
  return option?.label || optionId;
}

/**
 * Gets only active (non-deprecated) options for a property
 */
export function getActiveOptions(propertyName: string): CharacterOption[] {
  return characterOptions[propertyName]?.filter(opt => !opt.isDeprecated) || [];
}

/**
 * Gets active range options for a property
 */
export function getActiveRangeOptions(propertyName: string): RangeOption[] {
  return rangeOptions[propertyName]?.filter(opt => !opt.isDeprecated) || [];
}

/**
 * Gets all active action options
 */
export function getActiveActionOptions(): CharacterOption[] {
  return actionOptions.filter(opt => !opt.isDeprecated);
}

/**
 * Checks if an option is valid for a property
 */
export function isValidOption(propertyName: string, value: string): boolean {
  return characterOptions[propertyName]?.some(opt => opt.id === value) || false;
}

/**
 * Find the closest range option for a numeric value
 */
export function findClosestRangeOption(propertyName: string, value: number): RangeOption | null {
  const options = rangeOptions[propertyName];
  if (!options || options.length === 0) return null;
  
  return options.reduce((prev, curr) => {
    return (Math.abs(curr.value - value) < Math.abs(prev.value - value)) ? curr : prev;
  });
}

/**
 * Calculate visual age based on options
 */
export function calculateVisualAge(actualAge: number, visualAgeOption: RangeOption): number {
  // If the value is 0, use actual age
  if (visualAgeOption.value === 0) return actualAge;
  
  // If value is positive, use it directly
  if (visualAgeOption.value > 0) return visualAgeOption.value;
  
  // If value is negative, it's an offset from actual age
  return actualAge + Math.abs(visualAgeOption.value);
}

/**
 * Migrates character data from older versions
 */
export function migrateCharacterData(character: Partial<Character>, fromVersion: string): Partial<Character> {
  const result = { ...character };
  
  if (fromVersion < '1.0') {
    // Handle migrations from pre-1.0 versions
    // Example: mapping removed or renamed options
    if (result.race === 'asian') {
      result.race = 'east_asian'; // New replacement
    }
  }
  
  // Validate all options and set defaults for invalid ones
  Object.keys(characterOptions).forEach(prop => {
    if (prop in result && !isValidOption(prop, result[prop as keyof Character] as string)) {
      (result as any)[prop] = getDefaultOption(prop);
    }
  });
  
  return result;
}
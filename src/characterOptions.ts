// characterOptions.ts - Configuration data for character options
import { CharacterOptions, RangeOptions, ActionOption } from './types.js';

// Regular dropdown options
export const characterOptions: CharacterOptions = {
  nationality: [
    { id: 'stateless', label: 'Stateless', isDefault: true },
    { id: 'american', label: 'American' },
    { id: 'british', label: 'British' },
    { id: 'canadian', label: 'Canadian' },
    { id: 'french', label: 'French' },
    { id: 'german', label: 'German' },
    { id: 'japanese', label: 'Japanese' },
    { id: 'other', label: 'Other' }
  ],
  race: [
    { id: 'caucasian', label: 'Caucasian', isDefault: true },
    { id: 'african', label: 'African' },
    { id: 'asian', label: 'Asian' },
    { id: 'hispanic', label: 'Hispanic' },
    { id: 'middleeastern', label: 'Middle Eastern' },
    { id: 'other', label: 'Other' }
  ],
  skin: [
    { id: 'fair', label: 'Fair', isDefault: true },
    { id: 'medium', label: 'Medium' },
    { id: 'olive', label: 'Olive' },
    { id: 'brown', label: 'Brown' },
    { id: 'dark', label: 'Dark' }
  ],
  career: [
    { id: 'unemployed', label: 'Unemployed', isDefault: true },
    { id: 'student', label: 'Student' },
    { id: 'engineer', label: 'Engineer' },
    { id: 'doctor', label: 'Doctor' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'artist', label: 'Artist' },
    { id: 'other', label: 'Other' }
  ],
  hair: [
    { id: 'brown', label: 'Brown', isDefault: true },
    { id: 'black', label: 'Black' },
    { id: 'blonde', label: 'Blonde' },
    { id: 'red', label: 'Red' },
    { id: 'white', label: 'White/Gray' },
    { id: 'other', label: 'Other' }
  ],
  hStyle: [
    { id: 'ponytail', label: 'Ponytail', isDefault: true },
    { id: 'loose', label: 'Loose' },
    { id: 'bun', label: 'Bun' },
    { id: 'short', label: 'Short' },
    { id: 'braided', label: 'Braided' }
  ],
  eyes: [
    { id: 'brown', label: 'Brown', isDefault: true },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
    { id: 'hazel', label: 'Hazel' },
    { id: 'gray', label: 'Gray' }
  ]
};

// Range options (previously sliders) with defined values
export const rangeOptions: RangeOptions = {
  actualAge: [
    { id: 'young_adult', label: 'Young Adult', value: 21, isDefault: true },
    { id: 'adult', label: 'Adult', value: 30 },
    { id: 'middle_aged', label: 'Middle Aged', value: 45 },
    { id: 'older', label: 'Older', value: 60 },
    { id: 'elderly', label: 'Elderly', value: 75 }
  ],
  visualAge: [
    { id: 'appears_younger', label: 'Appears Younger', value: 18 },
    { id: 'appears_true', label: 'True Age', value: 0, isDefault: true }, // 0 means match actual age
    { id: 'appears_older', label: 'Appears Older', value: -5 } // Negative means add to actual age
  ],
  height: [
    { id: 'very_short', label: 'Very Short', value: 155 },
    { id: 'short', label: 'Short', value: 165 },
    { id: 'average', label: 'Average', value: 170, isDefault: true },
    { id: 'tall', label: 'Tall', value: 180 },
    { id: 'very_tall', label: 'Very Tall', value: 190 }
  ],
  weight: [
    { id: 'thin', label: 'Thin', value: 50 },
    { id: 'slim', label: 'Slim', value: 60 },
    { id: 'average_weight', label: 'Average', value: 70, isDefault: true },
    { id: 'heavy', label: 'Heavy', value: 85 },
    { id: 'very_heavy', label: 'Very Heavy', value: 100 }
  ],
  waist: [
    { id: 'narrow_waist', label: 'Narrow', value: 30 },
    { id: 'average_waist', label: 'Average', value: 50, isDefault: true },
    { id: 'wide_waist', label: 'Wide', value: 70 }
  ],
  muscles: [
    { id: 'lean', label: 'Lean', value: 20 },
    { id: 'toned', label: 'Toned', value: 40 },
    { id: 'average_muscle', label: 'Average', value: 50, isDefault: true },
    { id: 'athletic', label: 'Athletic', value: 70 },
    { id: 'muscular', label: 'Muscular', value: 90 }
  ],
  boobs: [
    { id: 'small_chest', label: 'Small', value: 20 },
    { id: 'average_chest', label: 'Average', value: 50, isDefault: true },
    { id: 'large_chest', label: 'Large', value: 80 }
  ],
  hips: [
    { id: 'narrow_hips', label: 'Narrow', value: 30 },
    { id: 'average_hips', label: 'Average', value: 50, isDefault: true },
    { id: 'wide_hips', label: 'Wide', value: 70 }
  ],
  butt: [
    { id: 'small_butt', label: 'Small', value: 30 },
    { id: 'average_butt', label: 'Average', value: 50, isDefault: true },
    { id: 'large_butt', label: 'Large', value: 70 }
  ],
  hLength: [
    { id: 'very_short_hair', label: 'Very Short', value: 10 },
    { id: 'short_hair', label: 'Short', value: 20 },
    { id: 'medium_hair', label: 'Medium', value: 40, isDefault: true },
    { id: 'long_hair', label: 'Long', value: 70 },
    { id: 'very_long_hair', label: 'Very Long', value: 90 }
  ]
};

// Common actions for the actions tab
export const actionOptions: ActionOption[] = [
  { id: 'standing', label: 'Standing', description: 'Character is standing still', isDefault: true },
  { id: 'sitting', label: 'Sitting', description: 'Character is sitting down' },
  { id: 'walking', label: 'Walking', description: 'Character is walking' },
  { id: 'running', label: 'Running', description: 'Character is running' },
  { id: 'jumping', label: 'Jumping', description: 'Character is jumping' },
  { id: 'sleeping', label: 'Sleeping', description: 'Character is sleeping' },
  { id: 'eating', label: 'Eating', description: 'Character is eating food' },
  { id: 'reading', label: 'Reading', description: 'Character is reading' },
  { id: 'talking', label: 'Talking', description: 'Character is talking to someone' },
  { id: 'laughing', label: 'Laughing', description: 'Character is laughing' }
];
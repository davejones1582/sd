// types.ts - Core type definitions

export interface CharacterOption {
  id: string;
  label: string;
  isDefault?: boolean;
  isDeprecated?: boolean;
}

export interface RangeOption extends CharacterOption {
  value: number; // Numeric value associated with this option
}

export interface CharacterOptions {
  [key: string]: CharacterOption[];
}

export interface RangeOptions {
  [key: string]: RangeOption[];
}

export interface Character {
  ID: number;
  name: string;
  surname: string;
  nationality: string;
  race: string;
  skin: string;
  career: string;
  actualAge: number;
  visualAge: number;
  height: number;
  weight: number;
  waist: number;
  muscles: number;
  boobs: number;
  hips: number;
  butt: number;
  markings: string;
  eyes: string;
  hair: string;
  hLength: number;
  hStyle: string;
  clothing: string;
  action: string;
}

// Common action options for the Actions tab
export interface ActionOption extends CharacterOption {
  description?: string;
}

// Version information for migration handling
export const CONFIG_VERSION = '1.0';
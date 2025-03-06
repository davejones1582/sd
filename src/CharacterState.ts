// CharacterState.ts - Main character class
import { Character } from './types.js';
import { getDefaultOption, getDefaultRangeValue } from './optionsUtil.js';
import { characterOptions, rangeOptions } from './characterOptions.js';

export interface HistoryEntry {
  timestamp: Date;
  changes: {
    [key: string]: {
      from: any;
      to: any;
    }
  };
}

export class CharacterState implements Character {
  // Regular option properties
  ID: number = 0;
  name: string = "";
  surname: string = "";
  nationality: string = getDefaultOption('nationality');
  race: string = getDefaultOption('race');
  skin: string = getDefaultOption('skin');
  career: string = getDefaultOption('career');
  hair: string = getDefaultOption('hair');
  hStyle: string = getDefaultOption('hStyle');
  eyes: string = getDefaultOption('eyes');
  
  // Range properties (previously sliders)
  actualAge: number = getDefaultRangeValue('actualAge');
  visualAge: number = getDefaultRangeValue('visualAge');
  height: number = getDefaultRangeValue('height');
  weight: number = getDefaultRangeValue('weight');
  waist: number = getDefaultRangeValue('waist');
  muscles: number = getDefaultRangeValue('muscles');
  boobs: number = getDefaultRangeValue('boobs');
  hips: number = getDefaultRangeValue('hips');
  butt: number = getDefaultRangeValue('butt');
  hLength: number = getDefaultRangeValue('hLength');
  
  // Text properties
  markings: string = "";
  clothing: string = "no clothing";
  action: string = "";

  // Additional properties
  history: HistoryEntry[] = [];
  dateCreated: Date = new Date();
  lastModified: Date = new Date();

  constructor(initialData: Partial<Character> = {}) {
    // Apply initial data
    Object.assign(this, initialData);
  }

  /**
   * Update multiple properties at once
   */
  updateProperties(properties: Partial<Character>): CharacterState {
    const previousState = {...this};
    
    Object.entries(properties).forEach(([key, value]) => {
      if (key in this) {
        (this as any)[key] = value;
      }
    });
    
    this.recordChange(previousState);
    this.lastModified = new Date();
    
    return this;
  }
  
  /**
   * Record changes for history tracking
   */
  recordChange(previousState: Partial<Character>): void {
    const changes: { [key: string]: { from: any; to: any } } = {};
    
    Object.keys(this).forEach(key => {
      if (this[key as keyof CharacterState] !== previousState[key as keyof Character] && 
          key !== 'history' && key !== 'dateCreated' && key !== 'lastModified') {
        changes[key] = {
          from: previousState[key as keyof Character],
          to: this[key as keyof CharacterState]
        };
      }
    });
    
    if (Object.keys(changes).length > 0) {
      this.history.push({
        timestamp: new Date(),
        changes
      });
    }
  }
  
  /**
   * Generate a character description
   */
  generateDescription(): string {
    let description = '';
    
    // Add name and basic info
    const fullName = `${this.name} ${this.surname}`.trim();
    if (fullName) {
      description += `${fullName} is `;
    } else {
      description += 'This character is ';
    }
    
    description += `a ${this.actualAge}-year-old ${this.nationality} ${this.race.toLowerCase()} 
                  who appears to be ${this.visualAge}. `;
    
    // Add career
    if (this.career && this.career !== 'unemployed') {
      description += `They work as a ${this.career}. `;
    } else {
      description += `They are currently unemployed. `;
    }
    
    // Add physical description
    description += `Standing at ${this.height}cm tall with ${this.skin} skin, `;
    description += `they have ${this.hair} hair styled in a ${this.hStyle}. `;
    
    if (this.eyes) {
      description += `Their ${this.eyes} eyes `;
    } else {
      description += `Their eyes `;
    }
    
    // Add special markings if any
    if (this.markings) {
      description += `complement the ${this.markings} on their body. `;
    } else {
      description += `are their most striking feature. `;
    }
    
    // Add clothing
    if (this.clothing && this.clothing !== 'no clothing') {
      description += `They are dressed in ${this.clothing}. `;
    } else {
      description += `They are not currently dressed. `;
    }
    
    // Add current action
    if (this.action) {
      description += `Currently, they are ${this.action}.`;
    }
    
    return description.replace(/\s+/g, ' ').trim();
  }
  
  /**
   * Export character to JSON
   */
  exportToJSON(): string {
    return JSON.stringify(this, null, 2);
  }
  
  /**
   * Create a clone of this character
   */
  clone(): CharacterState {
    return new CharacterState(JSON.parse(JSON.stringify(this)));
  }
  
  /**
   * Calculate BMI
   */
  calculateBMI(): number | null {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100;
      return parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return null;
  }
  
  /**
   * Get BMI category
   */
  getBMICategory(): string | null {
    const bmi = this.calculateBMI();
    if (!bmi) return null;
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
  
  /**
   * Static method to create a character from JSON
   */
  static fromJSON(json: string | object): CharacterState | null {
    try {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      return new CharacterState(data);
    } catch (error) {
      console.error('Error creating character from JSON:', error);
      return null;
    }
  }
  
  /**
   * Static method to create a random character
   */
  static createRandom(): CharacterState {
    const character = new CharacterState();
    
    // Random first names
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Sam'];
    
    // Random last names
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    // Set random values for regular options
    character.name = firstNames[Math.floor(Math.random() * firstNames.length)];
    character.surname = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Set random options for each dropdown field
    Object.keys(characterOptions).forEach(key => {
      const options = characterOptions[key];
      const randomOption = options[Math.floor(Math.random() * options.length)];
      (character as any)[key] = randomOption.id;
    });
    
    // Set random values for range options
    Object.keys(rangeOptions).forEach(key => {
      const options = rangeOptions[key];
      const randomOption = options[Math.floor(Math.random() * options.length)];
      (character as any)[key] = randomOption.value;
    });
    
    // Fix visual age
    if (character.visualAge === 0) {
      character.visualAge = character.actualAge;
    } else if (character.visualAge < 0) {
      character.visualAge = character.actualAge + Math.abs(character.visualAge);
    }
    
    return character;
  }
}
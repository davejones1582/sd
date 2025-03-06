// OptionsManager.ts - Admin functionality for managing options
import { CharacterOption, CharacterOptions } from './types.js';
import { characterOptions } from './characterOptions.js';

export class OptionsManager {
  /**
   * Add a new option to a property
   */
  addOption(property: string, option: CharacterOption): boolean {
    if (!characterOptions[property]) {
      characterOptions[property] = [];
    }
    
    // Check if option with this ID already exists
    if (characterOptions[property].some(opt => opt.id === option.id)) {
      return false;
    }
    
    // If this is marked as default, remove default from others
    if (option.isDefault) {
      characterOptions[property].forEach(opt => opt.isDefault = false);
    }
    
    characterOptions[property].push(option);
    
    // Notify UI or persistence system of change
    this.notifyChange(property);
    
    return true;
  }
  
  /**
   * Update an existing option
   */
  updateOption(property: string, optionId: string, updates: Partial<CharacterOption>): boolean {
    const options = characterOptions[property];
    if (!options) return false;
    
    const index = options.findIndex(opt => opt.id === optionId);
    if (index === -1) return false;
    
    // If setting this as default, clear other defaults
    if (updates.isDefault) {
      options.forEach(opt => opt.isDefault = false);
    }
    
    // Apply updates
    characterOptions[property][index] = {
      ...options[index],
      ...updates
    };
    
    // Notify UI or persistence system of change
    this.notifyChange(property);
    
    return true;
  }
  
  /**
   * Mark an option as deprecated (hidden in UI but valid in data)
   */
  deprecateOption(property: string, optionId: string): boolean {
    return this.updateOption(property, optionId, { isDeprecated: true });
  }
  
  /**
   * Remove an option completely
   */
  removeOption(property: string, optionId: string): boolean {
    const options = characterOptions[property];
    if (!options) return false;
    
    const index = options.findIndex(opt => opt.id === optionId);
    if (index === -1) return false;
    
    // If removing the default option, set a new default
    if (options[index].isDefault && options.length > 1) {
      const newDefaultIndex = index === 0 ? 1 : 0;
      options[newDefaultIndex].isDefault = true;
    }
    
    characterOptions[property].splice(index, 1);
    
    // Notify UI or persistence system of change
    this.notifyChange(property);
    
    return true;
  }
  
  /**
   * Export current options configuration
   */
  exportOptions(): string {
    return JSON.stringify(characterOptions, null, 2);
  }
  
  /**
   * Import options configuration
   */
  importOptions(json: string): boolean {
    try {
      const imported = JSON.parse(json) as CharacterOptions;
      
      // Validate the imported structure
      if (typeof imported !== 'object') return false;
      
      // Replace the current options
      Object.keys(imported).forEach(key => {
        characterOptions[key] = imported[key];
      });
      
      // Notify UI or persistence system of change
      this.notifyChange('all');
      
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Add a new property category
   */
  addPropertyCategory(property: string, options: CharacterOption[] = []): boolean {
    if (characterOptions[property]) {
      return false; // Category already exists
    }
    
    characterOptions[property] = options;
    
    // Notify UI or persistence system of change
    this.notifyChange('all');
    
    return true;
  }

  /**
   * Delete a property category
   */
  deletePropertyCategory(property: string): boolean {
    if (!characterOptions[property]) {
      return false; // Category doesn't exist
    }
    
    delete characterOptions[property];
    
    // Notify UI or persistence system of change
    this.notifyChange('all');
    
    return true;
  }
  
  /**
   * Save options to localStorage
   */
  saveToLocalStorage(): void {
    localStorage.setItem('characterOptions', this.exportOptions());
    localStorage.setItem('optionsVersion', JSON.stringify({ version: '1.0', timestamp: new Date().toISOString() }));
  }
  
  /**
   * Load options from localStorage
   */
  loadFromLocalStorage(): boolean {
    const savedOptions = localStorage.getItem('characterOptions');
    if (!savedOptions) return false;
    
    return this.importOptions(savedOptions);
  }
  
  /**
   * Notify subscribers that options have changed
   * This is a placeholder for a more sophisticated event system
   */
  private notifyChange(property: string): void {
    // This could be implemented with a proper event system
    // For now, just dispatch a custom event
    const event = new CustomEvent('optionsChanged', { 
      detail: { property }
    });
    document.dispatchEvent(event);
  }
}
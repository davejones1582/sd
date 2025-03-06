// App.ts - Main application entry point
import { CharacterState } from './CharacterState.js';
import { UIManager } from './UIManager.js';
import { OptionsManager } from './OptionsManager.js';
import { getDefaultOption } from './optionsUtil.js';

/**
 * Main application class
 */
export class CharacterCreatorApp {
  private character: CharacterState;
  private uiManager: UIManager;
  private optionsManager: OptionsManager;
  
  constructor() {
    // Initialize options manager
    this.optionsManager = new OptionsManager();
    
    // Try to load options from localStorage
    this.optionsManager.loadFromLocalStorage();
    
    // Create initial character
    this.character = new CharacterState();
    
    // Initialize UI
    this.uiManager = new UIManager(this.character);
    
    // Add random character generation button if present
    const randomButton = document.getElementById('generate-random');
    if (randomButton) {
      randomButton.addEventListener('click', this.generateRandomCharacter.bind(this));
    }
    
    // Add export button if present
    const exportButton = document.getElementById('export-character');
    if (exportButton) {
      exportButton.addEventListener('click', this.exportCharacter.bind(this));
    }
    
    // Add import button if present
    const importButton = document.getElementById('import-character');
    if (importButton) {
      importButton.addEventListener('click', this.importCharacter.bind(this));
    }
    
    console.log('Character Creator App initialized successfully');
  }
  
  /**
   * Generate a random character
   */
  private generateRandomCharacter(): void {
    this.character = CharacterState.createRandom();
    
    // Update existing UI with new character instead of creating a new UIManager
    this.uiManager.updateCharacter(this.character);
  }
  
  /**
   * Export current character to JSON file
   */
  private exportCharacter(): void {
    const jsonString = this.character.exportToJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and click it to download
    const a = document.createElement('a');
    
    // Generate filename based on character name or ID
    let filename = 'character';
    if (this.character.name) {
      filename = `${this.character.name}_${this.character.surname || ''}`.trim();
    } else {
      filename = `character_${this.character.ID}`;
    }
    
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Import character from JSON file
   */
  private importCharacter(): void {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    
    fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        if (!json) return;
        
        try {
          const importedCharacter = CharacterState.fromJSON(json);
          if (importedCharacter) {
            this.character = importedCharacter;
            
            // Update existing UI with imported character
            this.uiManager.updateCharacter(this.character);
            
            alert('Character imported successfully!');
          }
        } catch (error) {
          console.error('Error importing character:', error);
          alert('Error importing character. Invalid JSON format.');
        }
      };
      
      reader.readAsText(file);
    });
    
    // Trigger file selection
    fileInput.click();
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new CharacterCreatorApp();
});
// UIManager.ts - UI management functionality
import { CharacterState } from './CharacterState.js';
import {
  getActiveOptions,
  getActiveRangeOptions,
  getActiveActionOptions,
  getDefaultOption,
  getDefaultRangeValue,
  findClosestRangeOption,
  calculateVisualAge
} from './optionsUtil.js';
import { characterOptions, rangeOptions, actionOptions } from './characterOptions.js';
import { RangeOption } from './types.js';

// Map of property names to tab containers
const TAB_MAPPING = {
  // Personal tab fields
  nationality: 'personal',
  career: 'personal',
  actualAge: 'personal',
  visualAge: 'personal',

  // Physical tab fields
  race: 'physical',
  skin: 'physical',
  height: 'physical',
  weight: 'physical',
  waist: 'physical',
  muscles: 'physical',
  boobs: 'physical',
  hips: 'physical',
  butt: 'physical',

  // Appearance tab fields
  hair: 'appearance',
  hLength: 'appearance',
  hStyle: 'appearance',
  eyes: 'appearance'
};

export class UIManager {
  private characterForm: HTMLFormElement | null = null;
  private formElements: { [key: string]: HTMLInputElement } = {};
  private character: CharacterState;
  private previewElement: HTMLElement | null = null;
  private characterListElement: HTMLElement | null = null;

  constructor(character: CharacterState) {
    this.character = character;
    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeUI());
    } else {
      this.initializeUI();
    }
  }

  /**
   * Initialize the UI elements and event listeners
   */
  private initializeUI(): void {
    // Get form and preview elements
    this.characterForm = document.getElementById('character-form') as HTMLFormElement;
    this.previewElement = document.getElementById('character-preview-content');
    this.characterListElement = document.getElementById('saved-characters');

    if (!this.characterForm || !this.previewElement || !this.characterListElement) {
      console.error('Required UI elements not found');
      return;
    }

    // Initialize tab switching
    this.initTabSwitching();

    // Clear existing content from tabs to avoid duplication
    this.clearTabContents();

    // Generate option fields
    this.generateOptionFields();

    // Initialize form elements
    this.initFormElements();

    // Set up event listeners
    this.initEventListeners();

    // Update preview
    this.updatePreview();

    // Listen for options changes
    document.addEventListener('optionsChanged', (e: Event) => {
      // Clear existing content before regenerating
      this.clearTabContents();
      // Re-generate option fields when options change
      this.generateOptionFields();
    });
  }

  /**
 * Update the character and refresh the UI
 */
  updateCharacter(character: CharacterState): void {
    this.character = character;

    // Reset UI to avoid duplicate listeners
    this.clearEventListeners();

    // Clear and regenerate UI elements
    this.clearTabContents();
    this.generateOptionFields();

    // Update form elements
    this.initFormElements();

    // Set up event listeners
    this.initEventListeners();

    // Update preview
    this.updatePreview();

    // Refresh character list
    this.renderCharacterList();
  }

  /**
   * Clear existing event listeners
   */
  private clearEventListeners(): void {
    // Remove save button listener
    const saveButton = document.getElementById('save-character');
    if (saveButton) {
      // Clone and replace to remove all event listeners
      const newSaveButton = saveButton.cloneNode(true);
      saveButton.parentNode?.replaceChild(newSaveButton, saveButton);
    }

    // Remove reset form button listener
    const resetButton = document.getElementById('reset-form');
    if (resetButton) {
      // Clone and replace to remove all event listeners
      const newResetButton = resetButton.cloneNode(true);
      resetButton.parentNode?.replaceChild(newResetButton, resetButton);
    }

    // Clear form element listeners
    for (const element of Object.values(this.formElements)) {
      if (element.type !== 'hidden') {
        const newElement = element.cloneNode(true) as HTMLInputElement;
        element.parentNode?.replaceChild(newElement, element);
      }
    }

    // Clear tab listeners
    document.querySelectorAll('.tab').forEach(tab => {
      const newTab = tab.cloneNode(true);
      tab.parentNode?.replaceChild(newTab, tab);
    });

    // Re-initialize tab switching
    this.initTabSwitching();
  }


  /**
   * Clear existing content from tab content areas
   */
  private clearTabContents(): void {
    // Get all tab content containers
    const tabContents = document.querySelectorAll('.tab-content');

    // For each tab content, find form elements and clear them
    tabContents.forEach(tab => {
      // Get original inputs that should be preserved (name, surname, markings, clothing)
      const originalInputs: { [key: string]: HTMLInputElement } = {};
      const inputsToPreserve = tab.querySelectorAll('input[type="text"]');

      inputsToPreserve.forEach(input => {
        const element = input as HTMLInputElement;
        if (element.id) {
          originalInputs[element.id] = element.cloneNode(true) as HTMLInputElement;
        }
      });

      // Get the tab ID to identify which tab we're working with
      const tabId = tab.id;
      const tabName = tabId.replace('-tab', '');

      // Clear all contents except the heading
      const heading = tab.querySelector('h2');
      const originalForm = document.createElement('div');

      // Create a clean tab content with just the heading
      tab.innerHTML = '';
      if (heading) {
        tab.appendChild(heading);
      }

      // Add back text inputs that we want to preserve
      if (['personal', 'appearance', 'actions'].includes(tabName)) {
        // Recreate the original text input structure based on tab type
        if (tabName === 'personal') {
          // Add name and surname fields
          const nameRow = document.createElement('div');
          nameRow.className = 'form-row';

          // First name group
          const firstNameGroup = document.createElement('div');
          firstNameGroup.className = 'form-group';
          const firstNameLabel = document.createElement('label');
          firstNameLabel.setAttribute('for', 'name');
          firstNameLabel.textContent = 'First Name';
          firstNameGroup.appendChild(firstNameLabel);

          if (originalInputs.name) {
            firstNameGroup.appendChild(originalInputs.name);
          } else {
            const firstNameInput = document.createElement('input');
            firstNameInput.type = 'text';
            firstNameInput.id = 'name';
            firstNameInput.name = 'name';
            firstNameGroup.appendChild(firstNameInput);
          }

          // Last name group
          const lastNameGroup = document.createElement('div');
          lastNameGroup.className = 'form-group';
          const lastNameLabel = document.createElement('label');
          lastNameLabel.setAttribute('for', 'surname');
          lastNameLabel.textContent = 'Last Name';
          lastNameGroup.appendChild(lastNameLabel);

          if (originalInputs.surname) {
            lastNameGroup.appendChild(originalInputs.surname);
          } else {
            const lastNameInput = document.createElement('input');
            lastNameInput.type = 'text';
            lastNameInput.id = 'surname';
            lastNameInput.name = 'surname';
            lastNameGroup.appendChild(lastNameInput);
          }

          nameRow.appendChild(firstNameGroup);
          nameRow.appendChild(lastNameGroup);
          tab.appendChild(nameRow);
        } else if (tabName === 'appearance') {
          // Add markings and clothing fields at the end
          // We'll add a placeholder div for option fields
          const optionsContainer = document.createElement('div');
          optionsContainer.id = 'appearance-options';
          tab.appendChild(optionsContainer);

          // Markings field
          const markingsGroup = document.createElement('div');
          markingsGroup.className = 'form-group';
          const markingsLabel = document.createElement('label');
          markingsLabel.setAttribute('for', 'markings');
          markingsLabel.textContent = 'Special Markings';
          markingsGroup.appendChild(markingsLabel);

          if (originalInputs.markings) {
            markingsGroup.appendChild(originalInputs.markings);
          } else {
            const markingsInput = document.createElement('input');
            markingsInput.type = 'text';
            markingsInput.id = 'markings';
            markingsInput.name = 'markings';
            markingsInput.placeholder = 'Tattoos, scars, etc.';
            markingsGroup.appendChild(markingsInput);
          }

          // Clothing field
          const clothingGroup = document.createElement('div');
          clothingGroup.className = 'form-group';
          const clothingLabel = document.createElement('label');
          clothingLabel.setAttribute('for', 'clothing');
          clothingLabel.textContent = 'Clothing Style';
          clothingGroup.appendChild(clothingLabel);

          if (originalInputs.clothing) {
            clothingGroup.appendChild(originalInputs.clothing);
          } else {
            const clothingInput = document.createElement('input');
            clothingInput.type = 'text';
            clothingInput.id = 'clothing';
            clothingInput.name = 'clothing';
            clothingInput.placeholder = 'Describe clothing';
            clothingGroup.appendChild(clothingInput);
          }

          tab.appendChild(markingsGroup);
          tab.appendChild(clothingGroup);
        } else if (tabName === 'actions') {
          // Add options container
          const optionsContainer = document.createElement('div');
          optionsContainer.id = 'action-options';
          tab.appendChild(optionsContainer);

          // Custom action field
          const actionGroup = document.createElement('div');
          actionGroup.className = 'form-group';
          const actionLabel = document.createElement('label');
          actionLabel.setAttribute('for', 'action');
          actionLabel.textContent = 'Custom Action';
          actionGroup.appendChild(actionLabel);

          if (originalInputs.action) {
            actionGroup.appendChild(originalInputs.action);
          } else {
            const actionInput = document.createElement('input');
            actionInput.type = 'text';
            actionInput.id = 'action';
            actionInput.name = 'action';
            actionInput.placeholder = 'Describe a custom action...';
            actionGroup.appendChild(actionInput);
          }

          tab.appendChild(actionGroup);
        }
      }

      // Create option containers if they don't exist
      if (['personal', 'physical', 'appearance'].includes(tabName)) {
        let optionsContainer = document.getElementById(`${tabName}-options`);
        if (!optionsContainer) {
          optionsContainer = document.createElement('div');
          optionsContainer.id = `${tabName}-options`;
          tab.appendChild(optionsContainer);
        }
      }
    });
  }

  /**
   * Generate all option fields based on configuration
   */
  private generateOptionFields(): void {
    // Generate regular option fields (nationality, race, etc.)
    Object.keys(characterOptions).forEach(property => {
      this.createOptionField(property);
    });

    // Generate range option fields (height, weight, etc.)
    Object.keys(rangeOptions).forEach(property => {
      this.createRangeField(property);
    });

    // Generate action options
    this.createActionOptions();
  }

  /**
   * Create a option field for a property
   */
  private createOptionField(property: string): void {
    // Determine which tab this field belongs to
    const tabName = TAB_MAPPING[property as keyof typeof TAB_MAPPING] || 'personal';
    const containerElement = document.getElementById(`${tabName}-options`);
    if (!containerElement) {
      console.error(`Container for ${property} not found`);
      return;
    }

    // Create the field container
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-group';

    // Create label
    const label = document.createElement('label');
    label.textContent = this.formatLabel(property);
    fieldContainer.appendChild(label);

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.id = `${property}-buttons`;

    // Create hidden input for the value
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = property;
    hiddenInput.name = property;
    hiddenInput.value = (this.character as any)[property] || getDefaultOption(property);

    // Get current value from character
    const currentValue = (this.character as any)[property] || getDefaultOption(property);

    // Add buttons for each option
    getActiveOptions(property).forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = option.label;
      button.dataset.value = option.id;

      // Mark as selected if it matches current value
      if (option.id === currentValue) {
        button.classList.add('selected');
      }

      // Add click event to update hidden input and character
      button.addEventListener('click', (e) => {
        // Prevent form submission
        e.preventDefault();

        // Remove selected class from all buttons in this group
        buttonGroup.querySelectorAll('.option-button').forEach(btn => {
          btn.classList.remove('selected');
        });

        // Add selected class to clicked button
        button.classList.add('selected');

        // Update hidden input
        hiddenInput.value = option.id;

        // Update character property
        if (property in this.character) {
          (this.character as any)[property] = option.id;

          // Special case for visual age calculation
          if (property === 'actualAge') {
            this.updateVisualAge();
          }

          this.updatePreview();
        }
      });

      buttonGroup.appendChild(button);
    });

    // Add to container
    fieldContainer.appendChild(buttonGroup);
    fieldContainer.appendChild(hiddenInput);
    containerElement.appendChild(fieldContainer);
  }

  /**
   * Create a range field for a property
   */
  private createRangeField(property: string): void {
    // Determine which tab this field belongs to
    const tabName = TAB_MAPPING[property as keyof typeof TAB_MAPPING] || 'physical';
    const containerElement = document.getElementById(`${tabName}-options`);
    if (!containerElement) {
      console.error(`Container for ${property} not found`);
      return;
    }

    // Create the field container
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-group';

    // Create label
    const label = document.createElement('label');
    label.textContent = this.formatLabel(property);
    fieldContainer.appendChild(label);

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.id = `${property}-buttons`;

    // Create hidden input for the value
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = property;
    hiddenInput.name = property;

    // Get current value from character or default
    const currentValue = (this.character as any)[property] || getDefaultRangeValue(property);
    hiddenInput.value = currentValue.toString();

    // Find closest option to current value
    const closestOption = findClosestRangeOption(property, currentValue);

    // Add buttons for each option
    getActiveRangeOptions(property).forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = option.label;
      button.dataset.value = option.value.toString();

      // Mark as selected if it's the closest option
      if (closestOption && option.id === closestOption.id) {
        button.classList.add('selected');
      }

      // Add click event to update hidden input and character
      button.addEventListener('click', (e) => {
        // Prevent form submission
        e.preventDefault();

        // Remove selected class from all buttons in this group
        buttonGroup.querySelectorAll('.option-button').forEach(btn => {
          btn.classList.remove('selected');
        });

        // Add selected class to clicked button
        button.classList.add('selected');

        // Update hidden input
        hiddenInput.value = option.value.toString();

        // Update character property
        if (property in this.character) {
          (this.character as any)[property] = option.value;

          // Special case for visual age calculation
          if (property === 'actualAge') {
            this.updateVisualAge();
          }

          this.updatePreview();
        }
      });

      buttonGroup.appendChild(button);
    });

    // Add to container
    fieldContainer.appendChild(buttonGroup);
    fieldContainer.appendChild(hiddenInput);
    containerElement.appendChild(fieldContainer);
  }

  /**
   * Create action options
   */
  private createActionOptions(): void {
    const containerElement = document.getElementById('action-options');
    if (!containerElement) {
      console.error('Action options container not found');
      return;
    }

    // Create the field container
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-group';

    // Create label
    const label = document.createElement('label');
    label.textContent = 'Common Actions';
    fieldContainer.appendChild(label);

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.id = 'action-buttons';

    // Get current action
    const currentAction = this.character.action;

    // Add buttons for each action
    getActiveActionOptions().forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = option.label;
      button.dataset.action = option.id;

      // Mark as selected if it matches current action
      if (option.id === currentAction) {
        button.classList.add('selected');
      }

      // Add click event to update action input
      button.addEventListener('click', (e) => {
        // Prevent form submission
        e.preventDefault();

        // Remove selected class from all buttons in this group
        buttonGroup.querySelectorAll('.option-button').forEach(btn => {
          btn.classList.remove('selected');
        });

        // Add selected class to clicked button
        button.classList.add('selected');

        // Find action input
        const actionInput = document.getElementById('action') as HTMLInputElement;
        if (actionInput) {
          actionInput.value = option.id;
          // Update character
          this.character.action = option.id;
          this.updatePreview();
        }
      });

      buttonGroup.appendChild(button);
    });

    // Add to container
    fieldContainer.appendChild(buttonGroup);
    containerElement.appendChild(fieldContainer);
  }

  /* Rest of the methods omitted for brevity */

  // Include all the other methods here...

  /**
   * Format a property name as a label
   */
  private formatLabel(property: string): string {
    // Split camelCase into words
    const label = property.replace(/([A-Z])/g, ' $1');
    // Capitalize first letter
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  /**
   * Update visual age based on actual age and selected option
   */
  private updateVisualAge(): void {
    // Find visual age option
    const visualAgeProperty = 'visualAge';
    const visualAgeInput = document.getElementById(visualAgeProperty) as HTMLInputElement;

    if (!visualAgeInput) return;

    // Get the selected visual age option
    const visualAgeOptions = getActiveRangeOptions(visualAgeProperty);
    const visualAgeValue = parseInt(visualAgeInput.value);

    // Find the option with this value
    const visualAgeOption = visualAgeOptions.find(opt => opt.value === visualAgeValue);

    if (!visualAgeOption) return;

    // Calculate visual age
    const actualAge = this.character.actualAge;
    const visualAge = calculateVisualAge(actualAge, visualAgeOption);

    // Update character
    this.character.visualAge = visualAge;
  }

  /**
   * Initialize form elements and map them
   */
  private initFormElements(): void {
    if (!this.characterForm) return;

    // Get all text inputs and hidden inputs
    const elements = this.characterForm.querySelectorAll('input');

    elements.forEach(element => {
      const id = element.id;
      if (!id) return;

      this.formElements[id] = element;

      // Set initial values from character state
      if (id in this.character) {
        element.value = (this.character as any)[id]?.toString() || '';
      }
    });
  }

  /**
   * Initialize event listeners
   */
  private initEventListeners(): void {
    // Text input events
    Object.entries(this.formElements).forEach(([id, element]) => {
      // Skip hidden inputs (handled by buttons)
      if (element.type === 'hidden') return;

      element.addEventListener('input', (e) => {
        // Update character state
        if (id in this.character) {
          const value = element.value;
          (this.character as any)[id] = value;
        }

        this.updatePreview();
      });
    });

    // Save character button
    const saveButton = document.getElementById('save-character');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        this.saveCharacter();
      });
    }

    // Reset form button
    const resetButton = document.getElementById('reset-form');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.resetForm();
      });
    }
  }

  /**
   * Initialize tab switching functionality
   */
  private initTabSwitching(): void {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const tabContentId = `${(tab as HTMLElement).dataset.tab}-tab`;
        const tabContent = document.getElementById(tabContentId);
        if (tabContent) {
          tabContent.classList.add('active');
        }
      });
    });
  }

  /**
   * Update the character preview
   */
  private updatePreview(): void {
    if (!this.previewElement) return;

    // Format the character details for preview
    const details = [
      { label: 'ID', value: this.character.ID },
      { label: 'Name', value: `${this.character.name} ${this.character.surname}` },
      { label: 'Nationality', value: this.character.nationality },
      { label: 'Career', value: this.character.career },
      { label: 'Age', value: `${this.character.actualAge} (looks ${this.character.visualAge})` },
      { label: 'Race', value: this.character.race },
      { label: 'Skin', value: this.character.skin },
      { label: 'Height', value: `${this.character.height} cm` },
      { label: 'Build', value: `Weight: ${this.character.weight}, Muscles: ${this.character.muscles}%` },
      { label: 'Body Shape', value: `Waist: ${this.character.waist}%, Chest: ${this.character.boobs}%, Hips: ${this.character.hips}%, Butt: ${this.character.butt}%` },
      { label: 'Hair', value: `${this.character.hair}, ${this.character.hStyle}, ${this.character.hLength}% length` },
      { label: 'Eyes', value: this.character.eyes },
      { label: 'Markings', value: this.character.markings || 'None' },
      { label: 'Clothing', value: this.character.clothing },
      { label: 'Action', value: this.character.action || 'Standing idle' }
    ];

    // Create the preview HTML
    let previewHTML = '';
    details.forEach(detail => {
      previewHTML += `<div class="character-detail"><strong>${detail.label}:</strong> <span>${detail.value}</span></div>`;
    });

    this.previewElement.innerHTML = previewHTML;
  }

  /**
   * Save the current character
   */
  private saveCharacter(): void {
    // Prevent multiple saves by adding a guard
    if ((window as any)._isSaving) {
      return;
    }

    // Set saving flag
    (window as any)._isSaving = true;

    try {
      // Get existing characters from localStorage
      const existingCharsJson = localStorage.getItem('savedCharacters');
      const characters: CharacterState[] = existingCharsJson ?
        JSON.parse(existingCharsJson).map((c: any) => new CharacterState(c)) : [];

      // Check if we're updating an existing character
      const existingIndex = characters.findIndex(c => c.ID === this.character.ID);

      if (existingIndex !== -1) {
        // Update existing character
        characters[existingIndex] = this.character;
      } else {
        // Add as new character
        characters.push(this.character);
      }

      // Save to local storage
      localStorage.setItem('savedCharacters', JSON.stringify(characters));

      // Update the character list
      this.renderCharacterList(characters);

      // Create a new character for the form
      this.resetForm();

      alert('Character saved successfully!');
    } finally {
      // Clear saving flag after a small delay
      setTimeout(() => {
        (window as any)._isSaving = false;
      }, 100);
    }
  }
  /**
   * Load a character into the form
   */
  loadCharacter(id: number, characters: CharacterState[]): void {
    const character = characters.find(c => c.ID === id);

    if (character) {
      // Copy the character data to our current character
      Object.assign(this.character, character);

      // Clear and recreate UI to ensure clean state
      this.clearTabContents();
      this.generateOptionFields();

      // Update text form elements
      for (const [key, element] of Object.entries(this.formElements)) {
        // Only update visible text inputs
        if (element.type !== 'hidden' && key in this.character) {
          element.value = (this.character as any)[key]?.toString() || '';
        }
      }

      // Update the preview
      this.updatePreview();
    }
  }

  /**
   * Delete a character
   */
  deleteCharacter(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this character?');

    if (confirmDelete) {
      // Get existing characters
      const existingCharsJson = localStorage.getItem('savedCharacters');
      let characters: CharacterState[] = existingCharsJson ?
        JSON.parse(existingCharsJson).map((c: any) => new CharacterState(c)) : [];

      // Remove the character
      characters = characters.filter(c => c.ID !== id);

      // Save to local storage
      localStorage.setItem('savedCharacters', JSON.stringify(characters));

      // Update the character list
      this.renderCharacterList(characters);
    }
  }

  /**
   * Reset the form to create a new character
   */
  resetForm(): void {
    // Create a new character with a new ID
    this.character = new CharacterState();
    this.character.ID = this.getNextId();

    // Clear content and regenerate UI
    this.clearTabContents();
    this.generateOptionFields();

    // Reset visible form elements
    for (const [key, element] of Object.entries(this.formElements)) {
      if (element.type !== 'hidden' && key in this.character) {
        element.value = (this.character as any)[key]?.toString() || '';
      }
    }

    // Update the preview
    this.updatePreview();
  }

  /**
   * Render the list of saved characters
   */
  renderCharacterList(charactersParam?: CharacterState[]): void {
    if (!this.characterListElement) return;

    // Define a default empty array
    const characters: CharacterState[] = charactersParam || (() => {
      const existingCharsJson = localStorage.getItem('savedCharacters');
      if (!existingCharsJson) return [];

      try {
        return JSON.parse(existingCharsJson).map((c: any) => new CharacterState(c));
      } catch (e) {
        console.error('Error parsing saved characters:', e);
        return [];
      }
    })();

    if (characters.length === 0) {
      this.characterListElement.innerHTML = '<p>No characters saved yet.</p>';
      return;
    }

    let listHTML = '';
    characters.forEach(character => {
      listHTML += `
        <div class="character-item">
          <div class="character-info">
            <strong>${character.name} ${character.surname || ''}</strong>
            <div>${character.race}, ${character.nationality}, ${character.career}</div>
          </div>
          <div class="character-actions">
            <button class="load-character" data-id="${character.ID}">Load</button>
            <button class="delete-character button-secondary" data-id="${character.ID}">Delete</button>
          </div>
        </div>
      `;
    });

    this.characterListElement.innerHTML = listHTML;

    // Create a copy of characters for closures
    const charactersCopy = characters.slice();

    // Add event listeners to the load and delete buttons
    document.querySelectorAll('.load-character').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt((e.target as HTMLElement).dataset.id || '0');
        this.loadCharacter(id, charactersCopy);
      });
    });

    document.querySelectorAll('.delete-character').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt((e.target as HTMLElement).dataset.id || '0');
        this.deleteCharacter(id);
      });
    });
  }

  /**
   * Get the next available ID for a new character
   */
  private getNextId(): number {
    const existingCharsJson = localStorage.getItem('savedCharacters');
    const characters: CharacterState[] = existingCharsJson ?
      JSON.parse(existingCharsJson).map((c: any) => new CharacterState(c)) : [];

    if (characters.length === 0) {
      return 1;
    }

    // Find the highest ID
    const maxId = Math.max(...characters.map(c => c.ID));
    return maxId + 1;
  }
}
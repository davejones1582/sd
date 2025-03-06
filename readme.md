# Character Creator

A modular, TypeScript-based web application for creating and managing character profiles with configurable options.

## Features

- Create, edit, and manage character profiles
- Configurable character options (nationality, race, etc.)
- Option versioning and migration support
- Import/export characters as JSON
- Random character generation
- Responsive UI with tabbed interface

## Project Structure

```
src/
├── types.ts              # Core type definitions
├── characterOptions.ts   # Character option configurations
├── optionsUtil.ts        # Utility functions for options
├── CharacterState.ts     # Main character class
├── OptionsManager.ts     # Admin functionality for options
├── UIManager.ts          # UI management
└── App.ts                # Main application entry point
```

## Setup and Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Build the project
   ```
   npm run build
   ```
4. Start the development server
   ```
   npm run serve
   ```

## Development

- Build and watch for changes:
  ```
  npm run watch
  ```
- Run the development server and build:
  ```
  npm run dev
  ```

## Adding New Options

To add new option categories or values, modify the `characterOptions.ts` file:

```typescript
// Add a new option category
export const characterOptions: CharacterOptions = {
  // Existing options...
  
  newCategory: [
    { id: 'option1', label: 'Option 1', isDefault: true },
    { id: 'option2', label: 'Option 2' },
    // Add more options...
  ]
};
```

## Customizing the Character Model

To extend the Character interface with new properties:

1. Update the `Character` interface in `types.ts`
2. Update the `CharacterState` class in `CharacterState.ts`
3. Update the UI in `index.html` and `UIManager.ts`

## License

MIT

// ==========================================================================
// Theme Validation & Debugging System
// ==========================================================================

import { themes, type ThemeVariables } from './themeConfig';

export interface ValidationResult {
  isValid: boolean;
  missingVariables: string[];
  appliedVariables: string[];
  errors: string[];
  warnings: string[];
}

export interface DebugInfo {
  currentTheme: string;
  appliedVariables: Record<string, string>;
  computedStyles: Record<string, string>;
  validationResult: ValidationResult;
}

/**
 * Validates that all required theme variables are present
 */
export const validateThemeVariables = (themeName: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    missingVariables: [],
    appliedVariables: [],
    errors: [],
    warnings: [],
  };

  const theme = themes[themeName];
  if (!theme) {
    result.isValid = false;
    result.errors.push(`Theme "${themeName}" not found`);
    return result;
  }

  // Check if all variables are applied to the document
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  Object.entries(theme.variables).forEach(([variable, expectedValue]) => {
    const appliedValue = root.style.getPropertyValue(variable);
    const computedValue = computedStyle.getPropertyValue(variable);

    if (appliedValue) {
      result.appliedVariables.push(variable);
    } else {
      result.missingVariables.push(variable);
      result.isValid = false;
      result.errors.push(`Variable ${variable} not applied`);
    }

    // Check if computed value matches expected
    if (computedValue && computedValue.trim() !== expectedValue) {
      result.warnings.push(
        `Variable ${variable} has unexpected value: expected "${expectedValue}", got "${computedValue}"`
      );
    }
  });

  return result;
};

/**
 * Gets comprehensive debug information about the current theme
 */
export const getThemeDebugInfo = (): DebugInfo => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const currentTheme = document.body.getAttribute('data-theme') || 'plasma';

  // Get all applied variables
  const appliedVariables: Record<string, string> = {};
  const computedStyles: Record<string, string> = {};

  // Check all possible theme variables
  const allVariables = [
    // Global variables
    '--color-background-primary',
    '--color-surface-primary',
    '--color-text-primary',
    '--color-text-secondary',
    '--color-accent-primary',
    '--color-accent-secondary',
    '--color-border',
    '--color-shadow',
    '--color-interactive-hover',
    '--color-interactive-active',

    // Legacy variables
    '--color-background',
    '--color-surface',
    '--color-primary-accent',
    '--color-secondary-accent',
    '--color-disabled',
    '--color-error',
    '--color-error-text',

    // Mixer variables
    '--mixer-visualizer-color-1',
    '--mixer-visualizer-color-2',
    '--mixer-visualizer-color-3',
    '--mixer-background-overlay',
    '--mixer-control-background',
    '--mixer-control-border',
    '--mixer-slider-track',
    '--mixer-slider-thumb',
    '--mixer-slider-thumb-hover',

    // Player variables
    '--player-control-background',
    '--player-tracklist-background',
    '--player-progress-track',
    '--player-progress-fill',
    '--player-album-art-border',
    '--player-header-background',
    '--player-window-border',

    // Toggle variables
    '--toggle-off-background',
    '--toggle-off-border',
    '--toggle-off-text',
    '--toggle-on-background',
    '--toggle-on-border',
    '--toggle-on-text',
    '--toggle-hover-background',
    '--toggle-hover-border',
    '--toggle-glow-color',
  ];

  allVariables.forEach(variable => {
    const appliedValue = root.style.getPropertyValue(variable);
    const computedValue = computedStyle.getPropertyValue(variable);

    if (appliedValue) {
      appliedVariables[variable] = appliedValue;
    }
    if (computedValue) {
      computedStyles[variable] = computedValue;
    }
  });

  const validationResult = validateThemeVariables(currentTheme);

  return {
    currentTheme,
    appliedVariables,
    computedStyles,
    validationResult,
  };
};

/**
 * Logs comprehensive theme debug information to console
 */
export const logThemeDebugInfo = (): void => {
  const debugInfo = getThemeDebugInfo();

  console.group('🎨 Theme Debug Information');
  console.log('Current Theme:', debugInfo.currentTheme);

  console.group('✅ Applied Variables');
  Object.entries(debugInfo.appliedVariables).forEach(([variable, value]) => {
    console.log(`${variable}: ${value}`);
  });
  console.groupEnd();

  console.group('🔍 Computed Styles');
  Object.entries(debugInfo.computedStyles).forEach(([variable, value]) => {
    console.log(`${variable}: ${value}`);
  });
  console.groupEnd();

  console.group('⚠️ Validation Results');
  console.log('Is Valid:', debugInfo.validationResult.isValid);
  if (debugInfo.validationResult.missingVariables.length > 0) {
    console.error(
      'Missing Variables:',
      debugInfo.validationResult.missingVariables
    );
  }
  if (debugInfo.validationResult.errors.length > 0) {
    console.error('Errors:', debugInfo.validationResult.errors);
  }
  if (debugInfo.validationResult.warnings.length > 0) {
    console.warn('Warnings:', debugInfo.validationResult.warnings);
  }
  console.groupEnd();

  console.groupEnd();
};

/**
 * Validates theme on window load and logs results
 */
export const initializeThemeValidation = (): void => {
  // Validate on initial load
  setTimeout(() => {
    logThemeDebugInfo();
  }, 100);

  // Listen for theme changes
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'data-theme'
      ) {
        console.log('🎨 Theme changed, validating...');
        setTimeout(() => {
          logThemeDebugInfo();
        }, 50);
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
};

/**
 * Exports debug information for external use
 */
export const exportThemeDebugInfo = (): string => {
  const debugInfo = getThemeDebugInfo();
  return JSON.stringify(debugInfo, null, 2);
};

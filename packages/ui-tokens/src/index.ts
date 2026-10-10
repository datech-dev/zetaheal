// ==============================================================================
// Zeta Heal (OT Pathway) - Healthcare Design Tokens
// ==============================================================================

export const colors = {
  // Brand Primary (Deep Teal / Blue-Green)
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e', // Main Brand Accent
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },

  // Secondary (Muted Healthcare Blue)
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Neutrals / Canvas (Warm off-white background, crisp surface, slate text)
  neutral: {
    background: '#fafaf9', // Warm off-white
    surface: '#ffffff',    // Card and modal surface
    surfaceAlt: '#f4f4f5', // Subtle section background
    border: '#e4e4e7',     // Clean low-contrast hairline borders
    borderStrong: '#d4d4d8',
    textMain: '#0f172a',   // Dark slate primary typography
    textMuted: '#64748b',  // Readable secondary slate
    textSubtle: '#94a3b8',
  },

  // Functional Semantic Accents (Accessible WCAG AAA/AA)
  semantic: {
    success: {
      light: '#f0fdf4',
      border: '#bbf7d0',
      text: '#166534',
      badge: '#22c55e',
    },
    warning: {
      light: '#fffbeb',
      border: '#fde68a',
      text: '#92400e',
      badge: '#f59e0b',
    },
    danger: {
      light: '#fef2f2',
      border: '#fecaca',
      text: '#991b1b',
      badge: '#ef4444',
    },
    info: {
      light: '#f0f9ff',
      border: '#bae6fd',
      text: '#075985',
      badge: '#0284c7',
    },
  },
};

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'Outfit, Inter, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
};

export const radii = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
};

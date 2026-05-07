export const colors = {
  surface: {
    900: '#0a0a0a',
    800: '#141414',
    700: '#1f1f1f',
    600: '#2a2a2a',
  },
  border: '#2a2a2a',
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    muted: '#6b7280',
  },
  accent: {
    DEFAULT: '#22c55e',
    hover: '#16a34a',
    soft: 'rgba(34,197,94,0.12)',
  },
  status: {
    active: '#22c55e',
    injured: '#ef4444',
    inactive: '#6b7280',
  },
  danger: '#ef4444',
} as const;

export const radius = { card: 16, pill: 999, input: 12 } as const;
export const spacing = { card: 16, screen: 20 } as const;

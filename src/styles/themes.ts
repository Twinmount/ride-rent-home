export type Theme = 'light' | 'dark' | 'navbar';
export type Size = 'sm' | 'md' | 'lg';

interface ThemeConfig {
  dropdown: string;
  label: string;
  select: string;
  button: string;
  trigger: string;
  triggerBorder?: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    dropdown: 'bg-white border-gray-200 shadow-lg',
    label: 'text-gray-700',
    select:
      'bg-white border-gray-300 text-gray-900 focus:ring-orange-500 focus:border-orange-500',
    button: 'bg-yellow text-white hover:bg-orange-600',
    trigger: 'text-gray-900 hover:text-orange-500',
  },
  dark: {
    dropdown: 'bg-text-primary border-gray-700 shadow-xl',
    label: 'text-text-secondary',
    select:
      'bg-gray-700 border-gray-600 text-white focus:ring-orange-500 focus:border-orange-500',
    button: 'bg-yellow text-black hover:opacity-90',
    trigger: 'text-text-tertiary hover:text-orange-400',
    triggerBorder: 'border border-text-tertiary',
  },
  navbar: {
    dropdown: 'bg-white border-gray-200 shadow-lg mr-3 lg:mr-0',
    label: 'text-gray-600',
    select:
      'bg-white border-gray-200 text-gray-900 focus:ring-orange-500 focus:border-orange-500',
    button: 'bg-orange-500 text-white hover:bg-orange-600',
    trigger: 'text-gray-900',
  },
};

export const sizeConfig = {
  sm: { icon: 'h-3 w-3', text: 'text-xs', padding: 'px-2 py-1', dropdown: 'w-20' },
  md: { icon: 'h-4 w-4', text: 'text-sm', padding: 'px-3 py-2', dropdown: 'w-40' },
  lg: { icon: 'h-5 w-5', text: 'text-base', padding: 'px-4 py-3', dropdown: 'w-72' },
};
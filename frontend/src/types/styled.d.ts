import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      background: string;
      text: string;
      border: string;
      disabled: string;
    };
    typography: {
      fontFamily: string;
      h1: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      h2: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      body: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      small: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      fast: string;
      medium: string;
      slow: string;
    };
  }
}

export interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  active?: boolean;
}

export interface StatusProps {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type?: 'success' | 'error' | 'warning' | 'info';
}

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  success?: boolean;
}

export interface ModalProps {
  visible?: boolean;
}

export interface ImageProps {
  image?: string;
} 
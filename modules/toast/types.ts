/**
 * Toast type variants
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Options for showing a toast
 */
export interface ToastOptions {
  description?: string;
  duration?: number;
}

/**
 * Internal toast state
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration: number;
  isExiting?: boolean;
}

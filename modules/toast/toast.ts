import { getShowToast } from './ToastContext';
import { ToastOptions } from './types';

/**
 * Imperative toast API
 * Usage: toast.error('Message', { description: 'Details' })
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    const showToast = getShowToast();
    if (showToast) {
      showToast('success', message, options);
    } else {
      console.warn('Toast: ToastProvider not mounted');
    }
  },

  error: (message: string, options?: ToastOptions) => {
    const showToast = getShowToast();
    if (showToast) {
      showToast('error', message, options);
    } else {
      console.warn('Toast: ToastProvider not mounted');
    }
  },

  info: (message: string, options?: ToastOptions) => {
    const showToast = getShowToast();
    if (showToast) {
      showToast('info', message, options);
    } else {
      console.warn('Toast: ToastProvider not mounted');
    }
  },
};


import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Toast, ToastOptions, ToastType } from './types';

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 3;

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Store for imperative API access
let globalShowToast: ToastContextValue['showToast'] | null = null;

export function getShowToast(): ToastContextValue['showToast'] | null {
  return globalShowToast;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const hideToast = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const duration = options?.duration ?? DEFAULT_DURATION;

    const newToast: Toast = {
      id,
      type,
      message,
      description: options?.description,
      duration,
    };

    // Clear any toasts that will be removed due to MAX_TOASTS limit
    setToasts((prev) => {
      const next = [newToast, ...prev];
      // If we're over the limit, we'll handle cleanup after
      return next.slice(0, MAX_TOASTS);
    });

    // Set auto-dismiss timeout for the new toast
    const timeout = setTimeout(() => {
      timeoutRefs.current.delete(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);

    timeoutRefs.current.set(id, timeout);
  }, []);

  // Cleanup old toast timeouts when toasts array changes
  useEffect(() => {
    const currentIds = new Set(toasts.map((t) => t.id));

    // Clear timeouts for toasts that are no longer in the array
    timeoutRefs.current.forEach((timeout, id) => {
      if (!currentIds.has(id)) {
        clearTimeout(timeout);
        timeoutRefs.current.delete(id);
      }
    });
  }, [toasts]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  // Set global reference for imperative API
  globalShowToast = showToast;

  const value: ToastContextValue = {
    toasts,
    showToast,
    hideToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

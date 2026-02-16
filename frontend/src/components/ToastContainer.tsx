'use client';

import { useToast } from '@/lib/toast-context';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-lg p-4 shadow-lg border animate-in fade-in-50 slide-in-from-bottom-4 duration-200 ${
            toast.type === 'vote'
              ? 'glass border-success/30 bg-success/10'
              : toast.type === 'success'
              ? 'glass border-success/30 bg-success/10'
              : toast.type === 'error'
              ? 'glass border-danger/30 bg-danger/10'
              : 'glass border-primary/30 bg-primary/10'
          }`}
        >
          <div className="flex-1 min-w-0">
            {/* Icon */}
            <div className="flex items-center gap-2 mb-0.5">
              {toast.type === 'vote' && (
                <span className="text-lg animate-bounce">🎃</span>
              )}
              {toast.type === 'success' && (
                <span className="text-lg">✓</span>
              )}
              {toast.type === 'error' && (
                <span className="text-lg">✕</span>
              )}
              {toast.type === 'info' && (
                <span className="text-lg">ℹ</span>
              )}
            </div>

            {/* Message */}
            <p className={`text-sm leading-snug ${
              toast.type === 'vote' || toast.type === 'success'
                ? 'text-success'
                : toast.type === 'error'
                ? 'text-danger'
                : 'text-primary'
            }`}>
              {toast.message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Close toast"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

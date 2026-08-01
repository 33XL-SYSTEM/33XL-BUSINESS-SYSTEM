import { Toaster } from '@interface/components/sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
      }}
    />
  );
}
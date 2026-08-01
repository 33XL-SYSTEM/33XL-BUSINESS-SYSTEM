import { useEffect } from 'react';
import { WorkspaceLayout } from '@interface/layouts/WorkspaceLayout';
import { ToastProvider } from '@interface/components/providers/ToastProvider';

export default function App() {
  useEffect(() => {
    // Força o dark mode por padrão nesta aplicação brutalista
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <WorkspaceLayout />
      <ToastProvider />
    </>
  );
}

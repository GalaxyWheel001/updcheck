import { Suspense, lazy, ComponentType } from 'react';

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

export function LazyLoader({ component, fallback, props }: LazyLoaderProps) {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <div className="loading-spinner">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Предзагруженные компоненты для критических путей
export const preloadComponents = () => {
  // Предзагружаем тяжелые компоненты
  const SpinResult = lazy(() => import('./wheel/SpinResult'));
  const SupportChat = lazy(() => import('./wheel/SupportChat'));
  
  return { SpinResult, SupportChat };
}; 
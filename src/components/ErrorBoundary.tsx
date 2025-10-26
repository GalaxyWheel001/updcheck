'use client';
import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // ЭКСТРЕННАЯ ДИАГНОСТИКА для поиска источника "Error: {}"
    console.log('🚨 ErrorBoundary getDerivedStateFromError вызван с:', {
      error,
      type: typeof error,
      constructor: error?.constructor?.name,
      message: error?.message,
      stack: error?.stack,
      keys: error ? Object.keys(error) : []
    });
    
    // Убеждаемся, что error является валидным объектом Error
    if (!error || typeof error !== 'object' || !error.message) {
      console.error('🚨 ErrorBoundary received invalid error object:', error);
      const fallbackError = new Error('Unknown error occurred');
      return { error: fallbackError, errorInfo: null };
    }
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Убеждаемся, что error является валидным объектом Error
    if (!error || typeof error !== 'object' || !error.message) {
      console.error('ErrorBoundary caught invalid error object:', error);
      const fallbackError = new Error('Unknown error occurred');
      this.setState({ error: fallbackError, errorInfo });
      return;
    }
    
    console.error('⚠️ React caught:', error, errorInfo);
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-900 p-8">
          <div className="bg-red-800 rounded-lg p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong:</h2>
            <pre className="text-red-200 text-sm whitespace-pre-wrap mb-4">
              {this.state.error.message || 'Unknown error'}
            </pre>
            <details className="text-red-200 text-xs">
              <summary className="cursor-pointer mb-2">Error Stack:</summary>
              <pre className="whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
            {this.state.errorInfo && (
              <details className="text-red-200 text-xs mt-2">
                <summary className="cursor-pointer mb-2">Component Stack:</summary>
                <pre className="whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

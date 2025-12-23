"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  componentName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console
    console.error(`❌ ERROR in ${this.props.componentName}:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Return custom fallback or default one
      return (
        this.props.fallback || (
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-orange-300 bg-white p-8 text-center shadow-sm">
            {/* Icon with soft background */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <AlertCircle className="h-6 w-6 text-accent-brand" />
            </div>

            <h3 className="text-lg font-semibold text-text-primary">
              {this.props.componentName} failed to load
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              We encountered a small hiccup. Try refreshing this section.
            </p>

            <button
              onClick={this.handleReset}
              className="mt-6 flex items-center gap-2 rounded-full bg-accent-brand px-5 py-2 text-sm font-medium text-white transition-all hover:bg-accent-light active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>

            {/* Minimal Debug Info (Visible only in development) */}
            {/* {process.env.APP_ENV === "development" && ( */}
            <details className="mt-6 w-full text-left">
              <summary className="cursor-pointer text-center text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-gray-600">
                Developer Details
              </summary>
              <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-gray-50 p-4 text-[11px] leading-relaxed text-gray-600">
                <code className="block font-mono">
                  {this.state.error?.message}
                  {"\n\n"}
                  {this.state.error?.stack}
                </code>
              </pre>
            </details>
            {/* )} */}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;

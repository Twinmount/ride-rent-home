"use client";

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

  render() {
    if (this.state.hasError) {
      // Return custom fallback or default one
      return (
        this.props.fallback || (
          <div
            style={{
              padding: "20px",
              margin: "20px 0",
              border: "2px solid #ff4444",
              borderRadius: "8px",
              backgroundColor: "#fff5f5",
            }}
          >
            <h3 style={{ color: "#ff4444", margin: "0 0 10px 0" }}>
              ⚠️ {this.props.componentName} Error
            </h3>
            <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
              This section couldn't load. The rest of the page should work
              normally.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details style={{ marginTop: "10px" }}>
                <summary style={{ cursor: "pointer", color: "#666" }}>
                  Debug Info (Dev Only)
                </summary>
                <pre
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {this.state.error?.message}
                  {"\n\n"}
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;

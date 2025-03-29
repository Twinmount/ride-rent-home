"use client";

import { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function ErrorFallback({ error }: FallbackProps) {
  return <div>Error: {error.message}</div>;
}

interface ErrorWrapperProps {
  children: ReactNode;
}

export function ErrorWrapper({ children }: ErrorWrapperProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}

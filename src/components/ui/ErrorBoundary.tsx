import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** Rendered instead of the children if they throw. */
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches runtime errors from the 3D experience and shows a fallback instead of
 * a blank screen — upholds AGENTS.md §3 rule 1 ("never a blank screen"). App
 * wraps <Experience3D> with this, falling back to the 2D grid.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] 3D experience crashed, falling back to 2D:', error, info);
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

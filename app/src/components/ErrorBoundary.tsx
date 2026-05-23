/**
 * @file ErrorBoundary.tsx
 * @description React 错误边界组件。在渲染阶段捕获子组件异常，防止单个组件错误
 *   导致整个应用白屏。展示友好的错误提示 UI 和重试按钮。
 * @dependencies react
 */
import React from 'react';

/** 组件 Props */
interface Props {
  /** 子节点 */
  children: React.ReactNode;
}

/** 组件 State */
interface State {
  /** 是否发生错误 */
  hasError: boolean;
  /** 错误对象 */
  error: Error | null;
}

/** React 错误边界组件，捕获渲染异常并提供恢复能力 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /** 从子组件错误中派生状态 */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /** 记录错误日志（可选接入监控服务） */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  /** 重置错误状态，尝试重新渲染 */
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            {/* Error icon */}
            <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error message */}
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-text-secondary mb-2">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error && (
              <p className="text-xs text-text-muted font-mono bg-[rgba(255,255,255,0.03)] border border-border-subtle rounded px-3 py-2 mb-6 break-all">
                {this.state.error.message}
              </p>
            )}

            {/* Retry button */}
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 rounded-lg text-sm font-medium hover:bg-accent-cyan/20 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4 text-center font-sans">
          <div className="bg-white rounded-3xl p-8 max-w-md shadow-xl border-4 border-amber-300">
            <span className="text-6xl mb-4 block">🚀</span>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              APEX Kids Learning
            </h2>
            <p className="text-slate-600 text-sm mb-6 font-bold">
              حدث خطأ بسيط أثناء التحميل. اضغط أدناه لإعادة تشغيل التطبيق.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              إعادة التحميل 🔄
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

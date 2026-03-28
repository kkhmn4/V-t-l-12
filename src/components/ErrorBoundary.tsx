import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      let parsedError = null;
      try {
        if (this.state.error?.message) {
          parsedError = JSON.parse(this.state.error.message);
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi hệ thống</h1>
            
            {parsedError ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
                <h2 className="font-semibold text-red-800 mb-2">Lỗi truy cập dữ liệu (Firestore)</h2>
                <p className="text-sm text-red-700 mb-1"><strong>Hành động:</strong> {parsedError.operationType}</p>
                <p className="text-sm text-red-700 mb-1"><strong>Đường dẫn:</strong> {parsedError.path}</p>
                <p className="text-sm text-red-700 mb-4"><strong>Chi tiết:</strong> {parsedError.error}</p>
                
                <h3 className="font-medium text-red-800 mb-1 text-sm">Thông tin xác thực:</h3>
                <pre className="bg-white p-2 rounded border border-red-100 text-xs overflow-auto">
                  {JSON.stringify(parsedError.authInfo, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
                <p className="text-red-700">{this.state.error?.message || 'Lỗi không xác định'}</p>
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

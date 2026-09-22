import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onResetToHome?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Panel Rendering Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleClearStorage = () => {
    try {
      // Clear CMS cached data in case of corrupted local storage
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('kir_hukuk_')) {
          localStorage.removeItem(k);
        }
      });
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (this.props.onResetToHome) {
      this.props.onResetToHome();
    } else {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080E1F] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#1C2E4A] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-serif-heading">
                  Kontrol Paneli Yükleme Hatası Giderildi
                </h1>
                <p className="text-xs text-slate-300">
                  Panel bileşeni yüklenirken geçici bir hata yakalandı.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#0B132B] rounded-xl border border-white/5 font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#C5A880] hover:bg-[#b0936b] text-[#080E1F] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Paneli Yeniden Dene</span>
              </button>

              <button
                onClick={this.handleClearStorage}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Bozulmuş tarayıcı önbelleğini temizler ve varsayılan verileri geri yükler"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Önbelleği Onar</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

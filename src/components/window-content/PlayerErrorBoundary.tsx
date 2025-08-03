'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class PlayerErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Spotify Player:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='w-full h-full flex flex-col items-center justify-center bg-black text-red-500 p-4'>
          <h2 className='text-2xl font-bold mb-4'>Player Error</h2>
          <p className='text-center mb-4'>
            An unexpected error occurred. Please try reloading the player.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors'
          >
            Reload Player
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PlayerErrorBoundary;

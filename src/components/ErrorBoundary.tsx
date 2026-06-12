import React from 'react'

type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 border rounded p-6">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">An unexpected error occurred while rendering the app. Check the browser console for details.</p>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }

    return this.props.children as React.ReactElement
  }
}

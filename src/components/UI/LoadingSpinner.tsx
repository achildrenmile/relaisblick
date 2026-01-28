interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Lade Daten...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">📡</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}

export default LoadingSpinner;

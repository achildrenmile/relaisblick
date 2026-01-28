import { useI18n } from '../../i18n';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t.loadingError}
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {t.retry}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;

import { useEffect, useRef } from "react";

const Snackbar = ({
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
}) => {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto flex items-center gap-3 bg-gray-900 dark:bg-gray-700 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
      <span className="text-sm">{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-orange-400 hover:text-orange-300 font-medium text-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Snackbar;

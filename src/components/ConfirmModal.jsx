import { useEffect, useRef } from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmStyles = {
    danger:
      "bg-red-600 hover:bg-red-700 focus:ring-red-400",
    info: "bg-orange-400 hover:bg-orange-500 focus:ring-orange-300",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 space-y-4 animate-scale-in"
      >
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white cursor-pointer transition-colors focus:outline-0 focus:ring-2 ${
              confirmStyles[variant] || confirmStyles.danger
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

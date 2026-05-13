import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../contexts/ThemeProvider";
import { TaskContext } from "../contexts/TasksProvider";
import ConfirmModal from "../components/ConfirmModal";

const Settings = () => {
  const { dark, toggleTheme } = useContext(ThemeContext);
  const { tasks, importTasks, clearAllTasks } = useContext(TaskContext);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileRef = useRef(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vulse-tasks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error("Invalid format");
        if (
          tasks.length === 0 ||
          window.confirm(
            `Replace all ${tasks.length} existing tasks with ${imported.length} imported tasks?`
          )
        ) {
          importTasks(imported);
        }
      } catch {
        alert("Invalid file. Please select a valid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearAll = () => {
    if (tasks.length > 0) setShowClearConfirm(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto pt-24 px-4 transition-colors">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 dark:text-white">
        Settings
      </h1>

      <section className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div>
            <p className="font-medium dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toggle dark theme
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              dark ? "bg-orange-400" : "bg-gray-300"
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                dark ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
          <p className="font-medium dark:text-white">Data</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm cursor-pointer transition-colors"
            >
              Export Tasks
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm cursor-pointer transition-colors"
            >
              Import Tasks
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-red-200 dark:border-red-900">
          <p className="font-medium text-red-600 dark:text-red-400 mb-2">
            Danger Zone
          </p>
          <button
            onClick={handleClearAll}
            disabled={tasks.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer transition-colors"
          >
            Clear All Tasks ({tasks.length})
          </button>
        </div>
      </section>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear all tasks"
        message={`Are you sure you want to delete all ${tasks.length} tasks? This cannot be undone.`}
        confirmLabel="Delete All"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          clearAllTasks();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};

export default Settings;

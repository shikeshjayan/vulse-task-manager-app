import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { TaskContext } from "../contexts/TasksProvider";
import TaskItem from "../components/TaskItem";
import Snackbar from "../components/Snackbar";
import ConfirmModal from "../components/ConfirmModal";

const FILTERS = ["all", "active", "completed"];
const SORTS = [
  { value: "created", label: "Newest" },
  { value: "-created", label: "Oldest" },
  { value: "priority", label: "Priority" },
  { value: "text", label: "Name" },
];

const STORAGE_KEY = "vulse_tasks_ui";

const loadPersisted = (key, fallback) => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed[key] ?? fallback;
    }
  } catch {
    /* sessionStorage may be blocked */
  }
  return fallback;
};

const persist = (key, value) => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : {};
    data[key] = value;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sessionStorage may be blocked */
  }
};

const Tasks = () => {
  const { tasks, addTask, deleteTask, restoreTask, toggleTask, editTask, moveTask } =
    useContext(TaskContext);

  const [text, setText] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  const [filter, setFilter] = useState(() => loadPersisted("filter", "all"));
  const [sort, setSort] = useState(() => loadPersisted("sort", "created"));
  const [search, setSearch] = useState(() => loadPersisted("search", ""));

  const [snackbar, setSnackbar] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const deletedRef = useRef(null);
  const inputRef = useRef(null);
  const draggedId = useRef(null);

  useEffect(() => { persist("filter", filter); }, [filter]);
  useEffect(() => { persist("sort", sort); }, [sort]);
  useEffect(() => { persist("search", search); }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text, priority, dueDate, category);
    setText("");
    setPriority("low");
    setDueDate("");
    setCategory("");
    inputRef.current?.focus();
  };

  const handleDelete = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) setConfirmDelete(task);
  };

  const confirmDeleteTask = () => {
    if (!confirmDelete) return;
    deletedRef.current = confirmDelete;
    deleteTask(confirmDelete.id);
    setSnackbar({ message: "Task deleted" });
    setConfirmDelete(null);
  };

  const handleUndo = () => {
    if (deletedRef.current) {
      restoreTask(deletedRef.current);
      deletedRef.current = null;
    }
    setSnackbar(null);
  };

  const handleDragStart = (id) => {
    draggedId.current = id;
  };

  const handleContainerDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const card = e.target.closest("[data-task-id]");
    const newId = card?.dataset.taskId ?? null;
    setDragOverId((prev) => (prev !== newId ? newId : prev));
  };

  const handleContainerDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverId(null);
    }
  };

  const handleContainerDrop = (e) => {
    e.preventDefault();
    setDragOverId(null);
    const sourceId = draggedId.current;
    if (!sourceId) return;
    const target = e.target.closest("[data-task-id]");
    if (target) {
      const targetId = target.dataset.taskId;
      if (sourceId !== targetId) {
        moveTask(sourceId, targetId);
      }
    }
    draggedId.current = null;
  };

  const filtered = useMemo(() => {
    let result = [...tasks];

    if (filter === "active") result = result.filter((t) => !t.completed);
    else if (filter === "completed") result = result.filter((t) => t.completed);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.text.toLowerCase().includes(q));
    }

    const priorityRank = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      if (sort === "created") return b.createdAt - a.createdAt;
      if (sort === "-created") return a.createdAt - b.createdAt;
      if (sort === "priority")
        return priorityRank[a.priority] - priorityRank[b.priority];
      if (sort === "text") return a.text.localeCompare(b.text);
      return 0;
    });

    return result;
  }, [tasks, filter, search, sort]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-24 pb-16 px-4 transition-colors">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="What needs to be done?"
              aria-label="New task"
              className="flex-1 px-4 py-2.5 border rounded shadow-sm focus:outline-0 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              type="submit"
              className="bg-orange-400 text-white px-5 py-2.5 rounded hover:bg-orange-500 cursor-pointer transition-colors shrink-0"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              aria-label="Priority"
              className="w-24 px-2 py-1.5 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              aria-label="Due date"
              className="w-36 px-2 py-1.5 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              placeholder="Category"
              aria-label="Category"
              className="flex-1 min-w-[120px] px-2 py-1.5 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="flex-1 min-w-[160px] px-3 py-1.5 border rounded text-sm focus:outline-0 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded cursor-pointer capitalize transition-colors ${
                  filter === f
                    ? "bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort tasks"
            className="w-28 px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 mt-6 text-center">
            {tasks.length === 0
              ? "No tasks yet. Add one above!"
              : "No tasks match your filters."}
          </p>
        ) : (
          <div
            onDragOver={handleContainerDragOver}
            onDragLeave={handleContainerDragLeave}
            onDrop={handleContainerDrop}
            className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 sm:gap-4 [&>*]:animate-card-in"
          >
            {filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isDragOver={dragOverId === task.id}
                onToggle={toggleTask}
                onDelete={handleDelete}
                onEdit={editTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          {filtered.length} / {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          actionLabel="Undo"
          onAction={handleUndo}
          onClose={() => setSnackbar(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete task"
        message={`Are you sure you want to delete "${confirmDelete?.text}"?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDeleteTask}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Tasks;

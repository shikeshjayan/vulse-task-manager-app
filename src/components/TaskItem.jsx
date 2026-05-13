import { useEffect, useRef, useState } from "react";

const priorityBorder = {
  low: "border-t-green-400",
  medium: "border-t-yellow-400",
  high: "border-t-red-400",
};

const priorityBadge = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const TaskItem = ({ task, onToggle, onDelete, onEdit, onDragStart, isDragOver }) => {
  const [editing, setEditing] = useState(false);
  const [editInput, setEditInput] = useState(task.text);
  const editRef = useRef(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const save = () => {
    onEdit(task.id, editInput);
    setEditing(false);
  };

  const cancel = () => {
    setEditInput(task.text);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-40");
    onDragStart(task.id);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-40");
  };

  const editActions = (
    <div className="flex gap-1">
      <button
        onClick={save}
        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer"
      >
        Save
      </button>
      <button
        onClick={cancel}
        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div
      draggable={!editing}
      data-task-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative flex flex-col gap-2 p-4 pb-12 sm:pb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-t-4 transition-all duration-200 ${
        !editing ? "cursor-grab active:cursor-grabbing" : ""
      } ${priorityBorder[task.priority] || priorityBorder.low} ${
        isDragOver ? "shadow-lg ring-2 ring-orange-400 scale-[1.02]" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
            task.completed
              ? "bg-orange-400 border-orange-400"
              : "border-gray-300 dark:border-gray-500 hover:border-orange-400"
          }`}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {editing ? (
          <input
            ref={editRef}
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            aria-label="Edit task"
            className="flex-1 px-2 py-0.5 border rounded focus:outline-0 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm sm:text-base"
          />
        ) : (
          <span
            onClick={() => onToggle(task.id)}
            className={`flex-1 cursor-pointer select-none text-sm sm:text-base transition-colors ${
              task.completed
                ? "line-through text-gray-400 dark:text-gray-500"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.text}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {task.priority && (
          <span className={`px-2 py-0.5 rounded font-medium ${priorityBadge[task.priority] || priorityBadge.low}`}>
            {task.priority}
          </span>
        )}
        {task.dueDate && (
          <span className="text-gray-500 dark:text-gray-400">{task.dueDate}</span>
        )}
        {task.category && (
          <span className="text-gray-400 dark:text-gray-500">{task.category}</span>
        )}
      </div>

      {editing ? (
        <>
          <div className="flex sm:hidden items-center gap-2 mt-1 pt-2 border-t border-gray-100 dark:border-gray-700">
            {editActions}
          </div>
          <div className="hidden sm:flex absolute top-2 right-2 gap-1 opacity-100">
            {editActions}
          </div>
        </>
      ) : (
        <>
          <div className="flex sm:hidden items-center gap-2 mt-1 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 py-1.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer"
            >
              Delete
            </button>
          </div>
          <div className="hidden sm:flex absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              aria-label={`Edit ${task.text}`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="px-2 py-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer"
              aria-label={`Delete ${task.text}`}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;

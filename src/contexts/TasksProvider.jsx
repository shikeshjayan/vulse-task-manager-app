import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const TaskContext = createContext({});

const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((text, priority = "low", dueDate = "", category = "") => {
    if (!text.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate,
      category: category.trim() || "General",
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const restoreTask = useCallback((task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const editTask = useCallback((id, newText) => {
    if (!newText.trim()) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: newText.trim() } : task
      )
    );
  }, []);

  const moveTask = useCallback((sourceId, targetId) => {
    if (sourceId === targetId) return;
    setTasks((prev) => {
      const sourceIdx = prev.findIndex((t) => t.id === sourceId);
      const targetIdx = prev.findIndex((t) => t.id === targetId);
      if (sourceIdx === -1 || targetIdx === -1) return prev;

      const result = [...prev];
      const [moved] = result.splice(sourceIdx, 1);
      const newTargetIdx = result.findIndex((t) => t.id === targetId);
      result.splice(newTargetIdx, 0, moved);
      return result;
    });
  }, []);

  const importTasks = useCallback((newTasks) => {
    if (!Array.isArray(newTasks)) return;
    setTasks(newTasks);
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      deleteTask,
      restoreTask,
      toggleTask,
      editTask,
      moveTask,
      importTasks,
      clearAllTasks,
    }),
    [tasks, addTask, deleteTask, restoreTask, toggleTask, editTask, moveTask, importTasks, clearAllTasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TasksProvider;
export { TaskContext };

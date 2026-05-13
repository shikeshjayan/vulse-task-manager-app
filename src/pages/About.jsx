const About = () => {
  const features = [
    { label: "Create & manage tasks", desc: "Add tasks with priority, due dates, and categories" },
    { label: "Card layout", desc: "Tasks displayed in a clean, responsive grid of cards" },
    { label: "Drag to reorder", desc: "Rearrange tasks by dragging cards" },
    { label: "Filter & sort", desc: "Filter by status, search by text, sort multiple ways" },
    { label: "Dark mode", desc: "Switch between light and dark themes" },
    { label: "Data portability", desc: "Export and import your tasks as JSON" },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center pt-28 pb-16 px-4 transition-colors">
      <div className="max-w-2xl w-full space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold dark:text-white">About vulse</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Feel the pulse of done
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            vulse is a task manager built to help you capture, organize, and
            stay on top of your tasks. Clean interface, fast input, and
            everything saved automatically.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold dark:text-white">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div
                key={f.label}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-orange-400"
              >
                <p className="font-medium text-sm dark:text-white">{f.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold dark:text-white">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["React 19", "Vite 7", "Tailwind CSS 4", "React Router 7"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 dark:text-gray-600">
          <p>vulse &mdash; v0.1.0</p>
          <p className="mt-1">Built with React &middot; Open source</p>
        </div>
      </div>
    </section>
  );
};

export default About;

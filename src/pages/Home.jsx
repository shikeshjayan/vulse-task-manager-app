import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <header className="min-h-screen max-w-screen flex flex-col justify-center items-center gap-4 px-4 transition-colors">
      <h1 className="text-5xl sm:text-6xl font-bold dark:text-white text-center">
        vulse
      </h1>
      <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 text-center">
        Feel the pulse of done
      </p>
      <NavLink
        to="/tasks"
        className="mt-4 px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
      >
        Get Started
      </NavLink>
    </header>
  );
};

export default Home;

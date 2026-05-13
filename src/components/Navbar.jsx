import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeProvider";

const linkClass = ({ isActive }) =>
  isActive
    ? "text-white border-b-2 border-white"
    : "text-orange-200 hover:text-white transition-colors";

const Navbar = () => {
  const { dark, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 flex items-center justify-between px-4 md:px-8 bg-orange-400 text-white w-full h-16 z-40 shadow">
      <div className="text-lg font-semibold">
        <NavLink to="/" onClick={() => setOpen(false)}>vulse</NavLink>
      </div>

      <ul className="hidden md:flex items-center gap-6 text-sm">
        <li><NavLink to="/home" className={linkClass}>Home</NavLink></li>
        <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
        <li><NavLink to="/tasks" className={linkClass}>Tasks</NavLink></li>
        <li><NavLink to="/settings" className={linkClass}>Settings</NavLink></li>
      </ul>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="text-xl cursor-pointer hover:scale-110 transition-transform hidden md:block"
          aria-label="Toggle dark mode"
        >
          {dark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-orange-400 flex flex-col items-center gap-4 py-6 shadow-lg md:hidden z-50">
          <NavLink to="/home" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/tasks" className={linkClass} onClick={() => setOpen(false)}>Tasks</NavLink>
          <NavLink to="/settings" className={linkClass} onClick={() => setOpen(false)}>Settings</NavLink>
          <button
            onClick={() => { toggleTheme(); setOpen(false); }}
            className="text-2xl cursor-pointer mt-2"
            aria-label="Toggle dark mode"
          >
            {dark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

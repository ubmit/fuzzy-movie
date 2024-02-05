import { Link } from "@remix-run/react";

export function Header() {
  return (
    <header className="flex justify-between w-full bg-black text-white shadow-md p-4">
      <nav>
        <ul className="flex gap-4">
          <li className="p-1">
            <Link to="/">Home</Link>
          </li>
          <li className="p-1">
            <Link to="/favorites">Favorites</Link>
          </li>
        </ul>
      </nav>
      <input className="text-black p-1 rounded-sm" type="search"></input>
    </header>
  );
}

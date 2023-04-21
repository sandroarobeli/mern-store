import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import QuantityBadge from "./QuantityBadge";
import UserBadge from "./UserBadge";

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    navigate(`/search?query=${query} `);
  };

  return (
    <header>
      <nav className="flex justify-between items-center h-12 px-4 text-xs md:text-lg font-orbitron shadow-md">
        <Link to="/" className="font-bold">
          Internet Store
        </Link>
        <form
          onSubmit={submitHandler}
          className="mx-auto hidden justify-center md:flex"
        >
          <input
            type="text"
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0"
            placeholder="Search products.."
          />
          <button
            type="submit"
            id="button-addon"
            className="rounded rounded-tl-none rounded-bl-none p-1 bg-amber-300 text-sm dark:text-black"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>
        <div>
          <Link to="/cart" className="p-2">
            Cart
            <QuantityBadge />
          </Link>
          <UserBadge />
        </div>
      </nav>
    </header>
  );
}

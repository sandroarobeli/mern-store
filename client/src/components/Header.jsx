import { Link } from "react-router-dom";

import QuantityBadge from "./QuantityBadge";
import UserBadge from "./UserBadge";

export default function Header() {
  return (
    <header>
      <nav className="flex justify-between items-center h-12 px-4 text-xs md:text-lg font-orbitron shadow-md">
        <Link to="/" className="font-bold">
          Internet Store
        </Link>
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

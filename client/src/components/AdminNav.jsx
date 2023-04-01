import { Link } from "react-router-dom";

export default function AdminNav({ pathname }) {
  return (
    <div>
      <ul>
        <li>
          <Link
            to="/admin/dashboard"
            className={pathname === "/admin/dashboard" ? "font-bold" : ""}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className={pathname === "/admin/orders" ? "font-bold" : ""}
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products"
            className={pathname === "/admin/products" ? "font-bold" : ""}
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/admin/new-product"
            className={pathname === "/admin/new-product" ? "font-bold" : ""}
          >
            New product
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className={pathname === "/admin/users" ? "font-bold" : ""}
          >
            Users
          </Link>
        </li>
      </ul>
    </div>
  );
}

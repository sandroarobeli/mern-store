import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";

import {
  selectUserStatus,
  selectUserName,
  selectUserAdmin,
  selectToken,
  logout,
} from "../redux/userSlice";
import { cartReset } from "../redux/cartSlice";

export default function UserBadge() {
  const dispatch = useDispatch();
  const userStatus = useSelector(selectUserStatus);
  const userName = useSelector(selectUserName);
  const isAdmin = useSelector(selectUserAdmin);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    // Reset cart content
    await dispatch(cartReset());
    // Sign out and return to login page
    await dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {userStatus === "loading" ? (
        "loading.."
      ) : token ? (
        <Menu
          as="div"
          className="relative inline-block border rounded shadow px-1 hover:shadow-inner active:shadow"
        >
          <Menu.Button className="text-blue-600">{userName}</Menu.Button>
          <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white">
            <Menu.Item>
              <Link to="/profile" className="dropdown-link">
                Profile
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/order-history" className="dropdown-link">
                Order History
              </Link>
            </Menu.Item>
            {isAdmin && (
              <Menu.Item>
                <Link to="/admin/dashboard" className="dropdown-link">
                  Admin Dashboard
                </Link>
              </Menu.Item>
            )}
            <Menu.Item>
              <Link href="#" className="dropdown-link" onClick={logoutHandler}>
                Logout
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Link to="/login" className="p-2">
          Login
        </Link>
      )}
    </>
  );
}

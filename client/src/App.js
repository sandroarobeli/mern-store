import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { ToastContainer } from "react-toastify";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/orbitron/variable.css";
import "@fontsource/inter/variable.css";

import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShippingAddress from "./pages/ShippingAddress";
import PaymentMethod from "./pages/PaymentMethod";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import Inactivity from "./pages/Inactivity";
import PasswordResetEmail from "./pages/PasswordResetEmail";
import PasswordResetForm from "./pages/PasswordResetForm";
import ExpiredPasswordLink from "./pages/ExpiredPasswordLink";
import Confirmation from "./pages/Confirmation";
import OrderHistory from "./pages/OrderHistory";
import UserProfile from "./pages/UserProfile";
import DeleteAccount from "./pages/DeleteAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminNewProduct from "./pages/admin/AdminNewProduct";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserEdit from "./pages/admin/AdminUserEdit";
import Search from "./pages/Search";
import {
  selectUserAdmin,
  selectToken,
  selectTokenExpiration,
  logout,
} from "./redux/userSlice.js";
import { cartReset } from "./redux/cartSlice";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isAdmin = useSelector(selectUserAdmin);
  const tokenExpiration = useSelector(selectTokenExpiration);
  const navigate = useNavigate();

  // function defining what to do due to inactivity
  const onIdle = () => {
    if (token) {
      dispatch(cartReset());
      localStorage.removeItem("cart");
      dispatch(logout());
      navigate("/inactivity");
    }
  };

  // Method defining when to invoke the above function
  useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 15, // 15 minutes to inactivity logout
    // timeout: 1000 * 10 // test
    throttle: 500,
  });

  // Remaining time till auto logout (user privacy, in case user forgets to log out)
  // Not to be confused with inactivity logout. Auto logout is set to 2 hrs.
  let remainingTime = tokenExpiration - new Date().getTime();

  // If both variables are present, meaning user is logged in, the countdown to auto logout begins.
  if (token && tokenExpiration) {
    setTimeout(() => {
      dispatch(cartReset());
      localStorage.removeItem("cart");
      dispatch(logout());
      navigate("/login");
    }, remainingTime);
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <Layout>
        <Routes>
          <Route path="" exact element={<HomePage />} />
          <Route path="product/:slug" exact element={<Product />} />
          <Route path="cart" exact element={<Cart />} />
          <Route path="login" exact element={<Login />} />
          <Route path="register" exact element={<Register />} />
          <Route path="search" exact element={<Search />} />
          {token && (
            <Route
              path="shipping-address"
              exact
              element={<ShippingAddress />}
            />
          )}
          {token && (
            <Route path="payment-method" exact element={<PaymentMethod />} />
          )}
          {token && <Route path="place-order" exact element={<PlaceOrder />} />}
          {token && <Route path="order/:id" exact element={<Order />} />}
          {token && (
            <Route path="order-history" exact element={<OrderHistory />} />
          )}
          {token && <Route path="profile" exact element={<UserProfile />} />}
          {token && (
            <Route path="delete-account" exact element={<DeleteAccount />} />
          )}
          {token && isAdmin && (
            <Route path="admin/dashboard" exact element={<AdminDashboard />} />
          )}
          {token && isAdmin && (
            <Route path="admin/orders" exact element={<AdminOrders />} />
          )}
          {token && isAdmin && (
            <Route path="admin/products" exact element={<AdminProducts />} />
          )}
          {token && isAdmin && (
            <Route
              path="admin/new-product"
              exact
              element={<AdminNewProduct />}
            />
          )}
          {token && isAdmin && (
            <Route
              path="admin/product/:id"
              exact
              element={<AdminProductEdit />}
            />
          )}
          {token && isAdmin && (
            <Route path="admin/users" exact element={<AdminUsers />} />
          )}
          {token && isAdmin && (
            <Route path="admin/user/:id" exact element={<AdminUserEdit />} />
          )}
          <Route path="inactivity" exact element={<Inactivity />} />
          <Route
            path="password-reset-email"
            exact
            element={<PasswordResetEmail />}
          />
          <Route path="confirmation" exact element={<Confirmation />} />
          <Route
            path="password-reset-form"
            exact
            element={<PasswordResetForm />}
          />
          <Route
            path="expired-password-link"
            exact
            element={<ExpiredPasswordLink />}
          />
          <Route path="*" element={<NotFound />} />
          {/*<Route path="*" element={<Navigate replace to="" />} /> This is Catch all*/}
        </Routes>
        <ToastContainer
          className="toast-message"
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // "dark"
        />
      </Layout>
    </PayPalScriptProvider>
  );
}

export default App;

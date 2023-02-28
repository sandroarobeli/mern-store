import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/orbitron/variable.css";
import "@fontsource/inter/variable.css";

import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ShippingAddress from "./pages/ShippingAddress";
import PaymentMethod from "./pages/PaymentMethod";
import NotFound from "./pages/NotFound";
import Inactivity from "./pages/Inactivity";
import {
  selectToken,
  selectTokenExpiration,
  logout,
} from "./redux/userSlice.js";
import { cartReset } from "./redux/cartSlice";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
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
    <Layout>
      <Routes>
        <Route path="" exact element={<HomePage />} />
        <Route path="product/:slug" exact element={<Product />} />
        <Route path="cart" exact element={<Cart />} />
        <Route path="login" exact element={<Login />} />
        {token && (
          <Route path="shipping-address" exact element={<ShippingAddress />} />
        )}
        {token && (
          <Route path="payment-method" exact element={<PaymentMethod />} />
        )}
        <Route path="inactivity" exact element={<Inactivity />} />
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
        theme="dark" // "light"
      />
    </Layout>
  );
}

export default App;

import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import CheckoutWizard from "../components/CheckoutWizard";
import DialogModal from "../components/DialogModal";
import {
  selectAllItems,
  selectShippingAddress,
  selectPaymentMethod,
  clearCartError,
  clearCartItems,
} from "../redux/cartSlice";
import { selectToken } from "../redux/userSlice";
import { usePlaceOrderMutation } from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const allItems = useSelector(selectAllItems);
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [placeOrder, { isLoading }] = usePlaceOrderMutation(); // data: order comes from async

  // Auxillary rounding function
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  /* PRICING VARIABLES */
  // Sums up all the items prices times each item quantity and rounds it to 2 digits after decimal
  const itemsTotalBeforeRounding = useMemo(
    () => allItems.reduce((a, c) => a + c.quantity * c.price, 0),
    [allItems]
  );
  const itemsTotal = round2(itemsTotalBeforeRounding);
  // Tax cost is variable, depending on the jurisdiction and will be set by the user
  const taxTotal = round2(itemsTotal * 0.11);
  // Shipping and Handling cost is arbitrary and can be set at the user's discretion
  const shippingTotal = itemsTotal > 200 ? 0 : 15;
  const grandTotal = round2(itemsTotal + taxTotal + shippingTotal);

  useEffect(() => {
    if (!paymentMethod) {
      return navigate("/payment-method");
    }
  }, [navigate, paymentMethod]);

  const placeOrderHandler = async () => {
    if (!isLoading) {
      try {
        const order = await placeOrder({
          token: token,
          orderItems: allItems,
          shippingAddress,
          paymentMethod,
          itemsTotal,
          taxTotal,
          shippingTotal,
          grandTotal,
        }).unwrap();
        await dispatch(clearCartItems());
        console.log("newOrder from controller", order); // test
        navigate(`/order/${order.id}`);
      } catch (error) {
        setErrorMessage(error.data.message); // Local Error state get populated by Redux error
        setModalOpen(true);
      }
    }
  };

  const handleErrorClear = () => {
    setModalOpen(false);
    dispatch(clearCartError());
    setErrorMessage("");
  };

  return (
    <CheckoutWizard activeStep={3}>
      <DynamicTitle title="Place order" />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {allItems.length === 0 ? (
        <h4>
          Cart is empty. <Link to="/">Go shopping</Link>
        </h4>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city},{shippingAddress.state},{" "}
                {shippingAddress.zip}
              </div>
              <div>
                <Link to="/shipping-address">Edit</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link to="/payment-method">Edit</Link>
              </div>
            </div>
            <div className="card p-5 overflow-x-auto">
              <h2 className="mb-2 text-lg font-semibold">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td>
                        <Link
                          to={`/product/${item.slug}`}
                          className="flex flex-wrap items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[50px] h-[50px]"
                          />
                          &nbsp;
                          <span>{item.name}</span>
                        </Link>
                      </td>
                      <td className="p-5 text-center md:text-right">
                        {item.quantity}
                      </td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link to="/cart">Edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${grandTotal.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <button
                    className={`primary-button w-full ${
                      isLoading && "animate-pulse"
                    }`}
                    onClick={placeOrderHandler}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing.." : "Place Order"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <DialogModal
        isOpen={modalOpen} // true for testing
        onClose={handleErrorClear}
        title="Order processing error"
        description={errorMessage}
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </CheckoutWizard>
  );
}

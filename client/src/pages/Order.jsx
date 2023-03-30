import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { selectToken, selectUserAdmin } from "../redux/userSlice";
import {
  useGetOrderByIdQuery,
  useUpdatePaidStatusMutation,
  useUpdateDeliveredStatusMutation,
} from "../redux/apiSlice";

import PaypalButton from "../components/PaypalButton";
import Spinner from "../components/Spinner";
import DialogModal from "../components/DialogModal";
import DynamicTitle from "../components/DynamicTitle";

export default function Order() {
  const token = useSelector(selectToken);
  const isAdmin = useSelector(selectUserAdmin);
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data: order,
    isLoading,
    // isFetching,
    // isSuccess,
    isError,
    error: initialError,
    // refetch,
  } = useGetOrderByIdQuery({ id, token });

  const [updatePaidStatus] = useUpdatePaidStatusMutation();
  const [
    updateDeliveredStatus,
    {
      isLoading: isDeliveryLoading,
      // isError: isDeliveryError,
      // error: deliveryError
    },
  ] = useUpdateDeliveredStatusMutation();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.grandTotal },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (orderDetails) {
      try {
        await updatePaidStatus({ id: order.id, token, orderDetails }).unwrap();
        toast.success("Payment processed successfully!");
      } catch (error) {
        setErrorMessage(error);
        setModalOpen(true);
      }
    });
  };

  const onError = (error) => {
    setErrorMessage(
      error?.data?.message
        ? error.data.message
        : "An error ocurred while processing your payment. Please try again later"
    );
    setModalOpen(true);
  };

  const onCancel = () => {
    toast.success("Payment Cancelled");
  };

  const handleErrorClear = () => {
    setErrorMessage(null);
    setModalOpen(false);
  };

  const deliverOrder = async () => {
    try {
      await updateDeliveredStatus({ id: order.id, token }).unwrap();
      toast.success("Order delivery complete");
    } catch (error) {
      setErrorMessage(
        error?.data?.message
          ? error.data.message
          : "Error updating delivery status"
      );
      setModalOpen(true);
    }
  };
  // order.paymentMethod === "PayPal / Credit Card" &&
  return (
    <>
      <DynamicTitle title="Order review & payment" />
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <h2 className="alert-error">
          {initialError?.data?.message ||
            "Order cannot be displayed. Please try later"}
        </h2>
      ) : (
        <>
          <h1 className="mb-4 text-lg md:text-xl">{`Order ${id}`}</h1>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card p-5">
                <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
                <div>
                  {order.shippingAddress.fullName},{" "}
                  {order.shippingAddress.address}, {order.shippingAddress.city},
                  {order.shippingAddress.state}, {order.shippingAddress.zip}
                </div>
                {order.isDelivered ? (
                  <div className="alert-success">
                    Delivered: {new Date(order.deliveredAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="alert-error">Not delivered</div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
                <div>{order.paymentMethod}</div>
                {order.isPaid ? (
                  <div className="alert-success">
                    Paid: {new Date(order.paidAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="alert-error">Not paid</div>
                )}
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
                    {order.orderItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td>
                          <div className="flex flex-wrap items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-[50px] h-[50px]"
                            />
                            &nbsp;
                            <span>{item.name}</span>
                          </div>
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
              </div>
            </div>

            <div>
              <div className="card-p-5">
                <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>${order.itemsTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>${order.taxTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>${order.shippingTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${order.grandTotal.toFixed(2)}</div>
                    </div>
                  </li>
                  {!order.isPaid && (
                    <li>
                      <div className="w-full">
                        <PaypalButton
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          onCancel={onCancel}
                        />
                      </div>
                    </li>
                  )}
                  {isAdmin && order.isPaid && !order.isDelivered && (
                    <li>
                      <button
                        className="primary-button w-full"
                        onClick={deliverOrder}
                      >
                        {isDeliveryLoading
                          ? "Updating status.."
                          : "Deliver Order"}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Transaction Error"
        description={
          errorMessage ||
          "An error ocurred while processing your payment. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </>
  );
}

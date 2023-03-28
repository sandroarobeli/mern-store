import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetOrderHistoryQuery } from "../redux/apiSlice";
import { selectToken, selectUserId } from "../redux/userSlice";
import Spinner from "../components/Spinner";
// import DialogModal from "../components/DialogModal";

export default function OrderHistory() {
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId); // RESTORE

  const {
    data: orders,
    isLoading,
    // isFetching,
    // isSuccess,
    isError,
    error,
    // refetch,
  } = useGetOrderHistoryQuery({ token, userId });

  console.log("From History errors:", error); // test
  console.log("Order History:", orders); // test
  return (
    <div>
      <h1 className="mb-4 text-xl">Order History</h1>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <h2 className="alert-error">
          {error?.data?.message ||
            "An error ocurred while loading your order history"}
        </h2>
      ) : orders.length === 0 ? (
        <h3 className="mb-4 text-lg">No orders found for this customer</h3>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="" border-b>
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-5">{order.id.substring(20, 24)}</td>
                  <td className="p-5">
                    {new Date(order.createdAt)
                      .toLocaleString()
                      .substring(0, 11)
                      .replace(",", "")}
                  </td>
                  <td className="p-5">${order.grandTotal.toFixed(2)}</td>
                  <td className="p-5">
                    {order.isPaid
                      ? new Date(order.paidAt)
                          .toLocaleString()
                          .substring(0, 11)
                          .replace(",", "")
                      : "not paid"}
                  </td>
                  <td className="p-5">
                    {order.isDelivered
                      ? new Date(order.deliveredAt)
                          .toLocaleString()
                          .substring(0, 11)
                          .replace(",", "")
                      : "not delivered"}
                  </td>
                  <td className="p-5">
                    <Link to={`/order/${order.id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/*
<DialogModal
            isOpen={isError} // set true for testing
            onClose={refetch}
            title="An Error has ocurred"
            description={
              error?.toString()
                ? error.toString()
                : "An error ocurred while loading your order history. Please try again later"
            }
            className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
          />

*/

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // , useDispatch

import { selectToken } from "../redux/userSlice";
import { useGetOrderByIdQuery } from "../redux/apiSlice";
// import { selectShippingAddress } from "../redux/cartSlice";
import Spinner from "../components/Spinner";

export default function Order() {
  // const dispatch = useDispatch()
  const token = useSelector(selectToken);
  // const shippingAddress = useSelector(selectShippingAddress);

  const { id } = useParams();

  const {
    data: order,
    isLoading,
    // isFetching,
    isSuccess,
    isError,
    error,
    // refetch,
  } = useGetOrderByIdQuery({ id, token });

  // const { shippingAddress, isDelivered, deliveredAt } = order;
  // const { shippingAddress } = order;
  console.log("Is Loading", isLoading); // test
  console.log("FROM ORDER SCREEN", order); // test
  console.log("Is SUCCESS", isSuccess); // test
  // console.error("ERROR", error); // test

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <h2 className="alert-error">
          {error?.data?.message ||
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
                    Delivered at {order.deliveredAt}
                  </div>
                ) : (
                  <div className="alert-error">Not delivered</div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
                <div>{order.paymentMethod}</div>
                {order.isPaid ? (
                  <div className="alert-success">Paid at {order.paidAt}</div>
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
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
/*
{Date(order.deliveredAt).toLocaleString("en-US", timeZone: "CST" })}
or order.deliveredAt.toLocaleString(). MDN has all the reference
*/

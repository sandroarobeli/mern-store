import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectToken } from "../redux/userSlice";
import { useGetAdminOrdersQuery } from "../redux/apiSlice";

export default function AdminOrders() {
  const token = useSelector(selectToken);

  const {
    data: orders,
    isLoading,
    // isFetching,
    // isSuccess,
    isError,
    error,
    // refetch,
  } = useGetAdminOrdersQuery(token);

  console.log(orders); // test
  console.log(error); // test
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <div>
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/orders" className="font-bold">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto md:col-span-3">
        <h1 className="mb-4 text-xl">Admin Orders</h1>
        {isLoading ? (
          <p className="text-lg animate-pulse text-blue-800">
            Generating orders..
          </p>
        ) : isError ? (
          <div className="alert-error">
            {error?.data?.message ||
              "Orders cannot be displayed. Please try later"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">USER</th>
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
                    <td classNam="p-5">{order.id.substring(20, 24)}</td>
                    <td className="p-5">
                      {order.owner ? order.owner.name : "DELETED USER"}
                    </td>
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
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectToken } from "../../redux/userSlice";
import { useGetAdminOrdersQuery } from "../../redux/apiSlice";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import DynamicTitle from "../../components/DynamicTitle";

export default function AdminOrders() {
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [searchValue, setSearchValue] = useState("");

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useGetAdminOrdersQuery(token);

  // Sets value for filtering through existing orders
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Admin orders" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="ml-2 mb-4 text-xl">Orders</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter customer name.."
          label="Search orders"
        />
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
                {orders.map(
                  (order) =>
                    order.owner.name.toLowerCase().includes(searchValue) && (
                      <tr key={order.id} className="border-b">
                        <td className="p-5">{order.id.substring(20, 24)}</td>
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
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

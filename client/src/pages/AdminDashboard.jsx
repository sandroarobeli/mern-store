import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { selectToken } from "../redux/userSlice";
import { useGetAdminSummaryQuery } from "../redux/apiSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function AdminDashboard() {
  const token = useSelector(selectToken);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [filteredData, setFilteredData] = useState([]);

  // console.log("filtered data", filteredData); // test

  const {
    data: summary,
    isLoading,
    // isFetching,
    // isSuccess,
    isError,
    error,
    // refetch,
  } = useGetAdminSummaryQuery(token);

  // Filters summary.chartingData for the default (current) year on page load.
  // And re filters on every year change. In addition data gets sorted
  useEffect(() => {
    const filterSalesByYear = (year) => {
      setFilteredData(
        summary?.chartingData
          .filter((el) => el._id.substring(3) === year)
          .sort((a, b) => a._id.substring(0, 2) - b._id.substring(0, 2))
      );
    };
    filterSalesByYear(year);
  }, [summary?.chartingData, year]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <div>
        <ul>
          <li>
            <Link to="/admin/dashboard" className="font-bold">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
        </ul>
      </div>
      <div className="md:col-span-3">
        <h1 className="mb-4 text-xl">Admin Dashboard</h1>
        {isLoading ? (
          <p className="text-lg animate-pulse text-blue-800">
            Generating report..
          </p>
        ) : isError ? (
          <div className="alert-error">
            {error?.data?.message ||
              "Summary cannot be displayed. Please try later"}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="card m-5 p-5">
                <p className="text-3xl">
                  ${summary.ordersTotal.toLocaleString()}
                </p>
                <p>Sales</p>
                <Link to="/admin/orders">View sales</Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.ordersCount}</p>
                <p>Orders</p>
                <Link to="/admin/orders">View orders</Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.productsCount}</p>
                <p>Products</p>
                <Link to="/admin/products">View products</Link>
              </div>
              <div className="card m-5 p-5">
                <p className="text-3xl">{summary.usersCount}</p>
                <p>Users</p>
                <Link to="/admin/users">View users</Link>
              </div>
            </div>
            <div className="flex items-center">
              <h2 className="text-xl">Sales Report</h2>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="mx-4"
              >
                {["2022", "2023", "2024", "2025", "2026"].map((year) => (
                  <option
                    key={year}
                    value={year}
                    className="text-gray-900 font-semibold text-right text-sm md:text-md"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Bar
              options={{
                legend: {
                  display: true,
                  position: "right",
                },
              }}
              data={{
                labels: filteredData?.map((entry) => entry._id),
                datasets: [
                  {
                    label:
                      filteredData?.length > 0
                        ? "Sales"
                        : "No Data available for this year",
                    backgroundColor: "rgba(162, 222, 208, 1)",
                    data: filteredData?.map((entry) => entry.itemsTotal),
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useGetProductsQuery } from "../../redux/apiSlice";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import DynamicTitle from "../../components/DynamicTitle";

export default function AdminProducts() {
  const location = useLocation();
  const { pathname } = location;
  const [searchValue, setSearchValue] = useState("");

  const {
    data: products,
    isLoading,
    // isFetching,
    // isSuccess,
    isError,
    error,
    // refetch,
  } = useGetProductsQuery();

  // Sets value for filtering through existing products
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Admin products" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="mb-4 text-xl">Admin Products</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter name or category.."
          label="Search products"
        />
        {isLoading ? (
          <p className="text-lg animate-pulse text-blue-800">
            Generating products..
          </p>
        ) : isError ? (
          <div className="alert-error">
            {error?.data?.message ||
              "Products cannot be displayed. Please try later"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">NAME</th>
                  <th className="p-5 text-left">PRICE</th>
                  <th className="p-5 text-left">CATEGORY</th>
                  <th className="p-5 text-left">COUNT</th>
                  <th className="p-5 text-left">RATING</th>
                  <th className="p-5 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map(
                  (product) =>
                    (product.name.toLowerCase().includes(searchValue) ||
                      product.category.toLowerCase().includes(searchValue)) && (
                      <tr key={product.id} className="border-b">
                        <td className="p-5">{product.id.substring(20, 24)}</td>
                        <td className="p-5">{product.name}</td>
                        <td className="p-5">${product.price.toFixed(2)}</td>
                        <td className="p-5">{product.category}</td>
                        <td className="p-5">{product.inStock}</td>
                        <td className="p-5">{product.rating}</td>
                        <td className="p-5">
                          <Link to={`/admin/product/${product.id}`}>Edit</Link>
                          &nbsp;
                          <button className="text-red-500 hover:text-red-600 active:text-red-700">
                            Delete
                          </button>
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

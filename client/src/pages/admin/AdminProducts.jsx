import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import DynamicTitle from "../../components/DynamicTitle";
import DeleteModal from "../../components/DeleteModal";
import DialogModal from "../../components/DialogModal";
import Spinner from "../../components/Spinner";

export default function AdminProducts() {
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [searchValue, setSearchValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dialogModalOpen, setDialogModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteProductMutation();

  // Sets value for filtering through existing products
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleProductDelete = async () => {
    try {
      setDeleteModalOpen(false);
      await deleteProduct({ id: productToDelete, token }).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      setErrorMessage(error.data.message); // Local Error state get populated by Redux error
      setDialogModalOpen(true);
    }
  };

  const handleErrorClear = () => {
    setDialogModalOpen(false);
    setErrorMessage("");
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
        {isDeleteLoading && <Spinner />}
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
                          <button
                            className="text-red-500 hover:text-red-600 active:text-red-700"
                            onClick={() => {
                              setProductToDelete(product.id);
                              setDeleteModalOpen(true);
                            }}
                          >
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
      <DeleteModal
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onDelete={handleProductDelete}
      />
      <DialogModal
        isOpen={dialogModalOpen}
        onClose={handleErrorClear}
        title="Delete Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </div>
  );
}

import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetUsersQuery, useDeleteUserMutation } from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import DynamicTitle from "../../components/DynamicTitle";
import AdminNav from "../../components/AdminNav";
import AdminSearchBar from "../../components/AdminSearchBar";
import DeleteModal from "../../components/DeleteModal";
import DialogModal from "../../components/DialogModal";
import Spinner from "../../components/Spinner";

export default function AdminUsers() {
  const location = useLocation();
  const { pathname } = location;
  const token = useSelector(selectToken);
  const [searchValue, setSearchValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dialogModalOpen, setDialogModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: users, isLoading, isError, error } = useGetUsersQuery(token);

  const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();

  // Sets value for filtering through existing products
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleUserDelete = async () => {
    try {
      setDeleteModalOpen(false);
      await deleteUser({ id: userToDelete, token }).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      setErrorMessage(error.data.message);
      setDialogModalOpen(true);
    }
  };

  const handleErrorClear = () => {
    setDialogModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title="Admin users" />
      <AdminNav pathname={pathname} />
      <div className="overflow-x-auto md:col-span-3">
        <h1 className="mb-4 text-xl">Users</h1>
        <AdminSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          placeholder="Enter name or email.."
          label="Search users"
        />
        {isDeleteLoading && <Spinner />}
        {isLoading ? (
          <p className="text-lg animate-pulse text-blue-800">
            Generating users..
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
                  <th className="p-5 text-left">EMAIL</th>
                  <th className="p-5 text-left">ADMIN</th>
                  <th className="p-5 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user) =>
                    (user.name.toLowerCase().includes(searchValue) ||
                      user.email.toLowerCase().includes(searchValue)) && (
                      <tr key={user.id} className="border-b">
                        <td className="p-5">{user.id.substring(20, 24)}</td>
                        <td className="p-5">{user.name}</td>
                        <td className="p-5">{user.email}</td>
                        <td className="p-5">{user.isAdmin ? "YES" : "NO"}</td>
                        <td className="p-5">
                          <Link to={`/admin/user/${user.id}`}>Edit</Link>
                          &nbsp;
                          <button
                            className="text-red-500 hover:text-red-600 active:text-red-700"
                            onClick={() => {
                              setUserToDelete(user.id);
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
        onDelete={handleUserDelete}
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

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useGetUsersQuery, useUpdateUserMutation } from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import AdminNav from "../../components/AdminNav";
import DialogModal from "../../components/DialogModal";
import DynamicTitle from "../../components/DynamicTitle";

export default function AdminProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector(selectToken);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminStatus, setAdminStatus] = useState(false);

  const { handleSubmit } = useForm();

  const { user, isLoading, isError, error } = useGetUsersQuery(token, {
    selectFromResult: ({ data, isLoading, isError, error }) => ({
      // We can optionally include the other metadata fields from the result here
      isLoading: isLoading,
      isError: isError,
      error: error,
      // Include a field called `user` in the hook result object,
      // which will be a filtered user of users
      user: data?.find((user) => user.id === id),
    }),
  });

  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  useEffect(() => {
    // Pre populate the fields with user's existing data for convenience
    setAdminStatus(user.isAdmin);
  }, [user.isAdmin]);

  const userUpdateHandler = async () => {
    try {
      // Only runs if status has been changed
      if (adminStatus !== user.isAdmin) {
        await updateUser({ id: user.id, token, isAdmin: adminStatus }).unwrap();
      }
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      setErrorMessage(error.data.message); // Local Error state get populated by Redux error
      setModalOpen(true);
    }
  };

  const handleErrorClear = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title={`Edit - ${user?.name}`} />
      <AdminNav pathname="/admin/users" />
      <div className="md:col-span-3">
        {isLoading ? (
          <p className="text-lg animate-pulse text-blue-800">Loading user..</p>
        ) : isError ? (
          <div className="alert-error">
            {error?.data?.message ||
              "User cannot be displayed. Please try later"}
          </div>
        ) : (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(userUpdateHandler)}
          >
            <h1 className="mb-4 text-xl">{`Set User Admin Status for ${user?.name}`}</h1>
            <div>
              <button
                type="button"
                className={`mb-6 px-4 py-2 w-[200px] border-0 font-orbitron ${
                  adminStatus
                    ? "shadow-inner bg-amber-300 hover:bg-amber-400"
                    : "shadow bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setAdminStatus(true)}
              >
                Admin User
              </button>
            </div>
            <div>
              <button
                type="button"
                className={`mb-6 px-4 py-2 w-[200px] border-0 font-orbitron ${
                  adminStatus
                    ? "shadow bg-gray-100 hover:bg-gray-200"
                    : "shadow-inner bg-amber-300 hover:bg-amber-400"
                }`}
                onClick={() => setAdminStatus(false)}
              >
                Regular User
              </button>
            </div>
            <div className="my-6">
              <button
                className={`primary-button ${updateLoading && "animate-pulse"}`}
                disabled={updateLoading}
              >
                {updateLoading ? "Please wait.." : "Update status"}
              </button>
            </div>

            <div className="">
              <Link to="/admin/users">Back to users</Link>
            </div>
          </form>
        )}
      </div>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Update Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </div>
  );
}

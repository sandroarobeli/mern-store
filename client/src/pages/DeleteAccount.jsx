import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  selectToken,
  selectUserId,
  clearError,
  logout,
} from "../redux/userSlice";
import { useDeleteAccountMutation } from "../redux/apiSlice";
import DialogModal from "../components/DialogModal";

export default function DeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const submitHandler = async ({ email }) => {
    try {
      await deleteAccount({ userId, email, token }).unwrap();
      // Deleting User's orders will not be performed at the same time.
      // That would affect admins ability to access sales & financial stats
      dispatch(logout());
      toast.success("Account has been deleted");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.data.message); // Local Error state get populated by Redux error
      setModalOpen(true);
    }
  };

  const handleErrorClear = () => {
    setModalOpen(false);
    dispatch(clearError());
    setErrorMessage("");
    reset();
  };

  return (
    <>
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Delete Account</h1>
        <h2 className="alert-error">
          Please note, deleting this account is irreversible and cannot be
          undone! For security purposes, verify your current email.
        </h2>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className={`w-full focus:ring ${
              errors.email ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button w-[250px]" disabled={isLoading}>
            {isLoading ? "Please wait.." : "Delete Account"}
          </button>
        </div>
      </form>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Delete Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </>
  );
}

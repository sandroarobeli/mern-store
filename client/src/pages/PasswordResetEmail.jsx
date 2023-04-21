import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { clearError } from "../redux/userSlice";
import { usePasswordResetEmailMutation } from "../redux/apiSlice";
import DialogModal from "../components/DialogModal";
import DynamicTitle from "../components/DynamicTitle";

export default function PasswordResetEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const [passwordResetEmail, { isLoading }] = usePasswordResetEmailMutation();

  const submitEmailHandler = async ({ email }) => {
    try {
      await passwordResetEmail({ email }).unwrap();
      navigate("/confirmation");
    } catch (error) {
      setErrorMessage(error.data.message);
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
      <DynamicTitle title="Password reset email" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitEmailHandler)}
      >
        <h1 className="mb-4 text-xl">Reset Password</h1>
        <div className="mb-4">
          <label htmlFor="email">
            Enter email associated with this account below and we'll send you a
            link to reset your password.
          </label>
          <input
            type="email"
            className={`w-full focus:ring ${
              errors.email ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="email"
            autoFocus
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
          <button
            className={`primary-button w-[250px] ${
              isLoading && "animate-pulse"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting.." : "Submit"}
          </button>
        </div>
      </form>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Submission Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </>
  );
}

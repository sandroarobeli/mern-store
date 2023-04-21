import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useUpdatePasswordMutation } from "../redux/apiSlice";
import { clearError } from "../redux/userSlice";
import DialogModal from "../components/DialogModal";
import DynamicTitle from "../components/DynamicTitle";

export default function PasswordResetForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const updatePasswordHandler = async ({ email, password }) => {
    if (email && password) {
      try {
        await updatePassword({ email, password }).unwrap();
        toast.success("Update Successful!");
        navigate("/login");
      } catch (error) {
        setErrorMessage(error.data.message);
        setModalOpen(true);
      }
    }
  };

  const handleErrorClear = () => {
    setModalOpen(false);
    setPasswordVisible(false);
    dispatch(clearError());
    setErrorMessage("");
    reset();
  };

  return (
    <>
      <DynamicTitle title="Password reset form" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(updatePasswordHandler)}
      >
        <h1 className="mb-4 text-xl">Update Password</h1>
        <div className="mb-4">
          <label htmlFor="email">Current Email</label>
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
          <label htmlFor="password">New Password</label>
          <input
            type={`${passwordVisible ? "text" : "password"}`}
            className={`w-full focus:ring ${
              errors.password ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="password"
            autoFocus
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password must be minimum 6 characters long",
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type={`${passwordVisible ? "text" : "password"}`}
            className={`w-full focus:ring ${
              errors.confirmPassword ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Password must be minimum 6 characters long",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500">Passwords do not match</div>
            )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            onChange={() =>
              setPasswordVisible((passwordVisible) => !passwordVisible)
            }
            id="showPassword"
            className="w-5 h-5 mr-2 cursor-pointer"
          />{" "}
          <label htmlFor="showPassword">Show password</label>
        </div>
        <div className="mb-4">
          <button
            className={`primary-button w-[250px] ${
              isLoading && "animate-pulse"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Updating.." : "Update"}
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

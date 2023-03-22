import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  selectUserName,
  selectUserEmail,
  selectToken,
  clearError,
} from "../redux/userSlice";
import {
  useUpdateProfileMutation,
  useCredentialLoginMutation,
} from "../redux/apiSlice";
import DialogModal from "../components/DialogModal";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);
  const token = useSelector(selectToken);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [updateProfile, { data: updatedUser, isLoading }] =
    useUpdateProfileMutation();
  const [credentialLogin] = useCredentialLoginMutation();

  console.log("Updated Profile", updatedUser);

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    // Pre populate the fields with user's existing data for convenience
    setValue("name", name);
    setValue("email", email);
  }, [email, name, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await updateProfile({ name, email, password, token }).unwrap();
      // And re-login with new credentials..
      await credentialLogin({
        email: email,
        // Here I need to enter yet unencrypted password, so login controller can encrypt it!
        password: password,
      }).unwrap();

      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.data.message); // Local Error state get populated by Redux error
      setModalOpen(true);
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
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className={`w-full focus:ring ${
              errors.name ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
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
          <label htmlFor="password">Password</label>
          <input
            type={`${passwordVisible ? "text" : "password"}`}
            className={`w-full focus:ring ${
              errors.password ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="password"
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
          <label htmlFor="confirmPassword">Confirm Password</label>
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
          <button className="primary-button w-[250px]" disabled={isLoading}>
            {isLoading ? "Please wait.." : "Update Profile"}
          </button>
        </div>
        <div className="mb-4">
          <button
            className="error-button w-[250px]"
            type="button"
            onClick={() => navigate("/delete-account")}
          >
            Delete Account
          </button>
        </div>
      </form>
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
    </>
  );
}

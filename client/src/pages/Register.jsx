import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { clearError, selectToken } from "../redux/userSlice";
import {
  useCredentialRegisterMutation,
  useGoogleRegisterMutation,
} from "../redux/apiSlice";
import DialogModal from "../components/DialogModal";

export default function Register() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const whence = params.get("redirect");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [googleRegister, { data: googleUser }] = useGoogleRegisterMutation();
  const [credentialRegister, { data: credentialUser, isLoading }] =
    useCredentialRegisterMutation();

  console.log("googleUser", googleUser); // test
  console.log("credentialUser", credentialUser); // test

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    if (token) {
      navigate(whence || "/");
    }
  }, [navigate, token, whence]);

  const submitWithCredentialsHandler = async ({ name, email, password }) => {
    if (name && email && password && !isLoading) {
      try {
        await credentialRegister({ name, email, password }).unwrap();
      } catch (error) {
        console.log(error); // test
        setErrorMessage(error.data.message); // Local Error state get populated by Redux error
        setModalOpen(true);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGoogleRegister = async (googleResponse) => {
    try {
      const userData = await googleRegister({
        credential: googleResponse.credential,
      }).unwrap();
      // Non status-500 error. for example, google user trying in is not
      // in the DB and gets prompted to sign up
      if (!userData) {
        throw new Error(userData.message);
      }
      console.log("google register userData", userData); // test
    } catch (error) {
      setErrorMessage(error.data.message); // Local Error state get populated by Redux error
      setModalOpen(true);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleRegister,
      });

      google.accounts.id.renderButton(document.getElementById("signUpDiv"), {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "rectangular",
        logo_alignment: "center",
        width: 250,
      });

      // google.accounts.id.prompt()
    }
  }, [handleGoogleRegister]);

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
        onSubmit={handleSubmit(submitWithCredentialsHandler)}
      >
        <h1 className="mb-4 text-xl">Create Account</h1>
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
            {isLoading ? "Please wait.." : "Register"}
          </button>
        </div>
        <div className="mb-4">
          Already have an account? &nbsp;
          <Link to="/login">Login</Link>
        </div>
      </form>
      <div className="mx-auto max-w-screen-md mb-4 flex justify-between items-center">
        <span className="h-0.5 w-1/2 mr-3 bg-gray-200"></span>
        <span>or</span>
        <span className="h-0.5 w-1/2 ml-3 bg-gray-200"></span>
      </div>
      <div className="mx-auto mt-8 max-w-screen-md">
        <button id="signUpDiv" data-text="signup_with"></button>
      </div>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Registration Error"
        description={errorMessage}
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </>
  );
}

/* TEMPLATE FOR PASSWORD RESET
Check your inbox // h3  Deletemelater69
We've sent an email with a link to reset your password. If you don't receive an email within a few minutes, then check your spam and junk folders. // p

 */

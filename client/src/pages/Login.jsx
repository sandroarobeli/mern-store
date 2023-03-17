import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";

import {
  // login,
  clearError,
  // selectUserStatus,
  selectToken,
} from "../redux/userSlice";
import {
  useGoogleLoginMutation,
  useCredentialLoginMutation,
} from "../redux/apiSlice";
import DialogModal from "../components/DialogModal";

export default function Login() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const whence = params.get("redirect");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [googleLogin, { data: googleUser }] = useGoogleLoginMutation();
  const [credentialLogin, { data: credentialUser, isLoading }] =
    useCredentialLoginMutation();

  console.log("googleUser", googleUser); // test
  console.log("credentialUser", credentialUser); // test

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  // IF LOGGED IN (THERE IS ACTIVE SESSION), ==> REDIRECT TO whence (IF COMING FROM CART),
  // OTHERWISE, ==> REDIRECT TO HOME (IF COMING FROM SOMEWHERE ELSE) LIKE
  // IF I WENT TO THE STORE AND INSTEAD OF BROWSING FIRST, WENT STRAIGHT TO LOGIN PAGE
  // NOTE: HANDLES CREDENTIALS LOGIN
  useEffect(() => {
    if (token) {
      console.log("session token: ", token);
      navigate(whence || "/"); // OR router.push(whence || '/')
    }
  }, [navigate, token, whence]);

  const submitWithCredentialsHandler = async ({ email, password }) => {
    if (email && password && !isLoading) {
      try {
        await credentialLogin({ email, password }).unwrap();
      } catch (error) {
        setErrorMessage(error.data.message); // Local Error state get populated by Redux error
        setModalOpen(true);
      }
    }
  };
  // NOTE: action.payload === error

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGoogleLogin = async (googleResponse) => {
    try {
      const userData = await googleLogin({
        credential: googleResponse.credential,
      }).unwrap();
      // Non status-500 error. for example, google user trying in is not
      // in the DB and gets prompted to sign up
      if (!userData) {
        throw new Error(userData.message);
      }
      // await credentialLogin({
      //   email: userData.email,
      //   password: bcrypt.hashSync("123456"), // some default password for google logged in users
      // }).unwrap();
      // Status-500 error presumably
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
        callback: handleGoogleLogin,
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "center",
        width: 250,
      });

      // google.accounts.id.prompt()
    }
  }, [handleGoogleLogin]);

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
        onSubmit={handleSubmit(submitWithCredentialsHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className={`w-full focus:ring ${
              errors.email ? "ring-red-500" : "ring-indigo-300"
            }`}
            id="email"
            autoFocus // First field gets autoFocus
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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
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
          <Link to="/password-reset-email" className="text-xs">
            Forgot password?
          </Link>
        </div>
        <div className="mb-4">
          <button className="primary-button w-[250px]" disabled={isLoading}>
            {isLoading ? "Please wait.." : "Login"}
          </button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          {/* If we end up registering via page other than home, we return to that page */}
          <Link to={`/register?redirect=${whence || "/"}`}>Register</Link>
        </div>
      </form>
      <div className="mx-auto max-w-screen-md mb-4 flex justify-between items-center">
        <span className="h-0.5 w-1/2 mr-3 bg-gray-200"></span>
        <span>or</span>
        <span className="h-0.5 w-1/2 ml-3 bg-gray-200"></span>
      </div>
      <div className="mx-auto mt-8 max-w-screen-md">
        <button id="signInDiv" data-text="signin_with"></button>
      </div>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Login Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </>
  );
}

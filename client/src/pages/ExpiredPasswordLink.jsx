import { Link } from "react-router-dom";

import DynamicTitle from "../components/DynamicTitle";

export default function ExpiredPasswordLink() {
  return (
    <div className="mx-auto">
      <DynamicTitle title="Expired link" />
      <h3 className="mb-4 text-gray-900 text-lg md:text-2xl">
        This link has expired. Please resubmit your email and follow the link
        within the next 15 minutes.
      </h3>
      <Link
        to="/password-reset-email"
        className="primary-button mb-6 text-black hover:text-black active:text-black"
      >
        Reset Password
      </Link>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectShippingAddress,
  selectPaymentMethod,
  savePaymentMethod,
} from "../redux/cartSlice";
import CheckoutWizard from "../components/CheckoutWizard";
import DialogModal from "../components/DialogModal";
import DynamicTitle from "../components/DynamicTitle";

export default function PaymentMethod() {
  const dispatch = useDispatch();
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { handleSubmit, register, setValue } = useForm();

  useEffect(() => {
    if (!shippingAddress.address) {
      return navigate("/shipping-address");
    }
    // Pre populate the fields with user's existing data for convenience
    setValue("localPaymentMethod", paymentMethod || "");
  }, [navigate, paymentMethod, setValue, shippingAddress]);

  const submitHandler = ({ localPaymentMethod }) => {
    if (!localPaymentMethod) {
      return setModalOpen(true);
    }
    dispatch(savePaymentMethod(localPaymentMethod));
    // Redirection to final place-order screen
    navigate("/place-order");
  };

  return (
    <CheckoutWizard activeStep={2}>
      <DynamicTitle title="Payment method" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["PayPal / Credit Card", "Cash on delivery"].map((payment) => (
          <div key={payment} className="mb-4">
            <label htmlFor={payment} className="p-2">
              {payment}
            </label>
            <input
              value={payment}
              name="paymentMethod"
              type="radio"
              className="p-2 outline-none focus:ring-0 ring-indigo-300"
              id={payment}
              {...register("localPaymentMethod", {
                onChange: (e) => setValue("localPaymentMethod", e.target.value),
              })}
            />
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <Link
            to="/shipping-address"
            className="default-button text-black hover:text-black active:text-black"
          >
            Back
          </Link>
          <button className="primary-button">Next</button>
        </div>
      </form>
      <DialogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Selection Fail"
        description="Payment method is required"
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </CheckoutWizard>
  );
}

import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PaypalButton({ createOrder, onApprove, onError }) {
  return (
    <PayPalButtons
      style={{
        tagline: false,
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}

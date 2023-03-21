import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PaypalButton({
  createOrder,
  onApprove,
  onError,
  onCancel,
}) {
  return (
    <PayPalButtons
      style={{
        tagline: false,
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
      onCancel={onCancel}
    />
  );
}

import DynamicTitle from "../components/DynamicTitle";

export default function Confirmation() {
  return (
    <div className="mx-auto">
      <DynamicTitle title="Confirmation" />
      <h3 className="text-blue-600 text-xl md:text-2xl">Check your inbox</h3>
      <p className="mb-4 text-gray-900">
        We've sent an email with a link to reset your password. If you don't
        receive an email within a few minutes, then check your spam and junk
        folders. Otherwise you might have signed up with a different address.
        The link will remain active for 15 minutes.
      </p>
    </div>
  );
}

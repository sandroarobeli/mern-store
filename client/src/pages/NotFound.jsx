import DynamicTitle from "../components/DynamicTitle";

export default function NotFound() {
  return (
    <div className="mx-auto px-12 mt-[35vh] text-center">
      <DynamicTitle title="Page not found" />
      <div className="flex items-center justify-center font-orbitron">
        <span className="text-gray-900 text-2xl md:text-4xl">404</span>
        <span className="text-gray-700 border-l-2 border-gray-700 h-9 md:h-12 mx-3 md:mx-4"></span>
        <span className="text-gray-900 text-lg md:text-2xl">
          This page could not be found.
        </span>
      </div>
    </div>
  );
}

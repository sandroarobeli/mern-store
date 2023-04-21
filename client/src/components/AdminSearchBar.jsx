import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AdminSearchBar({
  value,
  onChange,
  placeholder,
  label,
}) {
  return (
    <div className="ml-2 mb-4">
      <label htmlFor="search" className="mr-2">
        {label}
      </label>
      <div className="flex items-center">
        <input
          className="focus:ring ring-indigo-300"
          type="text"
          id="search"
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <i className="-ml-8 text-gray-400">
          <MagnifyingGlassIcon />
        </i>
      </div>
    </div>
  );
}

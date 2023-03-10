import ProductItem from "../components/ProductItem";
import DialogModal from "../components/DialogModal";
import Spinner from "../components/Spinner";
import { useGetProductsQuery } from "../redux/apiSlice";

export default function Home() {
  const {
    data: products,
    isLoading,
    // isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetProductsQuery();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {isLoading && <Spinner />}
      {isSuccess &&
        products.map((product) => (
          <ProductItem product={product} key={product.slug} />
        ))}
      <DialogModal
        isOpen={isError} // set true for testing
        onClose={refetch}
        title="An Error has ocurred"
        description={
          error?.toString()
            ? error.toString()
            : "Unknown error has ocurred. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </div>
  );
}

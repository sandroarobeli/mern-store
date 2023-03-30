import ProductItem from "../components/ProductItem";
import Spinner from "../components/Spinner";
import { useGetProductsQuery } from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";

export default function Home() {
  const {
    data: products,
    isLoading,
    // isFetching,
    isSuccess,
    isError,
    error,
    // refetch,
  } = useGetProductsQuery();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <DynamicTitle title="Home" />
      {isLoading && <Spinner />}
      {isError && (
        <div className="alert-error">
          {error?.data?.message ||
            "Unknown error has ocurred. Please try again later."}
        </div>
      )}
      {isSuccess &&
        products.map((product) => (
          <ProductItem product={product} key={product.slug} />
        ))}
    </div>
  );
}

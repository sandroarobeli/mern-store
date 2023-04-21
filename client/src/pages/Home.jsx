import ProductItem from "../components/ProductItem";
import Spinner from "../components/Spinner";
import { useGetProductsQuery } from "../redux/apiSlice";
import DynamicTitle from "../components/DynamicTitle";
import CarouselSlideshow from "../components/Carousel";

export default function Home() {
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery();

  return (
    <div>
      <DynamicTitle title="Home" />
      <CarouselSlideshow products={products} />
      {isLoading && <Spinner />}
      {isError && (
        <div className="alert-error">
          {error?.data?.message ||
            "Unknown error has ocurred. Please try again later."}
        </div>
      )}
      {isSuccess && (
        <>
          <h2 className="mb-4">Latest Products</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products?.map((product) => (
              <ProductItem product={product} key={product.slug} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

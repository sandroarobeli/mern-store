import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useGetProductsQuery } from "../redux/apiSlice";
import AddToCartButton from "../components/AddToCartButton";

export default function Product() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { product } = useGetProductsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      product: data?.find((product) => product.slug === slug),
    }),
  });

  useEffect(() => {
    if (!product) {
      return navigate("/");
    }
  }, [navigate, product]);

  return (
    <>
      <div>
        <div className="py-2">
          <Link to="/" className="font-semibold">
            Back to products
          </Link>
        </div>

        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-[560px] h-[560px] object-cover rounded-t"
            />
          </div>
          <div>
            <ul className="mb-2">
              <li>
                <h1 className="text-lg">{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>
                {product.rating} of {product.reviews} reviews
              </li>
              <li>Description: {product.description}</li>
            </ul>
          </div>
          <div>
            <div className="card p-5">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>${product.price}</div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                <div>{product.inStock > 0 ? "In stock" : "Sold out"}</div>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

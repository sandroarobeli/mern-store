import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

import AddToCartButton from "./AddToCartButton";

export default function ProductItem({ product }) {
  return (
    <div
      className={`card ${
        product.inStock === 0 && "opacity-75 pointer-events-none relative"
      }`}
    >
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-t shadow h-[330px] w-full object-cover"
        />
        {product.inStock === 0 ? (
          <h3 className="text-5xl text-amber-500 font-extrabold absolute left-0 right-0 top-1/3 text-center z-50">
            SOLD OUT
          </h3>
        ) : null}
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link to={`/product/${product.slug}`} className="text-center">
          <h2 className="text-lg">{product.name}</h2>
          <Rating
            initialValue={product.rating}
            allowFraction
            readonly
            fillColor="#fcd34d"
            size={25}
            SVGstyle={{ display: "inline" }}
          />
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price.toFixed(2)}</p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}

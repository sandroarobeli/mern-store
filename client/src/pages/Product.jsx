import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";

import {
  useGetProductsQuery,
  useGetCommentsQuery,
  usePostCommentsMutation,
} from "../redux/apiSlice";
import { selectToken } from "../redux/userSlice";
import AddToCartButton from "../components/AddToCartButton";
import DynamicTitle from "../components/DynamicTitle";
import DialogModal from "../components/DialogModal";

export default function Product() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const token = useSelector(selectToken);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showReviews, setShowReviews] = useState(true);

  const { product } = useGetProductsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      product: data?.find((product) => product.slug === slug),
    }),
  });

  const {
    data: comments,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCommentsQuery(product.id);

  const [postComments, { isLoading: submitLoading }] =
    usePostCommentsMutation();

  useEffect(() => {
    if (!product) {
      return navigate("/");
    }
  }, [navigate, product]);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await postComments({ id: product.id, token, content, rating }).unwrap();
      toast.success("Review added");
      setContent("");
      setRating(0);
    } catch (error) {
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  const handleErrorClear = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div>
      <DynamicTitle title={product.name || "Product Page"} />
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
              className="w-[500px] h-[500px] object-cover rounded-t"
            />
            {/* REVIEWS GO HERE */}
            <ul className="">
              {/* Section header */}
              <li className="mb-2">
                {isError ? (
                  <div className="alert-error">
                    {error?.data?.message ||
                      "Unknown error has ocurred. Unable to display comments"}
                  </div>
                ) : (
                  <h2 name="reviews" id="reviews" className="text-xl">
                    {isLoading ? (
                      "Loading reviews.."
                    ) : (
                      <div className="flex">
                        Customer Reviews
                        <button
                          className="ml-4 font-orbitron text-gray-400 hover:text-gray-500 active:text-gray-600"
                          onClick={() =>
                            setShowReviews((prevState) => !prevState)
                          }
                        >
                          {showReviews ? <span>Hide</span> : <span>Show</span>}
                        </button>
                      </div>
                    )}
                  </h2>
                )}
              </li>
              {/* List of reviews, if any */}
              {isSuccess ? (
                product.reviews === 0 ? (
                  <li className="mb-2 text-lg">No reviews</li>
                ) : (
                  comments?.map((comment) => (
                    <li
                      key={comment.id}
                      className={`mb-2 flex ${
                        showReviews ? "block" : "hidden"
                      }`}
                    >
                      <div className="mr-4 pr-4 border-r-2 border-gray-300">
                        <h3 className="font-bold">{comment.authorName}</h3>
                        <h4>
                          {new Date(comment.createdAt)
                            .toLocaleString()
                            .substring(0, 11)
                            .replace(",", "")}
                        </h4>
                      </div>
                      <div>
                        <Rating
                          initialValue={comment.rating}
                          allowFraction
                          readonly
                          fillColor="#fcd34d"
                          size={15}
                          SVGstyle={{ display: "inline" }}
                        />
                        {/* className="max-w-screen-md" */}
                        <p>{comment.content}</p>
                      </div>
                    </li>
                  ))
                )
              ) : null}

              {/* Review form, if user is logged in. Otherwise login link */}
              <li className="mb-2">
                {token ? (
                  <form
                    onSubmit={submitHandler}
                    className="md:ml-8 flex flex-col"
                  >
                    <label htmlFor="review" className="my-2 text-xl">
                      Leave your review
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      rows="2"
                      className="mb-2 focus:ring ring-indigo-300"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                    />
                    <Rating
                      onClick={(rate) => setRating(rate)}
                      initialValue={rating}
                      allowFraction
                      fillColor="#fcd34d"
                      size={30}
                      SVGstyle={{ display: "inline" }}
                      className="mb-2"
                    />
                    <button
                      type="submit"
                      className={`mb-8 primary-button ${
                        submitLoading && "animate-pulse"
                      }`}
                      disabled={submitLoading}
                    >
                      {submitLoading ? "Submitting.." : "Submit"}
                    </button>
                  </form>
                ) : (
                  <h2>
                    Please{" "}
                    <Link to={`/login?redirect=/product/${product.slug}`}>
                      login
                    </Link>{" "}
                    to write a review
                  </h2>
                )}
              </li>
            </ul>
          </div>

          <div>
            <ul className="mb-2">
              <li>
                <h1 className="text-lg">{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>
                <Rating
                  initialValue={Number.parseFloat(product.rating).toFixed(1)}
                  allowFraction
                  readonly
                  fillColor="#fcd34d"
                  size={25}
                  SVGstyle={{ display: "inline" }}
                />
                <a
                  href="#reviews"
                  className={`${
                    product.reviews === 0
                      ? "text-gray-300 hover:text-gray-400 active:text-gray-500"
                      : "text-amber-300 hover:text-amber-400 active:text-amber-500"
                  }`}
                >
                  ({product.reviews} reviews)
                </a>
              </li>
              <li>Description: {product.description}</li>
            </ul>
          </div>
          <div>
            <div className="card p-5">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>${product.price.toFixed(2)}</div>
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
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Submission Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </div>
  );
}

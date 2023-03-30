import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import AdminNav from "../../components/AdminNav";
import DialogModal from "../../components/DialogModal";
import DynamicTitle from "../../components/DynamicTitle";

export default function AdminProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector(selectToken);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    // getValues,
    setValue,
    // reset,
  } = useForm();

  const { product, isLoading, isError, error } = useGetProductsQuery(
    undefined,
    {
      selectFromResult: ({ data, isLoading, isError, error }) => ({
        // We can optionally include the other metadata fields from the result here
        isLoading: isLoading,
        isError: isError,
        error: error,
        // Include a field called `product` in the hook result object,
        // which will be a filtered product of products
        product: data?.find((product) => product.id === id),
      }),
    }
  );

  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  useEffect(() => {
    if (!product) {
      toast.error("Product no found!");
      return navigate("/admin/products");
    }
  }, [navigate, product]);

  useEffect(() => {
    // Pre populate the fields with product's existing data for convenience
    setValue("name", product.name);
    setValue("slug", product.slug);
    setValue("price", product.price);
    setValue("image", product.image);
    // setValue("featuredImage", product.featuredImage); // Available later
    setValue("category", product.category);
    setValue("brand", product.brand);
    setValue("inStock", product.inStock);
    setValue("description", product.description);
  }, [product, setValue]);

  const productUpdateHandler = async ({
    name,
    slug,
    price,
    image,
    category,
    brand,
    inStock,
    description,
  }) => {
    try {
      await updateProduct({
        id: product.id,
        token,
        name,
        slug,
        price: parseFloat(price),
        image,
        category,
        brand,
        inStock: parseInt(inStock),
        description,
      }).unwrap();
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      setErrorMessage(error.data.message); // Local Error state get populated by Redux error
      setModalOpen(true);
    }
  };

  const handleErrorClear = () => {
    setModalOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
      <DynamicTitle title={`Profile - ${product.name}`} />
      <AdminNav pathname="/admin/products" />
      <div className="md:col-span-3">
        {isLoading ? (
          <p className="text-lg animate-pulse text-blue-800">
            Loading product..
          </p>
        ) : isError ? (
          <div className="alert-error">
            {error?.data?.message ||
              "Product cannot be displayed. Please try later"}
          </div>
        ) : (
          <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(productUpdateHandler)}
          >
            <h1 className="mb-4 text-xl">{`Edit Product ${product.id}`}</h1>
            <div className="mb-4">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.name ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="name"
                autoFocus
                {...register("name", {
                  required: "Product name must be present",
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.slug ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="slug"
                {...register("slug", {
                  required: "Product slug must be present",
                })}
              />
              {errors.slug && (
                <div className="text-red-500">{errors.slug.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.price ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="price"
                {...register("price", {
                  required: "Product price must be present",
                })}
              />
              {errors.price && (
                <div className="text-red-500">{errors.price.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="image">Image</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.image ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="image"
                {...register("image", {
                  required: "Product image must be present",
                })}
              />
              {errors.image && (
                <div className="text-red-500">{errors.image.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.category ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="category"
                {...register("category", {
                  required: "Product category must be present",
                })}
              />
              {errors.category && (
                <div className="text-red-500">{errors.category.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.brand ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="brand"
                {...register("brand", {
                  required: "Product brand must be present",
                })}
              />
              {errors.brand && (
                <div className="text-red-500">{errors.brand.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="inStock">Stock Count</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.inStock ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="inStock"
                {...register("inStock", {
                  required: "Product stock count must be present",
                })}
              />
              {errors.inStock && (
                <div className="text-red-500">{errors.inStock.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className={`w-full focus:ring ${
                  errors.description ? "ring-red-500" : "ring-indigo-300"
                }`}
                id="description"
                {...register("description", {
                  required: "Product description must be present",
                })}
              />
              {errors.description && (
                <div className="text-red-500">{errors.description.message}</div>
              )}
            </div>
            <div className="mb-4">
              <button
                className="primary-button w-[250px]"
                disabled={updateLoading}
              >
                {updateLoading ? "Please wait.." : "Update Product"}
              </button>
            </div>
            <div className="mb-4">
              <Link to="/admin/products">Back to products</Link>
            </div>
          </form>
        )}
      </div>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Update Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </div>
  );
}

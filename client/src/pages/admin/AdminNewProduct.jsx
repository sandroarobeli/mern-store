import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useGetSignatureQuery,
  useUploadImageMutation,
  useCreateProductMutation,
} from "../../redux/apiSlice";
import { selectToken } from "../../redux/userSlice";
import AdminNav from "../../components/AdminNav";
import DynamicTitle from "../../components/DynamicTitle";
import DialogModal from "../../components/DialogModal";

export default function AdminNewProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
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

  const {
    data: credentials,
    isError: isSignatureError,
    error: signatureError,
  } = useGetSignatureQuery(token);

  const [
    uploadImage,
    {
      // data: imageOnCloud,
      isLoading: isUploading,
      // isSuccess: uploadSuccess,
      isError: isUploadError,
      // error: uploadError,
    },
  ] = useUploadImageMutation();

  const [createProduct, { isLoading: createLoading }] =
    useCreateProductMutation();

  const imageUploadHandler = async (event, imageField = "image") => {
    try {
      // api call to to receive signature & timestamp credentials
      if (isSignatureError) {
        setErrorMessage(signatureError.data.message);
        setModalOpen(true);
      }
      // Capture the file from PC and prep formData object
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", credentials.signature);
      formData.append("timestamp", credentials.timestamp);
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
      // api call to upload the image  to Cloudinary and receive new image
      const imageOnCloud = await uploadImage(formData).unwrap();
      if (isUploadError) {
        setErrorMessage(
          "Error ocurred while uploading the image. Please try again later."
        );
        setModalOpen(true);
      }
      console.log("imageOnCloud from Create", imageOnCloud); // test
      // Change url in image field from old to new url from cloudinary
      if (imageOnCloud) {
        setValue(imageField, imageOnCloud.secure_url);
        toast.success("Image upload successful");
      }
    } catch (error) {
      console.log("error from catch", error);
      setErrorMessage(error.data.message);
      setModalOpen(true);
    }
  };

  const productCreateHandler = async ({
    name,
    slug,
    category,
    image,
    price,
    brand,
    inStock,
    description,
  }) => {
    try {
      await createProduct({
        token,
        name,
        slug,
        category,
        image,
        price: parseFloat(price),
        brand,
        inStock: parseInt(inStock),
        description,
      }).unwrap();
      toast.success("Product created successfully");
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
      <DynamicTitle title="Admin new product" />
      <AdminNav pathname={pathname} />
      <div className="md:col-span-3">
        <form
          className="mx-auto max-w-screen-md"
          onSubmit={handleSubmit(productCreateHandler)}
        >
          <h1 className="mb-4 text-xl">Create new product</h1>
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
                required: "Please enter product name",
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
                required: "Please enter product slug",
              })}
            />
            {errors.slug && (
              <div className="text-red-500">{errors.slug.message}</div>
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
                required: "Please enter product category",
              })}
            />
            {errors.category && (
              <div className="text-red-500">{errors.category.message}</div>
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
                required: "Please upload the product image",
              })}
            />
            {errors.image && (
              <div className="text-red-500">{errors.image.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="imageFile">Upload image</label>
            <input
              type="file"
              className="w-full"
              id="imageFile"
              onChange={imageUploadHandler}
            />
            {isUploading && (
              <div className="animate-pulse text-blue-800">Uploading..</div>
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
                required: "Please enter product price",
              })}
            />
            {errors.price && (
              <div className="text-red-500">{errors.price.message}</div>
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
                required: "Please enter product brand",
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
                required: "Please enter product stock count",
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
                required: "Please enter product description",
              })}
            />
            {errors.description && (
              <div className="text-red-500">{errors.description.message}</div>
            )}
          </div>
          <div className="mb-4">
            <button
              className={`primary-button w-[250px] ${
                createLoading && "animate-pulse"
              }`}
              disabled={createLoading}
            >
              {createLoading ? "Please wait.." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
      <DialogModal
        isOpen={modalOpen}
        onClose={handleErrorClear}
        title="Create Error"
        description={
          errorMessage ||
          "An error ocurred while submitting your request. Please try again later"
        }
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 error-button"
      />
    </div>
  );
}

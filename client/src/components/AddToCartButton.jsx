import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { cartAddItem, selectAllItems } from "../redux/cartSlice";
import { useGetProductsQuery } from "../redux/apiSlice";
import DialogModal from "./DialogModal";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const allItems = useSelector(selectAllItems);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { slug } = product;
  const [modalOpen, setModalOpen] = useState(false);

  /* 
  IMPORTANT! THIS GET QUANTITY HAPPENS EVERY CLICK TO MAKE SURE 
  THERE IS MOST UP TO DATE QUANTITY AVAILABLE. OTHER USERS MAYBE SHOPPING
  AND BUYING PRODUCTS AT THE SAME TIME AND THAT AFFECTS ACTUAL AVAILABLE QUANTITY 
  */
  const { currentlyUnsoldProduct, refetch, isFetching } = useGetProductsQuery(
    undefined,
    {
      selectFromResult: ({ data, isFetching }) => ({
        currentlyUnsoldProduct: data?.find((product) => product.slug === slug),
        isFetching: isFetching,
      }),
    }
  );

  console.log("from addToCartButton:");
  console.log("product", currentlyUnsoldProduct); // test
  console.log("isFetching", isFetching); // test

  const addToCartHandler = async () => {
    // refetch here so nothing gets added before unsold quantity is determined!
    refetch();
    const existingItem = allItems.find((item) => item.slug === product.slug);
    // If item is already in the cart, we increment, otherwise we add 1
    const quantityChosen = existingItem ? existingItem.quantity + 1 : 1;
    // Quantity chosen cannot exceed available stock
    // In case while user is browsing, someone buys the product and the current quantity
    // Drops to zero, I am using very current quantity of products via DB call
    if (currentlyUnsoldProduct.inStock < quantityChosen) {
      setModalOpen(true);
      return;
    }
    // Payload is selected products with added property: quantity
    await dispatch(cartAddItem({ ...product, quantity: quantityChosen }));
    // Deploy a mini modal to show user a product has been added
    toast.success(`${product.name} has been added!`);
    // Redirect user to cart page only if added via Product.jsx, otherwise keep'em at home page
    if (pathname !== "/") {
      navigate("/cart");
    }
  };

  return (
    <>
      <button
        className="primary-button w-full"
        onClick={addToCartHandler}
        disabled={isFetching}
      >
        Add to Cart
      </button>
      <DialogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Out of Stock!"
        description="Order exceeded currently available quantity"
        className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-gray-900 primary-button"
      />
    </>
  );
}

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { selectAllItems } from "../redux/cartSlice";

export default function QuantityBadge() {
  const allItems = useSelector(selectAllItems);
  // Initialize the state so the server side delay doesn't cause mismatch in hydration
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(allItems.reduce((a, c) => a + c.quantity, 0));
  }, [allItems]);

  return (
    <>
      {cartItemsCount > 0 && (
        <span className="ml-1 rounded-full bg-red-600 px-4 py-1 text-xs font-bold text-white">
          {cartItemsCount}
        </span>
      )}
    </>
  );
}

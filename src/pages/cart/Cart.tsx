import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, upsertCartItem } from "../../api/cart";
import LoginDialog from "../../components/LoginDialog";
import { AuthContext } from "../../context/AuthContext";
import { CartResponse } from "../../types/cart/CartResponse";

const Cart = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { token, user } = authContext || {};

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(true);
  const [updatingItem, setUpdatingItem] = useState<{
    id: number;
    type: "plus" | "minus" | "delete";
  } | null>(null);

  useEffect(() => {
    if (token && user?.id) {
      fetchCart();
    }
  }, [token, user?.id]);

  const fetchCart = async () => {
    setSkeletonLoading(true);
    try {
      const response = await getCart(user!.id);
      setCart(response);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setSkeletonLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    productId: number,
    quantity: number,
    type: "plus" | "minus" | "delete"
  ) => {
    if (quantity < 0) return;
    setUpdatingItem({ id: productId, type });
    try {
      await upsertCartItem(user!.id, productId, quantity);
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.cartItems
          .map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        return { ...prevCart, cartItems: updatedItems, totalPrice };
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  if (!token) {
    return (
      <LoginDialog
        open={true}
        onClose={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  if (skeletonLoading) {
    const isMobile = window.innerWidth <= 600;
    return (
      <div className="container mx-auto mt-5">
        <h2 className="text-2xl font-bold text-center mb-3">
          Your Shopping Cart
        </h2>
        {isMobile ? (
          <div className="max-w-480 mx-auto pb-8">
            {/* Card skeletons for cart items */}
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-start mb-2 p-2 border rounded-3 gap-2 min-h-[100px]"
              >
                <div className="skeleton w-80 h-80 rounded-2 mr-2" />
                <div className="flex-1 min-w-0">
                  <div className="skeleton w-70 h-20 rounded-2 mb-1" />
                  <div className="skeleton w-40 h-16 rounded-2 mb-1" />
                  <div className="skeleton w-100 h-32 rounded-2" />
                </div>
              </div>
            ))}
            {/* Skeleton for price details and coupon */}
            <div className="p-2 border rounded-3 mb-2">
              <div className="skeleton w-60 h-24 mb-2 rounded-2" />
              <div className="skeleton w-40 h-18 mb-1 rounded-2" />
              <div className="skeleton w-40 h-18 mb-1 rounded-2" />
              <div className="skeleton w-100 h-40 mt-3 rounded-2" />
            </div>
            {/* Sticky footer skeleton for mobile */}
            <div className="fixed left-0 right-0 bottom-0 max-w-480 mx-auto z-1000 flex bg-background-paper box-shadow">
              <div className="skeleton w-100 h-28 rounded-2" />
              <div className="skeleton w-120 h-40 rounded-2" />
            </div>
          </div>
        ) : (
          <div className="flex gap-3 items-start">
            {/* Left: Cart item skeletons */}
            <div className="flex-2">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-start mb-2 p-2 border rounded-3 gap-2 min-h-[100px]"
                >
                  <div className="skeleton w-80 h-80 rounded-2 mr-2" />
                  <div className="flex-1 min-w-0">
                    <div className="skeleton w-70 h-20 rounded-2 mb-1" />
                    <div className="skeleton w-40 h-16 rounded-2 mb-1" />
                    <div className="skeleton w-100 h-32 rounded-2" />
                  </div>
                </div>
              ))}
            </div>
            {/* Right: Price details skeleton */}
            <div className="flex-1 min-w-260 max-w-400 w-360">
              <div className="p-2 border rounded-3 mb-2">
                <div className="skeleton w-60 h-24 mb-2 rounded-2" />
                <div className="skeleton w-40 h-18 mb-1 rounded-2" />
                <div className="skeleton w-40 h-18 mb-1 rounded-2" />
                <div className="skeleton w-100 h-40 mt-3 rounded-2" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold text-center mb-3">
        Your Shopping Cart
      </h2>

      {cart && cart.cartItems.length > 0 ? (
        <div className="max-w-lg mx-auto pb-8">
          {/* Cart Items (left) */}
          <div className="flex-2 min-w-0">
            {cart.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start mb-2 p-2 border rounded-3 gap-2"
              >
                <Link
                  to={`/products/${item.product.id}`}
                  className="flex items-center"
                >
                  <div className="w-80 h-80 rounded-2 overflow-hidden mr-2 box-shadow">
                    <img
                      src={item.product.primaryImageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="text-decoration-none text-inherit"
                  >
                    <h3 className="text-subtitle1 font-bold whitespace-nowrap overflow-hidden text-ellipsis font-size-1-1rem mb-0-5">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-body2 text-text-secondary mb-1">
                    ₹{item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      className="outlined-btn-small"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          "minus"
                        )
                      }
                      disabled={
                        updatingItem?.id === item.product.id &&
                        updatingItem?.type === "minus"
                      }
                    >
                      {updatingItem?.id === item.product.id &&
                      updatingItem?.type === "minus" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        "-"
                      )}
                    </button>
                    <span className="mx-1 min-w-24 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="outlined-btn-small"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          "plus"
                        )
                      }
                      disabled={
                        updatingItem?.id === item.product.id &&
                        updatingItem?.type === "plus"
                      }
                    >
                      {updatingItem?.id === item.product.id &&
                      updatingItem?.type === "plus" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        "+"
                      )}
                    </button>
                    <button
                      className="text-error"
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, 0, "delete")
                      }
                      disabled={
                        updatingItem?.id === item.product.id &&
                        updatingItem?.type === "delete"
                      }
                    >
                      {updatingItem?.id === item.product.id &&
                      updatingItem?.type === "delete" ? (
                        <span className="cart-btn-spinner" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Price Details, Coupon, Checkout (right) */}
          <div className="flex-1 min-w-260 max-w-400 w-full mx-auto">
            {/* Coupon Collapsible */}
            <div className="p-2 border rounded-3 mb-2">
              <div className="flex items-center justify-between cursor-pointer px-0-5">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 17L9 20l-1 1h8.5l1-1-1.7-1.7M9.75 17l.003-4.001M9.75 17l-1.5 1.5M9.75 17l-1.5 1.5"
                    />
                  </svg>
                  <span className="font-bold">Have a promo code?</span>
                </div>
              </div>
            </div>
            {/* Price Details */}
            <div className="p-2 border rounded-3 mb-2">
              <h6 className="font-bold mb-2">Price Details</h6>
              <div className="flex justify-between mb-1">
                <span>
                  Subtotal ({cart.cartItems.length} item
                  {cart.cartItems.length > 1 ? "s" : ""})
                </span>
                <span>₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Delivery Charges</span>
                <span className="text-success-main">FREE</span>
              </div>
              <div className="flex justify-between mt-2 mb-1">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold">₹{cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-2 border rounded-3 mb-2">
              <button
                className="contained-btn-success py-1-2 font-bold font-size-1-1rem border-radius-2 min-w-140"
                onClick={() => navigate("/checkout")}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Modern empty cart state
        <div className="text-center mt-8">
          <img
            src="/empty-cart-illustration.svg"
            alt="Empty Cart"
            className="w-160 mb-24 opacity-80"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h5 className="mt-2 text-gray font-bold">
            Oops! Your cart is empty. 😢
          </h5>
          <p className="mt-1 text-gray">
            Looks like you haven't added anything yet.
          </p>
          <button
            className="contained-btn-primary mt-4 font-bold font-size-1-1rem border-radius-2 px-4 py-1-2"
            onClick={() => navigate("/products")}
          >
            Start Shopping 🛍️
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

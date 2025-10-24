import React, { createContext, useContext, useState, ReactNode } from 'react';

// ✅ Cart item type with quantity added
type CartItem = {
  id: string;
  name: string;
  price: string;
  image: any;
  quantity: number;
};

// ✅ Context type definition
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  
};

// ✅ Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Add item to cart or increase quantity if exists
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  // ✅ Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ✅ Clear all items
  const clearCart = () => setCartItems([]);

  // ✅ Increase quantity
  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // ✅ Decrease quantity or remove if 0
  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // ✅ Get total item count
  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Get total price
  const getTotalPrice = () =>
    cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook to use the cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

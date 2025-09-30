"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/src/services/api";

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  itemTotal: number;
};

type CartContextType = {
 items: CartItem[];
  addToCart: (p: Product) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  totalItems: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await api.get("/cart");
        setItems(res.data.items || []);
      } catch (err) {
        console.log("Erro ao buscar carrinho", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = async (p: Product) => {
    try {
      await api.post("/cart/add-product", {
        productId: p.id,
        quantity: 1,       
      });
      const res = await api.get("/cart");
      setItems(res.data.items || []);
    } catch (err) {
      console.log("Erro ao adicionar produto", err);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await api.delete("/cart/remove-product", {
        data: { productId: id },
      });
      const res = await api.get("/cart");
      setItems(res.data.items || []);
    } catch (err) {
      console.log("Erro ao remover produto", err);
    }
  };
  const increaseQuantity = async (id: string) => {
    try {
      await api.post("/cart/add-product", { productId: id, quantity: 1 });
      const res = await api.get("/cart");
      setItems(res.data.items || []);
    } catch (err) {
      console.log("Erro ao aumentar quantidade", err);
    }
  };

 const decreaseQuantity = async (id: string) => {
  try {
    const item = items.find((i) => i.product.id === id);
    if (!item) return;

    if (item.quantity <= 1) {
      await removeFromCart(id);
    } else {
      await api.post("/cart/add-product", { productId: id, quantity: -1 });
    }

    const res = await api.get("/cart");
    setItems(res.data.items || []);
  } catch (err) {
    console.log("Erro ao diminuir quantidade", err);
  }
};

  const clearCart = async () => {
    try {
      if (items.length === 0) {
        setItems([]);
        return;
      }

      try {
        await api.delete("/cart/remove-product");
        setItems([]);
        return;
      } catch (err) {
        console.log("DELETE /cart/remove-product sem corpo não suportado — fazendo fallback item-a-item", err);
      }

      await Promise.all(
        items.map((it) =>
          api.delete("/cart/remove-product", {
            data: { productId: it.product.id },
          })
        )
      );

      const res = await api.get("/cart");
      setItems(res.data.items || []);
    } catch (err) {
      console.log("Erro ao limpar carrinho", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalItems,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}

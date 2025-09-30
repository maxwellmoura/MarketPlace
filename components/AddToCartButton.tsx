"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type AddToCartButtonProps = {
  product: any;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      if (
        window.confirm(
          "Você precisa estar logado para adicionar itens ao carrinho. Deseja fazer login agora?"
        )
      ) {
        router.push("/login");
      }
      return;
    }

    addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
    >
      Adicionar ao Carrinho
    </button>
  );
}

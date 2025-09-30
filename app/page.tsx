"use client";
import React, { useEffect, useState } from "react";
import AddToCartButton from "../components/AddToCartButton";
import api from "@/src/services/api";
import Image from "next/image";
import { Product as CartProduct } from "@/context/CartContext";

type ApiProduct = {
  id: string;
  title?: string;
  name?: string;
  price: number;
  description: string;
  imageUrl?: string;
  image?: string;
  quantity?: number;
};

const normalizeProduct = (p: any): ApiProduct => ({
  id: p.id,
  name: p.name || p.title || "Produto sem nome",
  description: p.description || "",
  imageUrl: p.imageUrl || p.image || "/no-image.png",
  price: p.price,
});

export default function Produtos() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  function hasImage(url: string): boolean {
    if (!url) return false;
    return /\.(png|jpg|jpeg|gif|webp)$/i.test(url);
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products?page=1&limit=20");
        let apiProducts: ApiProduct[] = [];
        if (Array.isArray(response.data)) {
          apiProducts = response.data;
        } else if (Array.isArray(response.data.products)) {
          apiProducts = response.data.products;
        } else {
          console.warn("Formato inesperado da resposta:", response.data);
          apiProducts = [];
        }
        setProducts(apiProducts.map(normalizeProduct));
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Carregando produtos...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Produtos</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => {
            const cartProduct: CartProduct = {
              id: p.id,
              name: p.name || "Produto sem nome",
              price: p.price,
              imageUrl: p.imageUrl || "/no-image.png",
              quantity: 1,
              description: p.description || "",
              createdAt: "",
              updatedAt: "",
            };

            return (
              <div
                key={p.id}
                className="border rounded-lg p-4 shadow-md bg-white flex flex-col items-center"
              >
                <div className="overflow-hidden m-auto h-[250px] w-[250px]">
                  <Image
                    className="size-full object-cover"
                    src={hasImage(p.imageUrl || "") ? p.imageUrl! : "/no-image.png"}
                    alt={p.name || "Produto sem nome"}
                    width={250}
                    height={250}
                  />
                </div>

                <h3 className="text-lg font-bold pt-6">{p.name}</h3>
                <p className="text-gray-600 text-sm">{p.description}</p>
                <p className="text-green-600 font-semibold mt-2">
                  R$ {p.price.toFixed(2)}
                </p>

                <div className="mt-4 w-full">
                  <AddToCartButton product={cartProduct} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

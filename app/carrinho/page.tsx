'use client';
import React from 'react';
import { useCart } from '../../context/CartContext';

export default function CarrinhoPage() {
  const { items, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-sm text-gray-600">
                    R$ {item.product.price?.toFixed(2)} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-lg font-bold">
              Total: R$ {total.toFixed(2)}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => clearCart()}
                className="px-4 py-2 border rounded"
              >
                Limpar
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

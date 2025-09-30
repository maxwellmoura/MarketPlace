"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">Marketplace</h1>
      <nav className="flex gap-4">
        {user?.role === "USER" && <Link href="/">Home</Link>}
        {user && (
          <>
            {user?.role === "USER" && <Link href="/carrinho">
              Carrinho {totalItems > 0 && <span>({totalItems})</span>}
            </Link>}

            {user?.role === "ADMIN" && <Link href="/admin">Painel Admin</Link>}
          </>
        )}
        {!user ? (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="hover:underline bg-transparent border-none text-white cursor-pointer p-0"
            style={{ font: "inherit" }}
          >
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}

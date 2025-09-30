"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/src/services/api";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

type ProductForm = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  imageFile?: File | null;
};

const normalizeProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  imageUrl: p.imageUrl || p.image || "",
  price: p.price,
});


export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const list = res.data?.products || [];
      setProducts(list.map(normalizeProduct));
    } catch (err) {
      console.error("Erro ao buscar produtos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      if (!user?.accessToken) {
        router.push("/login");
      } else if (!isAdmin()) {
        router.push("/");
      } else {
        await fetchProducts();
      }
    }
    init();
  }, [user, isAdmin, router]);

  const openEditModal = async (id: string) => {
    try {
      const res = await api.get(`/products/${id}`);
      const prod = res.data?.product || res.data;
      const normalizedProduct = normalizeProduct(prod);
      setEditingProduct({
        ...normalizedProduct,
        imageFile: null
      });
      setImagePreview(normalizedProduct.imageUrl);
      setIsNewProduct(false);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar produto para edição", err);
      alert("Erro ao buscar produto para edição. Veja o console para mais detalhes.");
    }
  };

  const openNewProductModal = () => {
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      imageFile: null,
    });
    setImagePreview(null);
    setIsNewProduct(true);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditingProduct(prev => prev ? { ...prev, imageFile: file } : null);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;

    const name = (editingProduct.name || "").trim();
    const description = (editingProduct.description || "").trim();
    const price = Number(editingProduct.price);

    if (isNewProduct && !editingProduct.imageFile && !editingProduct.imageUrl.trim()) {
      alert("Selecione uma imagem ou forneça uma URL para o produto.");
      return;
    }

    if (!name || !description || !price || price <= 0) {
      alert("Preencha todos os campos obrigatórios corretamente (nome, descrição e preço > 0).");
      return;
    }

    try {
      if (isNewProduct) {
        if (editingProduct.imageFile) {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('description', description);
          formData.append('price', price.toString());
          formData.append('image', editingProduct.imageFile);

          const res = await api.post("/products", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setProducts((prev) => [...prev, normalizeProduct(res.data)]);
        } else {
          const res = await api.post("/products", {
            name,
            description,
            imageUrl: editingProduct.imageUrl,
            price,
          });
          setProducts((prev) => [...prev, normalizeProduct(res.data)]);
        }
      } else {
        if (editingProduct.imageFile) {
          const formData = new FormData();
          formData.append('id', editingProduct.id);
          formData.append('name', name);
          formData.append('description', description);
          formData.append('price', price.toString());
          formData.append('image', editingProduct.imageFile);

          const res = await api.put(`/products/${editingProduct.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? normalizeProduct(res.data) : p))
          );
        } else {
          const res = await api.put(`/products/${editingProduct.id}`, {
            id: editingProduct.id,
            name,
            description,
            imageUrl: editingProduct.imageUrl,
            price,
          });
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? normalizeProduct(res.data) : p))
          );
        }
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Erro ao salvar produto (detalhe):", err);
      console.error("err.response?.status =>", err?.response?.status);
      console.error("err.response?.data =>", err?.response?.data);
      alert(
        "Erro ao salvar produto. Verifique os dados e os logs do servidor.\n" +
          (err?.response?.data?.message ? `Server: ${err.response.data.message}` : "")
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await api.delete(`/products/${id}`);
      console.log("DELETE /products response:", res.status, res.data);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar produto", err);
      alert("Erro ao deletar produto. Veja o console para detalhes.");
    }
  };

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>

      <button
        onClick={openNewProductModal}
        className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      >
        Novo Produto
      </button>

       <div className="space-y-4">
         {products.map((product) => (
           <div
             key={product.id}
             className="p-4 border rounded flex justify-between items-center"
           >
            <div className="flex items-center space-x-4">
               <div className="flex-shrink-0">
                 <img
                   src={product.imageUrl || '/no-image.png'}
                   alt={product.name}
                   className="w-16 h-16 object-cover rounded border"
                   onError={(e) => {
                     e.currentTarget.src = '/no-image.png';
                   }}
                 />
               </div>
              
               <div className="flex-1">
                 <div className="font-semibold text-lg">
                   {product.name} - R$ {Number(product.price).toFixed(2)}
                 </div>
                 <div className="text-gray-600 text-sm mt-1">
                   {product.description}
                 </div>
               </div>
             </div>
             
             <div className="space-x-2">
               <button
                 onClick={() => openEditModal(product.id)}
                 className="px-3 py-1 bg-yellow-500 text-white rounded"
               >
                 Editar
               </button>
               <button
                 onClick={() => deleteProduct(product.id)}
                 className="px-3 py-1 bg-red-600 text-white rounded"
               >
                 Deletar
               </button>
             </div>
           </div>
         ))}
       </div>

      
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {isNewProduct ? "Novo Produto" : "Editar Produto"}
            </h2>

            <label className="block mb-2">Nome:</label>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
            />

            <label className="block mb-2">Descrição:</label>
            <textarea
              className="w-full border p-2 mb-4"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, description: e.target.value })
              }
            />

            <label className="block mb-2">Imagem:</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border p-2 mb-4"
              onChange={handleImageChange}
            />
            
            {imagePreview && (
              <div className="mb-4">
                <label className="block mb-2">Preview:</label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
            
            <label className="block mb-2">Ou URL da imagem:</label>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              value={editingProduct.imageUrl}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
              }
              placeholder="https://exemplo.com/imagem.jpg"
            />

            <label className="block mb-2">Preço:</label>
            <input
              type="number"
              className="w-full border p-2 mb-4"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                  setImagePreview(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={saveProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

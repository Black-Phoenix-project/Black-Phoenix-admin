import React, { useEffect, useState } from "react";
import { TiThLarge } from "react-icons/ti";
import { FaRegPenToSquare, FaPlus } from "react-icons/fa6";
import { LiaSearchSolid } from "react-icons/lia";
import { IoMdReorder } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKENT_URL;

const ActionBtn = ({ icon, bg, color, label, onClick }) => (
  <button
    className="flex flex-col items-center justify-center gap-0.5 group/btn"
    onClick={onClick}
    title={label}
  >
    <div
      className={`${bg} ${color} p-1.5 rounded-lg text-base transition-all group-hover/btn:scale-110`}
    >
      {icon}
    </div>
    {label && (
      <span className="text-[10px] text-base-content/40">{label}</span>
    )}
  </button>
);
const Products = () => {
  const [products, setProducts] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    images: ["", "", ""],
    description: "",
    price: "",
  });
  const resetProductForm = () => {
    setNewProduct({
      name: "",
      images: ["", "", ""],
      description: "",
      price: "",
    });
    setEditingProductId(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/product`);
      if (!res.ok) throw new Error("Mahsulotlarni olishda xatolik");
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : Array.isArray(data.data)
        ? data.data
        : [];
      setProducts(list);
    } catch (err) {
      toast.error("Mahsulotlarni yuklashda xatolik.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (index, value) => {
    setNewProduct((prev) => {
      const nextImages = [...prev.images];
      nextImages[index] = value;
      return { ...prev, images: nextImages };
    });
  };
  const validateInputs = () => {
    const { name, images, description, price } = newProduct;
    const validImages = (images || []).map((img) => img.trim()).filter(Boolean);
    if (!name || !description || !price) {
      toast.error("Barcha maydonlar to'ldirilishi shart!");
      return false;
    }
    if (validImages.length < 1 || validImages.length > 3) {
      toast.error("Kamida 1 ta, ko'pi bilan 3 ta rasm kiriting!");
      return false;
    }
    return true;
  };
  const openEditModal = (product) => {
    const rawImages = Array.isArray(product.image) ? product.image : [product.image];
    const cleanImages = rawImages.filter(Boolean).slice(0, 3);
    const filledImages = [...cleanImages, "", ""].slice(0, 3);
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      images: filledImages,
    });
    document.getElementById("product_modal").showModal();
  };
  const sendNewProduct = async () => {
    if (!validateInputs()) return;
    try {
      const validImages = (newProduct.images || []).map((img) => img.trim()).filter(Boolean);
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image: validImages,
      };
      const res = await fetch(`${BASE_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Mahsulot qo'shilmadi");
      const added = await res.json();
      const createdProduct = added?.data || added;
      setProducts((prev) => [...prev, createdProduct]);
      toast.success("Mahsulot muvaffaqiyatli qo'shildi!");
      setNewProduct({ name: "", images: ["", "", ""], description: "", price: "" });
      document.getElementById("product_modal").close();
    } catch (err) {
      toast.error("Mahsulot qo'shishda xatolik.");
      console.error(err);
    }
  };
  const updateProduct = async () => {
    if (!validateInputs() || !editingProductId) return;
    try {
      const validImages = (newProduct.images || []).map((img) => img.trim()).filter(Boolean);
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image: validImages,
      };
      const res = await fetch(`${BASE_URL}/api/product/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Mahsulot yangilanmadi");
      const updated = await res.json();
      const updatedProduct = updated?.data || updated;
      setProducts((prev) =>
        prev.map((item) => (item._id === editingProductId ? updatedProduct : item))
      );
      toast.success("Mahsulot muvaffaqiyatli yangilandi!");
      resetProductForm();
      document.getElementById("product_modal").close();
    } catch (err) {
      toast.error("Mahsulotni yangilashda xatolik.");
      console.error(err);
    }
  };
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/product/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Mahsulot o'chirildi.");
    } catch {
      toast.error("Mahsulotni o'chirishda xatolik.");
    }
  };
  const duplicateProduct = async (item) => {
    try {
      const { _id, ...rest } = item;
      const res = await fetch(`${BASE_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      const duplicatedProduct = added?.data || added;
      setProducts((prev) => [...prev, duplicatedProduct]);
      toast.success("Mahsulot nusxalandi!");
    } catch {
      toast.error("Mahsulotni nusxalashda xatolik.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-300 p-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-warning tracking-tight">
            Mahsulotlar
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Mahsulotlar katalogini boshqaring
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          
          <div className="flex items-center border border-warning/40 rounded-xl px-4 py-2 bg-base-100 shadow-sm w-full md:w-72">
            <LiaSearchSolid className="text-xl text-warning" />
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              className="ml-2 w-full bg-transparent text-base-content border-none outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          
          <div className="flex items-center gap-2">
            <button
              className={`p-2.5 rounded-xl border transition-all ${
                !showGrid
                  ? "bg-warning text-warning-content border-warning"
                  : "bg-base-100 border-base-content/20 text-base-content/50"
              }`}
              onClick={() => setShowGrid(false)}
              title="Ro'yxat ko'rinishi"
            >
              <IoMdReorder className="text-2xl" />
            </button>
            <button
              className={`p-2.5 rounded-xl border transition-all ${
                showGrid
                  ? "bg-warning text-warning-content border-warning"
                  : "bg-base-100 border-base-content/20 text-base-content/50"
              }`}
              onClick={() => setShowGrid(true)}
              title="Katak ko'rinishi"
            >
              <TiThLarge className="text-2xl" />
            </button>
          </div>

          
          <button
            className="btn bg-warning text-warning-content border-none hover:bg-warning/80 shadow-md gap-2 rounded-xl"
            onClick={() => {
              resetProductForm();
              document.getElementById("product_modal").showModal();
            }}
          >
            <FaPlus />
            Yangi mahsulot
          </button>
        </div>
      </div>

      
      <dialog id="product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 border border-warning/30 shadow-2xl rounded-2xl">
          <h3 className="text-2xl font-bold text-warning text-center mb-6">
            {editingProductId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "name", placeholder: "Mahsulot nomi" },
              { name: "description", placeholder: "Tavsif" },
              { name: "price", placeholder: "Narx (masalan: 29.99)" },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                className="input input-bordered border-warning/40 focus:border-warning bg-base-200 w-full rounded-xl"
                value={newProduct[field.name]}
                onChange={handleInputChange}
              />
            ))}
            {newProduct.images.map((image, index) => (
              <input
                key={`image-${index}`}
                type="text"
                placeholder={`Rasm URL manzili ${index + 1} ${index === 0 ? "(majburiy)" : "(ixtiyoriy)"}`}
                className="input input-bordered border-warning/40 focus:border-warning bg-base-200 w-full rounded-xl"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
            ))}
          </div>
          <div className="modal-action flex gap-3 mt-6">
            <button
              className="btn flex-1 bg-warning text-warning-content border-none hover:bg-warning/80 rounded-xl"
              onClick={editingProductId ? updateProduct : sendNewProduct}
            >
              <FaPlus className="mr-1" /> {editingProductId ? "Saqlash" : "Qo'shish"}
            </button>
            <form method="dialog" className="flex-1">
              <button className="btn w-full bg-base-300 border-none rounded-xl">
                Bekor qilish
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>yopish</button>
        </form>
      </dialog>

      
      {loading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-warning"></span>
        </div>
      )}

      
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl font-semibold text-base-content">
            Mahsulot topilmadi
          </p>
          <p className="text-sm text-base-content/50 mt-1">
            Boshqa so'z bilan qidiring yoki yangi mahsulot qo'shing.
          </p>
        </div>
      )}

      
      {!loading && showGrid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4 pt-10">
          {filteredProducts.map((product) => {
            const productImage = Array.isArray(product.image) ? product.image[0] : product.image;
            return (
            <div
              key={product._id}
              className="bg-base-100 rounded-2xl shadow-md p-4 pt-14 relative mt-10 border border-warning/10 hover:border-warning/40 transition-all group"
            >
              
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-warning shadow-lg bg-base-300">
                <img
                  src={productImage || "https://placehold.co/80x80?text=P"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/80x80?text=P";
                  }}
                />
              </div>

              <h3 className="text-base font-bold text-center text-warning truncate">
                {product.name}
              </h3>
             
              <p className="text-sm text-center font-semibold text-base-content mt-1">
                ${product.price}
              </p>
              <p className="text-xs text-center text-base-content/40 mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-center gap-2 mt-4">
                <ActionBtn
                  icon={<MdOutlineRemoveRedEye />}
                  bg="bg-emerald-100"
                  color="text-emerald-600"
                  label="Ko'rish"
                  onClick={() => toast.info(`Ko'rilmoqda: ${product.name}`)}
                />
                <ActionBtn
                  icon={<FiPlusCircle />}
                  bg="bg-base-200"
                  color="text-base-content/60"
                  label="Nusxa"
                  onClick={() => duplicateProduct(product)}
                />
                <ActionBtn
                  icon={<FaRegPenToSquare />}
                  bg="bg-warning/20"
                  color="text-warning"
                  label="Tahrir"
                  onClick={() => openEditModal(product)}
                />
                <ActionBtn
                  icon={<RiDeleteBinLine />}
                  bg="bg-red-100"
                  color="text-red-500"
                  label="O'chir"
                  onClick={() => deleteProduct(product._id)}
                />
              </div>
            </div>
          )})}
        </div>
      )}

      
      {!loading && !showGrid && (
        <div className="space-y-2 mt-4">
          
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-bold uppercase tracking-widest text-warning/70 bg-base-100 rounded-xl border border-warning/10">
            <div className="col-span-1">Rasm</div>
            <div className="col-span-3">Nomi</div>
            <div className="col-span-2">Narx</div>
            <div className="col-span-4">Tavsif</div>
            <div className="col-span-2 text-right">Amallar</div>
          </div>

          {filteredProducts.map((product, index) => {
            const productImage = Array.isArray(product.image) ? product.image[0] : product.image;
            return (
            <div
              key={product._id}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-3 rounded-xl border transition-all hover:border-warning/40 ${
                index % 2 === 0
                  ? "bg-base-100 border-base-content/10"
                  : "bg-base-200 border-base-content/5"
              }`}
            >
              <div className="col-span-1">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-warning/30 bg-base-300">
                  <img
                    src={productImage || "https://placehold.co/40x40?text=P"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/40x40?text=P";
                    }}
                  />
                </div>
              </div>

              <div className="col-span-3">
                <span className="font-semibold text-sm text-warning truncate block">
                  {product.name}
                </span>
              </div>

              <div className="col-span-2">
                <span className="font-bold text-base-content text-sm">
                  ${product.price}
                </span>
              </div>

              <div className="col-span-4">
                <p className="text-xs text-base-content/50 truncate">
                  {product.description || "—"}
                </p>
              </div>

              <div className="col-span-2 flex justify-end gap-1.5">
                <ActionBtn
                  icon={<MdOutlineRemoveRedEye />}
                  bg="bg-emerald-100"
                  color="text-emerald-600"
                  onClick={() => toast.info(`Ko'rilmoqda: ${product.name}`)}
                />
                <ActionBtn
                  icon={<FiPlusCircle />}
                  bg="bg-base-300"
                  color="text-base-content/60"
                  onClick={() => duplicateProduct(product)}
                />
                <ActionBtn
                  icon={<FaRegPenToSquare />}
                  bg="bg-warning/20"
                  color="text-warning"
                  onClick={() => openEditModal(product)}
                />
                <ActionBtn
                  icon={<RiDeleteBinLine />}
                  bg="bg-red-100"
                  color="text-red-500"
                  onClick={() => deleteProduct(product._id)}
                />
              </div>
            </div>
          )})}
        </div>
      )}

      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#1d1d1d",
          color: "#f5c518",
          border: "1px solid rgba(245,197,24,0.3)",
          borderRadius: "12px",
        }}
      />
    </div>
  );
};

export default Products;

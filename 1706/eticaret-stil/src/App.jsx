import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import AddProductForm from "./components/AddProductForm";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./productsMock";
import { useState } from "react";
import CartDrawer from "./components/CartDrawer";
function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [view, setView] = useState("home");
  const [searchQuery,setSearchQuery]=useState("");
  const [searchInput,setSearchInput]=useState("");
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] =useState(false)

  const handleAddProduct = (data) => {
    const newProduct = {
      id: Date.now(),
      title: data.title,
      price: Number(data.price),
      category: data.category,
      rating: 5.0,
      ratingCount: 1,
      image: data.image,
      description: data.description
    }
    setProducts([newProduct, ...products])

  }

  const handleAddToCart = (product) =>{
    const existingProduct = cartItems.find((item => item.id === product.id));

    if(existingProduct){
      const updatedCart = cartItems.map((item) => item.id === product.id ? {...item, quantity: item.quantity+1}
    : item
    );
    setCartItems(updatedCart)
    } else {
      const newCartItem = {
        ...product, quantity :1
      };
      setCartItems([...cartItems, newCartItem])
    }
  }

  const increaseCartItem = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    setCartItems(updatedCart);
  };

  const decreaseCartItem = (productId) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
  };

  const removeCartItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);

    setCartItems(updatedCart);
  };

  const filteredProducts=products.filter((p)=>{
  const matchesCategory=selectedCategory==='Tümü' || p.category ===selectedCategory
  const matchesSearch=p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
  return matchesCategory && matchesSearch
})

const handleSearchSubmit=(e)=>{
  e.preventDefault()
  setSearchQuery(searchInput);
}

const totalPrice = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
);


  return (
    <>
      <Header searchInput={searchInput}
      setSearchInput={setSearchInput}
      handleSearchSubmit={handleSearchSubmit}
      setSearchQuery={setSearchQuery}
      setSelectedCategory={setSelectedCategory}
      setView={setView}
      cartItems={cartItems}
      setIsCartOpen={setIsCartOpen}
      />
      <Navbar
        categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setView={setView}
      />

      {view === "home" ? (
        <main className="main-layout">
          <Sidebar
            categories={MOCK_CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="content-area">
            <div className="content-header">
              <h1 className="page-title">
                {selectedCategory} {searchQuery && `> "${searchQuery}"`} Ürünler
              </h1>
              <span className="text-sm">Toplam {filteredProducts.length} Ürün</span>
            </div>

          {filteredProducts.length ===0 ? (
          <div className="text-center py-10">
           <p className="text-red-500">Aradığınız kriterlere uygun ürün bulunamadı</p>
          </div>
) : (

            <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart}/>
            )}
          </div>
        </main>
      ) : (
        <AddProductForm categories={MOCK_CATEGORIES} 
        setView={setView}
        onAddProduct={handleAddProduct}
        />
      )}
      <CartDrawer isCartOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} increaseCartItem={increaseCartItem} decreaseCartItem={decreaseCartItem} removeCartItem={removeCartItem} totalPrice={totalPrice}/>
      <Footer />
    </>
  );
}

export default App;

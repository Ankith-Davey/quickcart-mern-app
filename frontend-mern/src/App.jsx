import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, X, Trash2, Plus, Minus, RotateCcw, Star, Pencil } from "lucide-react";
import { CATEGORIES, BRANDS, RATING_OPTIONS, SORT_OPTIONS, CATEGORY_TINT } from "./products.js";

const API_URL = "http://localhost:5000/api/products";

function discountPercent(product) {
  if (product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

// ---------------------------------------------
// Small reusable pieces
// ---------------------------------------------
function AddToCartControl(props) {
  const product = props.product;
  const qty = props.qty;
  const onAdd = props.onAdd;
  const onDecrement = props.onDecrement;
  const big = props.size === "big";
  const isOutOfStock = product.quantity === 0;

  if (isOutOfStock) {
    return <span className={"qc-add-disabled" + (big ? " qc-add-disabled--big" : "")}>Add</span>;
  }

  if (qty === 0) {
    return (
      <button
        className={"qc-add-btn" + (big ? " qc-add-btn--big" : "")}
        onClick={function (e) { e.stopPropagation(); onAdd(product); }}
      >
        ADD
      </button>
    );
  }

  return (
    <div className="qc-stepper">
      <button onClick={function (e) { e.stopPropagation(); onDecrement(product.id); }}>
        <Minus size={13} />
      </button>
      <span>{qty}</span>
      <button onClick={function (e) { e.stopPropagation(); onAdd(product); }}>
        <Plus size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------
// Sidebar: category / brand / rating / price filters
// ---------------------------------------------
function Sidebar(props) {
  const selectedCategories = props.selectedCategories;
  const onToggleCategory = props.onToggleCategory;
  const selectedBrands = props.selectedBrands;
  const onToggleBrand = props.onToggleBrand;
  const minRating = props.minRating;
  const onSetMinRating = props.onSetMinRating;
  const maxPrice = props.maxPrice;
  const onSetMaxPrice = props.onSetMaxPrice;
  const filtersActive = props.filtersActive;
  const onReset = props.onReset;

  return (
    <aside className="qc-sidebar">
      <div className="qc-sidebar-head">
        <span className="qc-sidebar-title">FILTERS</span>
        {filtersActive && (
          <button className="qc-reset-btn" onClick={onReset}>
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      <p className="qc-filter-label">Category</p>
      <div className="qc-filter-group">
        {CATEGORIES.map(function (cat) {
          const checked = selectedCategories.indexOf(cat) !== -1;
          return (
            <label key={cat} className="qc-checkbox-row">
              <input type="checkbox" className="qc-checkbox" checked={checked} onChange={function () { onToggleCategory(cat); }} />
              <span className={"qc-checkbox-label" + (checked ? " qc-checkbox-label--active" : "")}>{cat}</span>
            </label>
          );
        })}
      </div>

      <div className="qc-divider" />

      <p className="qc-filter-label">Brand</p>
      <div className="qc-brand-list">
        {BRANDS.map(function (brand) {
          const checked = selectedBrands.indexOf(brand) !== -1;
          return (
            <label key={brand} className="qc-checkbox-row">
              <input type="checkbox" className="qc-checkbox" checked={checked} onChange={function () { onToggleBrand(brand); }} />
              <span className={"qc-checkbox-label" + (checked ? " qc-checkbox-label--active" : "")}>{brand}</span>
            </label>
          );
        })}
      </div>

      <div className="qc-divider" />

      <p className="qc-filter-label">Rating</p>
      <div className="qc-filter-group">
        {RATING_OPTIONS.map(function (opt) {
          const checked = minRating === opt.value;
          return (
            <label key={opt.value} className="qc-checkbox-row">
              <input type="radio" name="minRating" className="qc-radio" checked={checked} onChange={function () { onSetMinRating(opt.value); }} />
              <span className={"qc-checkbox-label" + (checked ? " qc-checkbox-label--active" : "")}>{opt.label}</span>
            </label>
          );
        })}
      </div>

      <div className="qc-divider" />

      <p className="qc-filter-label" style={{ marginBottom: "4px" }}>Price</p>
      <p className="qc-price-sub">
        Up to <strong>₹{maxPrice}</strong>
      </p>
      <input
        type="range"
        className="qc-slider"
        min={0}
        max={HIGHEST_PRICE}
        step={50}
        value={maxPrice}
        onChange={function (e) { onSetMaxPrice(Number(e.target.value)); }}
      />
    </aside>
  );
}

// ---------------------------------------------
// ProductGrid: card layout + empty state
// ---------------------------------------------
function ProductGrid(props) {
  const products = props.products;
  const cart = props.cart;
  const onAddToCart = props.onAddToCart;
  const onDecrement = props.onDecrement;
  const showAdmin = props.showAdmin;
  const onDeleteProduct = props.onDeleteProduct;

  function qtyInCartFor(productId) {
    const item = cart.find(function (i) { return i.id === productId; });
    return item ? item.qtyInCart : 0;
  }

  // Conditional rendering: empty state vs grid
  if (products.length === 0) {
    return <div className="qc-empty">No products match your filters.</div>;
  }

  return (
    <div className="qc-grid">
      {products.map(function (product) {
        const isOutOfStock = product.quantity === 0;
        const tint = CATEGORY_TINT[product.category];
        const discount = discountPercent(product);
        const qty = qtyInCartFor(product.id);

        return (
          <div key={product.id} className="qc-card">
            {showAdmin && (
              <button
                onClick={function (e) { e.stopPropagation(); if (window.confirm("Delete " + product.name + "?")) onDeleteProduct(product.id); }}
                style={{ position: "absolute", top: "8px", right: "8px", background: "#FFF0F0", border: "none", borderRadius: "6px", padding: "4px", cursor: "pointer" }}
              >
                <Trash2 size={13} color="#D93025" />
              </button>
            )}

            <span className="qc-card-tag" style={{ color: tint.fg, backgroundColor: tint.bg }}>
              {product.category}
            </span>

            <span className="qc-card-brand">{product.brand}</span>

            <h3 className="qc-card-title">{product.name}</h3>

            <div className="qc-card-rating">
              <Star size={12} fill="#FFB800" color="#FFB800" strokeWidth={1.5} />
              <span>{product.rating}</span>
            </div>

            {/* Conditional rendering: stock label */}
            {isOutOfStock ? (
              <span className="qc-stock-out">Out of stock</span>
            ) : (
              <span className="qc-stock-in">{product.quantity} in stock</span>
            )}

            <div className="qc-price-block">
              {discount > 0 && (
                <div className="qc-discount-row">
                  <span className="qc-mrp">₹{product.mrp}</span>
                  <span className="qc-discount-pct">{discount}% OFF</span>
                </div>
              )}
              <div className="qc-price-row">
                <span className="qc-price">₹{product.price}</span>
                <AddToCartControl product={product} qty={qty} onAdd={onAddToCart} onDecrement={onDecrement} size="small" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------
// CartDrawer
// ---------------------------------------------
function CartDrawer(props) {
  const cart = props.cart;
  const onClose = props.onClose;
  const onRemove = props.onRemove;

  let cartTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    cartTotal += cart[i].qtyInCart * cart[i].price;
  }

  return (
    <div className="qc-cart-drawer">
      <div className="qc-cart-head">
        <span>Your Cart</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={18} color="#8B8B8B" />
        </button>
      </div>

      {/* Conditional rendering: empty cart vs line items */}
      {cart.length === 0 ? (
        <p className="qc-cart-empty">Your cart is empty.</p>
      ) : (
        <div className="qc-cart-items">
          {cart.map(function (item) {
            return (
              <div key={item.id} className="qc-cart-item">
                <div>
                  <p className="qc-cart-item-name">{item.name}</p>
                  <p className="qc-cart-item-qty">{item.qtyInCart} × ₹{item.price}</p>
                </div>
                <button onClick={function () { onRemove(item.id); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Trash2 size={15} color="#D93025" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div className="qc-cart-footer">
          <span>Total</span>
          <span className="qc-cart-total">₹{cartTotal}</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------
// App: all state lives here
// ---------------------------------------------
export default function App() {
  // ---------- Step 2 & 3 of algorithm: state for products fetched from MongoDB ----------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const HIGHEST_PRICE = products.length
    ? Math.max.apply(null, products.map(function (p) { return p.price; }))
    : 1000;

  // ---------- Fetch existing products from the server on mount (GET) ----------
  useEffect(function () {
    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Server responded with " + res.status);
        return res.json();
      })
      .then(function (data) {
        setProducts(data);
        const highest = data.length ? Math.max.apply(null, data.map(function (p) { return p.price; })) : 1000;
        setMaxPrice(highest);
        setLoading(false);
      })
      .catch(function (err) {
        setFetchError(err.message);
        setLoading(false);
      });
  }, []);

  // ---------- CRUD: add a new product (POST) ----------
  function addProduct(newProduct) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    })
      .then(function (res) { return res.json(); })
      .then(function (saved) {
        setProducts(function (prev) { return prev.concat([saved]); });
      })
      .catch(function (err) { alert("Failed to add product: " + err.message); });
  }

  // ---------- CRUD: update an existing product (PUT) ----------
  function updateProduct(id, updates) {
    fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    })
      .then(function (res) { return res.json(); })
      .then(function (updated) {
        setProducts(function (prev) {
          return prev.map(function (p) { return p.id === id ? updated : p; });
        });
      })
      .catch(function (err) { alert("Failed to update product: " + err.message); });
  }

  // ---------- CRUD: delete a product (DELETE) ----------
  function deleteProduct(id) {
    fetch(API_URL + "/" + id, { method: "DELETE" })
      .then(function (res) { return res.json(); })
      .then(function () {
        setProducts(function (prev) { return prev.filter(function (p) { return p.id !== id; }); });
      })
      .catch(function (err) { alert("Failed to delete product: " + err.message); });
  }

  // ---------- filter(): search + category + brand + price + rating ----------
  let filteredProducts = products.filter(function (product) {
    const matchesSearch = product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.indexOf(product.category) !== -1;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.indexOf(product.brand) !== -1;
    const matchesPrice = product.price <= maxPrice;
    const matchesRating = product.rating >= minRating;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
  });

  // ---------- sort ----------
  if (sortBy === "price-asc") {
    filteredProducts = filteredProducts.slice().sort(function (a, b) { return a.price - b.price; });
  } else if (sortBy === "price-desc") {
    filteredProducts = filteredProducts.slice().sort(function (a, b) { return b.price - a.price; });
  } else if (sortBy === "rating-desc") {
    filteredProducts = filteredProducts.slice().sort(function (a, b) { return b.rating - a.rating; });
  }

  function toggleFromList(value, list, setList) {
    setList(function (prev) {
      if (prev.indexOf(value) !== -1) return prev.filter(function (v) { return v !== value; });
      return prev.concat([value]);
    });
  }

  function addToCart(product) {
    setCart(function (prevCart) {
      let found = false;
      const updated = prevCart.map(function (item) {
        if (item.id === product.id) {
          found = true;
          return Object.assign({}, item, { qtyInCart: item.qtyInCart + 1 });
        }
        return item;
      });
      if (found) return updated;
      return prevCart.concat([Object.assign({}, product, { qtyInCart: 1 })]);
    });
  }

  function decrementCart(productId) {
    setCart(function (prevCart) {
      return prevCart
        .map(function (item) {
          if (item.id === productId) return Object.assign({}, item, { qtyInCart: item.qtyInCart - 1 });
          return item;
        })
        .filter(function (item) { return item.qtyInCart > 0; });
    });
  }

  function removeFromCart(id) {
    setCart(function (prevCart) { return prevCart.filter(function (item) { return item.id !== id; }); });
  }

  let cartCount = 0;
  for (let i = 0; i < cart.length; i++) {
    cartCount += cart[i].qtyInCart;
  }

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(HIGHEST_PRICE);
    setMinRating(0);
    setSortBy("relevance");
  }

  const filtersActive =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    maxPrice < HIGHEST_PRICE ||
    minRating > 0 ||
    searchTerm !== "";

  return (
    <div className="qc-app">
      {/* Header */}
      <div className="qc-header">
        <div className="qc-header-inner">
          <button
            className="qc-logo"
            onClick={function () { resetFilters(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            Quick<span>Cart</span>
          </button>

          <div className="qc-search-wrap">
            <Search size={16} className="qc-search-icon" />
            <input
              type="text"
              className="qc-search-input"
              value={searchTerm}
              onChange={function (e) { setSearchTerm(e.target.value); }}
              placeholder="Search products..."
            />
          </div>
          <div className="qc-spacer" />

          <button
            className="qc-cart-btn"
            style={{ marginRight: "8px" }}
            onClick={function () { setShowAdmin(!showAdmin); }}
          >
            <Pencil size={14} />
            Manage
          </button>

          <button className="qc-cart-btn" onClick={function () { setShowCart(!showCart); }}>
            <ShoppingCart size={15} />
            Cart
            {cartCount > 0 && <span className="qc-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center", padding: "40px", color: "#8B8B8B" }}>Loading products from database...</p>}
      {fetchError && (
        <p style={{ textAlign: "center", padding: "40px", color: "#D93025" }}>
          Could not reach the server ({fetchError}). Is the backend running on port 5000?
        </p>
      )}

      {!loading && !fetchError && (
      <div className="qc-layout">
        <Sidebar
          selectedCategories={selectedCategories}
          onToggleCategory={function (cat) { toggleFromList(cat, selectedCategories, setSelectedCategories); }}
          selectedBrands={selectedBrands}
          onToggleBrand={function (brand) { toggleFromList(brand, selectedBrands, setSelectedBrands); }}
          minRating={minRating}
          onSetMinRating={setMinRating}
          maxPrice={maxPrice}
          onSetMaxPrice={setMaxPrice}
          filtersActive={filtersActive}
          onReset={resetFilters}
        />

        <main className="qc-main">
          <div className="qc-toolbar">
            {/* Product count display */}
            <p className="qc-count">{filteredProducts.length} of {products.length} products</p>
            <select className="qc-select" value={sortBy} onChange={function (e) { setSortBy(e.target.value); }}>
              {SORT_OPTIONS.map(function (opt) {
                return <option key={opt.value} value={opt.value}>{opt.label}</option>;
              })}
            </select>
          </div>

          <ProductGrid
            products={filteredProducts}
            cart={cart}
            onAddToCart={addToCart}
            onDecrement={decrementCart}
            showAdmin={showAdmin}
            onDeleteProduct={deleteProduct}
          />
        </main>
      </div>
      )}

      {showCart && <CartDrawer cart={cart} onClose={function () { setShowCart(false); }} onRemove={removeFromCart} />}

      {showAdmin && (
        <AdminPanel
          onClose={function () { setShowAdmin(false); }}
          onAdd={addProduct}
          onUpdate={updateProduct}
          products={products}
        />
      )}
    </div>
  );
}

// ---------------------------------------------
// AdminPanel: minimal CRUD form (Create/Update), Delete is on each card
// ---------------------------------------------
function AdminPanel(props) {
  const onClose = props.onClose;
  const onAdd = props.onAdd;
  const onUpdate = props.onUpdate;
  const products = props.products;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", brand: "", category: CATEGORIES[0], price: "", mrp: "", quantity: "", rating: "", description: ""
  });

  function handleChange(field, value) {
    setForm(function (prev) { return Object.assign({}, prev, { [field]: value }); });
  }

  function loadForEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name, brand: product.brand, category: product.category,
      price: product.price, mrp: product.mrp, quantity: product.quantity,
      rating: product.rating, description: product.description || ""
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", brand: "", category: CATEGORIES[0], price: "", mrp: "", quantity: "", rating: "", description: "" });
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.brand.trim() || !form.price) return;

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : Number(form.price),
      quantity: form.quantity ? Number(form.quantity) : 0,
      rating: form.rating ? Number(form.rating) : 0,
      description: form.description
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }
    resetForm();
  }

  return (
    <div className="qc-cart-drawer">
      <div className="qc-cart-head">
        <span>Manage Products</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={18} color="#8B8B8B" />
        </button>
      </div>

      <div style={{ padding: "12px", overflowY: "auto" }}>
        <p className="qc-filter-label">{editingId ? "Edit product #" + editingId : "Add new product"}</p>

        <input className="qc-search-input" style={{ width: "100%", marginBottom: "8px" }} placeholder="Name"
          value={form.name} onChange={function (e) { handleChange("name", e.target.value); }} />
        <input className="qc-search-input" style={{ width: "100%", marginBottom: "8px" }} placeholder="Brand"
          value={form.brand} onChange={function (e) { handleChange("brand", e.target.value); }} />

        <select className="qc-select" style={{ width: "100%", marginBottom: "8px" }}
          value={form.category} onChange={function (e) { handleChange("category", e.target.value); }}>
          {CATEGORIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
        </select>

        <input className="qc-search-input" style={{ width: "100%", marginBottom: "8px" }} placeholder="Price" type="number"
          value={form.price} onChange={function (e) { handleChange("price", e.target.value); }} />
        <input className="qc-search-input" style={{ width: "100%", marginBottom: "8px" }} placeholder="MRP (optional)" type="number"
          value={form.mrp} onChange={function (e) { handleChange("mrp", e.target.value); }} />
        <input className="qc-search-input" style={{ width: "100%", marginBottom: "8px" }} placeholder="Quantity in stock" type="number"
          value={form.quantity} onChange={function (e) { handleChange("quantity", e.target.value); }} />
        <input className="qc-search-input" style={{ width: "100%", marginBottom: "8px" }} placeholder="Rating (0-5)" type="number" step="0.1"
          value={form.rating} onChange={function (e) { handleChange("rating", e.target.value); }} />
        <input className="qc-search-input" style={{ width: "100%", marginBottom: "12px" }} placeholder="Description"
          value={form.description} onChange={function (e) { handleChange("description", e.target.value); }} />

        <button className="qc-add-btn qc-add-btn--big" style={{ width: "100%" }} onClick={handleSubmit}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button className="qc-reset-btn" style={{ marginTop: "8px" }} onClick={resetForm}>
            Cancel edit
          </button>
        )}

        <div className="qc-divider" style={{ margin: "16px 0" }} />
        <p className="qc-filter-label">Click a product below to edit it</p>
        <div className="qc-cart-items">
          {products.map(function (p) {
            return (
              <div key={p.id} className="qc-cart-item" style={{ cursor: "pointer" }} onClick={function () { loadForEdit(p); }}>
                <div>
                  <p className="qc-cart-item-name">{p.name}</p>
                  <p className="qc-cart-item-qty">₹{p.price} · {p.brand}</p>
                </div>
                <Pencil size={14} color="#8B8B8B" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react'
import './App.css'

const categories = [
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Books',
  'Toys',
  'Kitchen',
  'Pet Supplies',
  'Grocery',
]

const heroSlides = [
  {
    title: 'Smart home favorites',
    subtitle: 'Upgrade your everyday routine',
    tag: 'Up to 40% off',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Work from anywhere',
    subtitle: 'Laptops, accessories and more',
    tag: 'Prime exclusive',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Fresh finds for the season',
    subtitle: 'New arrivals with fast delivery',
    tag: 'New arrivals',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  },
]

const products = [
  {
    id: 1,
    title: 'Echo Dot (5th Gen) Smart Speaker',
    category: 'Electronics',
    rating: 4.8,
    reviews: 18423,
    price: 39.99,
    oldPrice: 59.99,
    badge: 'Best seller',
    image:
      'https://images.unsplash.com/photo-1543512214-1265e2c5f6a3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Apple AirPods Pro (2nd Gen)',
    category: 'Electronics',
    rating: 4.9,
    reviews: 32013,
    price: 199.99,
    oldPrice: 249.99,
    badge: 'Top rated',
    image:
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'The Silent Patient',
    category: 'Books',
    rating: 4.7,
    reviews: 8112,
    price: 17.49,
    oldPrice: 28.99,
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Woven Storage Basket Set',
    category: 'Home',
    rating: 4.6,
    reviews: 4120,
    price: 29.99,
    oldPrice: 39.99,
    badge: 'Limited time',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'HP Envy 15 Laptop',
    category: 'Electronics',
    rating: 4.7,
    reviews: 6211,
    price: 899.0,
    oldPrice: 1099.0,
    badge: 'Deal of the day',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Women\'s Everyday Crew Tee',
    category: 'Fashion',
    rating: 4.5,
    reviews: 993,
    price: 24.99,
    oldPrice: 34.99,
    badge: 'Prime pick',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
]

const initialCart = [
  { ...products[1], qty: 1 },
  { ...products[3], qty: 2 },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

function App() {
  const [activeCategory, setActiveCategory] = useState('Electronics')
  const [cart, setCart] = useState(initialCart)
  const [searchTerm, setSearchTerm] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [checkoutStage, setCheckoutStage] = useState('cart')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [userName, setUserName] = useState('Guest')

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products
    return products.filter((product) =>
      `${product.title} ${product.category} ${product.badge}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = cart.length ? (subtotal > 35 ? 0 : 9.99) : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...currentCart, { ...product, qty: 1 }]
    })
    setCheckoutStage('cart')
  }

  const changeQuantity = (id, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item,
        )
        .filter((item) => item.qty > 0),
    )
  }

  const handleProceed = () => {
    if (!signedIn) {
      setAuthOpen(true)
      setAuthMode('signin')
      return
    }
    setCheckoutStage('checkout')
  }

  const handleSubmitAuth = (event) => {
    event.preventDefault()
    setSignedIn(true)
    setUserName('Sarah')
    setAuthOpen(false)
    setCheckoutStage('checkout')
  }

  const handlePlaceOrder = () => {
    setCart([])
    setCheckoutStage('confirmation')
  }

  const activeProducts = filteredProducts.filter(
    (product) => product.category === activeCategory,
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-main">
          <div className="brand-wrap">
            <div className="brand-logo" aria-label="Amazon logo">amazon</div>
            <div className="location-chip">
              <span className="pin">⌖</span>
              <div>
                <small>Deliver to</small>
                <strong>Seattle 98101</strong>
              </div>
            </div>
          </div>

          <label className="search-box" aria-label="Search product catalog">
            <span className="search-caret">All</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search Amazon"
            />
            <button type="button" className="search-button">
              ⌕
            </button>
          </label>

          <nav className="utility-nav" aria-label="Account and shopping links">
            <button type="button" className="nav-button" onClick={() => setAuthOpen(true)}>
              <small>Hello, {userName}</small>
              <strong>{signedIn ? 'Account & Lists' : 'Sign in'}</strong>
            </button>
            <button type="button" className="nav-button">
              <small>Returns</small>
              <strong>& Orders</strong>
            </button>
            <button type="button" className="nav-button cart-button">
              <span className="cart-icon">🛒</span>
              <strong>Cart</strong>
              <span className="cart-count">{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
            </button>
          </nav>
        </div>

        <div className="subnav">
          <button type="button" className="menu-link">☰ All</button>
          {['Today&apos;s Deals', 'Customer Service', 'Registry', 'Gift Cards', 'Sell'].map(
            (item) => (
              <button key={item} type="button" className="menu-link">
                {item}
              </button>
            ),
          )}
          <button type="button" className="menu-link promo-link">
            Shop deals with no order minimum
          </button>
        </div>
      </header>

      <main className="page-content">
        <section className="hero-panel">
          <div className="hero-visual">
            <img src={heroSlides[0].image} alt={heroSlides[0].title} />
            <div className="hero-copy">
              <span>{heroSlides[0].tag}</span>
              <h1>{heroSlides[0].title}</h1>
              <p>{heroSlides[0].subtitle}</p>
            </div>
          </div>

          <div className="mini-panels">
            <article className="info-card">
              <h3>Welcome back</h3>
              <p>{signedIn ? 'Your Prime benefits are ready.' : 'Sign in for faster checkout.'}</p>
              <button type="button" className="primary-button" onClick={() => setAuthOpen(true)}>
                {signedIn ? 'Manage account' : 'Sign in securely'}
              </button>
            </article>
            <article className="info-card">
              <h3>Frequently repurchased</h3>
              <ul>
                <li>Cleaning essentials</li>
                <li>Office must-haves</li>
                <li>Back-to-school basics</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="feature-strip">
          {heroSlides.map((slide) => (
            <button
              key={slide.title}
              type="button"
              className="feature-tile"
              onClick={() => setSelectedProduct(products[0])}
            >
              <span>{slide.tag}</span>
              <strong>{slide.title}</strong>
            </button>
          ))}
        </section>

        <section className="category-section">
          <div className="section-header">
            <h2>Shop by Department</h2>
            <button type="button">See all</button>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? 'category-pill active' : 'category-pill'}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="catalog-section">
          <div className="section-header">
            <h2>{activeCategory}</h2>
            <button type="button">More items</button>
          </div>
          <div className="product-grid">
            {activeProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="image-wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="card-body">
                  <span className="badge">{product.badge}</span>
                  <h3>{product.title}</h3>
                  <div className="rating-row">
                    <span>★★★★★</span>
                    <small>{product.rating} ({product.reviews})</small>
                  </div>
                  <div className="price-row">
                    <strong>{formatCurrency(product.price)}</strong>
                    <span>{formatCurrency(product.oldPrice)}</span>
                  </div>
                  <div className="card-actions">
                    <button type="button" className="secondary-button" onClick={() => setSelectedProduct(product)}>
                      Details
                    </button>
                    <button type="button" className="primary-button" onClick={() => addToCart(product)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="checkout-layout">
          <div className="cart-panel">
            <div className="section-header compact-header">
              <h2>Shopping Cart</h2>
              <button type="button">Save for later</button>
            </div>

            {cart.length ? (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="cart-copy">
                    <h3>{item.title}</h3>
                    <div className="rating-row">
                      <span>★★★★★</span>
                      <small>{item.rating}</small>
                    </div>
                    <p className="item-price">{formatCurrency(item.price)}</p>
                    <div className="qty-row">
                      <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-total">{formatCurrency(item.price * item.qty)}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">Your cart is empty.</div>
            )}
          </div>

          <aside className="summary-panel">
            <div className="summary-box">
              <h3>Order summary</h3>
              {checkoutStage === 'confirmation' ? (
                <div className="confirmation-box">
                  <div className="checkmark">✓</div>
                  <h4>Order placed!</h4>
                  <p>Your delivery is on the way. Tracking number: AMZ-894221</p>
                </div>
              ) : checkoutStage === 'checkout' ? (
                <>
                  <div className="checkout-box">
                    <label>
                      Delivery address
                      <input type="text" defaultValue="124 Cedar Street, Seattle, WA" />
                    </label>
                    <label>
                      Payment method
                      <input type="text" defaultValue="Visa •••• 2456" />
                    </label>
                  </div>
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div className="totals-row">
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong>
                  </div>
                  <div className="totals-row">
                    <span>Tax</span>
                    <strong>{formatCurrency(tax)}</strong>
                  </div>
                  <div className="totals-row total-row">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                  <button type="button" className="primary-button full-width" onClick={handlePlaceOrder}>
                    Place your order
                  </button>
                </>
              ) : (
                <>
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div className="totals-row">
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong>
                  </div>
                  <div className="totals-row">
                    <span>Tax</span>
                    <strong>{formatCurrency(tax)}</strong>
                  </div>
                  <div className="totals-row total-row">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                  <button type="button" className="primary-button full-width" onClick={handleProceed}>
                    {signedIn ? 'Continue to checkout' : 'Sign in to checkout'}
                  </button>
                </>
              )}
            </div>
          </aside>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <h2>Recently viewed</h2>
            <button type="button">Keep shopping</button>
          </div>
          <div className="mini-grid">
            {products.slice(0, 4).map((product) => (
              <button key={product.id} type="button" className="mini-card" onClick={() => setSelectedProduct(product)}>
                <img src={product.image} alt={product.title} />
                <div>
                  <strong>{product.title}</strong>
                  <span>{formatCurrency(product.price)}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className="detail-modal" onClick={() => setSelectedProduct(null)}>
          <div className="detail-card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setSelectedProduct(null)}>
              ×
            </button>
            <div className="detail-media">
              <img src={selectedProduct.image} alt={selectedProduct.title} />
            </div>
            <div className="detail-copy">
              <span className="badge">{selectedProduct.badge}</span>
              <h3>{selectedProduct.title}</h3>
              <div className="rating-row">
                <span>★★★★★</span>
                <small>{selectedProduct.rating} ({selectedProduct.reviews} reviews)</small>
              </div>
              <div className="price-row">
                <strong>{formatCurrency(selectedProduct.price)}</strong>
                <span>{formatCurrency(selectedProduct.oldPrice)}</span>
              </div>
              <p>
                Designed to make your routine smoother with premium performance, durable build,
                and fast delivery essentials you’ll actually enjoy keeping around.
              </p>
              <div className="detail-actions">
                <button type="button" className="primary-button" onClick={() => addToCart(selectedProduct)}>
                  Add to cart
                </button>
                <button type="button" className="secondary-button" onClick={() => setSelectedProduct(null)}>
                  Keep browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {authOpen && (
        <div className="auth-modal" onClick={() => setAuthOpen(false)}>
          <div className="auth-card" onClick={(event) => event.stopPropagation()}>
            <div className="auth-header">
              <div className="brand-logo inline">amazon</div>
              <button type="button" className="close-button" onClick={() => setAuthOpen(false)}>
                ×
              </button>
            </div>
            <div className="auth-switch">
              <button
                type="button"
                className={authMode === 'signin' ? 'active' : ''}
                onClick={() => setAuthMode('signin')}
              >
                Sign in
              </button>
              <button
                type="button"
                className={authMode === 'signup' ? 'active' : ''}
                onClick={() => setAuthMode('signup')}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmitAuth} className="auth-form">
              <label>
                Email or mobile number
                <input type="text" defaultValue="sarah@amazon-demo.com" />
              </label>
              <label>
                Password
                <input type="password" defaultValue="amazon123" />
              </label>
              {authMode === 'signup' && (
                <label>
                  Full name
                  <input type="text" defaultValue="Sarah Smith" />
                </label>
              )}
              <button type="submit" className="primary-button full-width">
                {authMode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

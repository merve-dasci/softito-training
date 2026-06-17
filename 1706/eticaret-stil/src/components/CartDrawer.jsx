export default function CartDrawer({isCartOpen, onClose, cartItems, increaseCartItem, decreaseCartItem, removeCartItem, totalPrice}){
    if(!isCartOpen) return null;

    return (
      <>
        <div className="cart-overlay" onClick={onClose}></div>
        <aside className="cart-drawer">
          <div className="cart-header">
            <h2>Sepetim</h2>
            <button className="cart-close-btn" onClick={onClose} type="button">
              x
            </button>
          </div>

          <div className="cart-content">
            {cartItems.length === 0 ? (
              <p className="cart-empty">Sepetiniz boş</p>
            ) : (
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-item-img"
                    />

                    <div className="cart-item-info">
                      <h3>{item.title}</h3>
                      <p>{item.price.toLocaleString("tr-TR")} TL</p>

                      <span className="cart-subtotal">
                        Ara Toplam:{" "}
                        {(item.price * item.quantity).toLocaleString("tr-TR")}{" "}
                        TL
                      </span>
                      <div className="cart-quantity">
                        <button onClick={() => decreaseCartItem(item.id)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseCartItem(item.id)}>
                          +
                        </button>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeCartItem(item.id)}
                      >
                        Sepetten Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Toplam</span>
                <span>{totalPrice.toLocaleString("tr-TR")} TL</span>
              </div>
              <button className="checkout-btn">Siparişi Tamamla</button>
            </div>
          )}
        </aside>
      </>
    );
}
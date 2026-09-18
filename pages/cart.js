import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Cart.module.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const router = useRouter();

  const shipping = items.length > 0 ? 5 : 0;
  const total = totalPrice + shipping;

  return (
    <div className="page">
      <Head>
        <title>Корзина - Prnoia Store</title>
      </Head>
      <div className="container">
        <h1 className="section-title">Корзина</h1>
        <p className="section-subtitle">
          {items.length > 0
            ? `Товаров в корзине: ${items.length}`
            : "Ваша корзина пока пуста"}
        </p>

        {items.length === 0 ? (
          <div className="empty-state">
            <h2>Здесь пока ничего нет</h2>
            <p style={{ marginBottom: 24 }}>
              Добавьте товары из каталога, чтобы оформить заказ.
            </p>
            <Link href="/" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.list}>
              {items.map((item) => (
                <div key={item.id} className={`card ${styles.item}`}>
                  <div className={styles.itemImage}>
                    {}
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className={styles.itemInfo}>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <span className={styles.itemPrice}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className={styles.itemQty}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            <div className={`card ${styles.summary}`}>
              <h2 className={styles.summaryTitle}>Итого</h2>
              <div className={styles.summaryRow}>
                <span>Товары</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>К оплате</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-block"
                style={{ marginTop: 20 }}
                onClick={() => router.push("/checkout")}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

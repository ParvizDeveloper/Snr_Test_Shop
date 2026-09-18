import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Product.module.css";

export default function ProductPage({ product, error }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (router.isFallback) {
    return <div className="spinner" />;
  }

  if (error || !product) {
    return (
      <div className="page container">
        <div className="error-box">
          <h2>Товар не найден</h2>
          <p>{error || "Такого товара не существует."}</p>
          <Link href="/" className="btn btn-outline" style={{ marginTop: 16 }}>
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="page">
      <Head>
        <title>{product.title} — Nebula Store</title>
      </Head>
      <div className="container">
        <Link href="/" className={styles.back}>
          ← Назад в каталог
        </Link>

        <div className={styles.layout}>
          <div className={styles.imageWrap}>
            {}
            <img src={product.image} alt={product.title} />
          </div>

          <div className={styles.info}>
            <span className="badge">{product.category}</span>
            <h1 className={styles.title}>{product.title}</h1>

            {product.rating && (
              <div className={styles.rating}>
                ★ {product.rating.rate} · {product.rating.count} отзывов
              </div>
            )}

            <div className={styles.price}>${product.price.toFixed(2)}</div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              <div className={styles.qtyControl}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToCart}
              >
                {added ? "Добавлено в корзину!" : "Добавить в корзину"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    const paths = products.map((p) => ({ params: { id: String(p.id) } }));

    return { paths, fallback: "blocking" };
  } catch (err) {
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
    if (!res.ok) {
      throw new Error("Товар не найден");
    }
    const product = await res.json();

    if (!product || !product.id) {
      return { notFound: true };
    }

    return {
      props: { product },
      revalidate: 3600,
    };
  } catch (err) {
    return {
      props: { product: null, error: "Не удалось загрузить товар." },
      revalidate: 60,
    };
  }
}

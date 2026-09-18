import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Link href={`/product/${product.id}`} className={`card ${styles.card}`}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className={styles.body}>
        <span className="badge">{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button
            type="button"
            className={`btn btn-primary ${styles.addBtn}`}
            onClick={handleAdd}
          >
            {justAdded ? "Добавлено" : "В корзину"}
          </button>
        </div>
      </div>
    </Link>
  );
}

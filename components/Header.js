import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { totalCount } = useCart();
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>P</span>
          <span>Prnoia Store</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/"
            className={`${styles.navLink} ${
              isActive("/") ? styles.navLinkActive : ""
            }`}
          >
            Каталог
          </Link>
          <Link href="/cart" className={styles.cartLink}>
            Корзина
            {totalCount > 0 && (
              <span className={styles.cartCount}>{totalCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

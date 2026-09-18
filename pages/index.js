import { useMemo, useState } from "react";
import Head from "next/head";
import ProductCard from "@/components/ProductCard";
import styles from "@/styles/Home.module.css";

export default function Home({ products, error }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    if (!products) return [];
    return ["all", ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="page">
      <Head>
        <title>Prnoia shop - каталог товаров</title>
        <meta
          name="description"
          content="Витрина товаров с корзиной и оформлением заказа"
        />
      </Head>

      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Добро пожаловать в <span>Prnoia Store</span>
          </h1>
        </div>

        {error && (
          <div className="error-box">
            <h2>Не удалось загрузить товары</h2>
            <p>{error}</p>
          </div>
        )}

        {!error && (
          <>
            <div className={styles.filters}>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`${styles.filterBtn} ${
                    activeCategory === category ? styles.filterBtnActive : ""
                  }`}
                >
                  {category === "all" ? "Все товары" : category}
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status}`);
    }
    const products = await res.json();

    return {
      props: { products },
      revalidate: 3600,
    };
  } catch (err) {
    return {
      props: {
        products: [],
        error: "Проверьте подключение к интернету и повторите попытку.",
      },
      revalidate: 60,
    };
  }
}

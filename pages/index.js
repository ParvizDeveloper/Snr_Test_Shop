import { useMemo, useState } from "react";
import Head from "next/head";
import ProductCard from "@/components/ProductCard";
import styles from "@/styles/Home.module.css";

export default function Home({ products, error }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("")

  const categories = useMemo(() => {
    if (!products) return [];
    return ["all", ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((p) =>
        activeCategory === "all" ? true : p.category === activeCategory
      )
      .filter((p) =>
        p.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )

  }, [products, activeCategory, searchTerm]);

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
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск товаров"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.filters}>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`${styles.filterBtn} ${activeCategory === category ? styles.filterBtnActive : ""
                    }`}
                >
                  {category === "all" ? "Все товары" : category}
                </button>
              ))}
            </div>


            {filteredProducts.length === 0 ? (
              <p className={styles.noResults}>Ничего не найдено</p>
            ) : (
              <div className={styles.grid}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);

    const products = await res.json();

    return {
      props: { products, error: null },
      // без revalidate — страница остаётся полностью статичной
    };
  } catch (err) {
    return {
      props: { products: [], error: err.message || "Не удалось загрузить товары" },
    };
  }
}
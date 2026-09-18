import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Checkout.module.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  zip: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "Укажите имя и фамилию";

  if (!form.email.trim()) {
    errors.email = "Укажите email";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Некорректный email";
  }

  if (!form.phone.trim()) errors.phone = "Укажите телефон";

  if (!form.city.trim()) errors.city = "Укажите город";
  if (!form.address.trim()) errors.address = "Укажите адрес доставки";

  if (!form.zip.trim()) {
    errors.zip = "Укажите индекс";
  } else if (!/^\d{4,6}$/.test(form.zip.trim())) {
    errors.zip = "Индекс должен содержать 4-6 цифр";
  }

  if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ""))) {
    errors.cardNumber = "Номер карты должен содержать 16 цифр";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry.trim())) {
    errors.cardExpiry = "Формат ММ/ГГ";
  }

  if (!/^\d{3}$/.test(form.cardCvc.trim())) {
    errors.cardCvc = "3 цифры";
  }

  return errors;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const shipping = items.length > 0 ? 5 : 0;
  const total = totalPrice + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // типо запрос на сервер оформления заказа
    await new Promise((resolve) => setTimeout(resolve, 900));

    const generatedOrderNumber = `NB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNumber);
    setOrderComplete(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Корзина пуста</h2>
          <p style={{ marginBottom: 24 }}>
            Добавьте товары, прежде чем оформлять заказ.
          </p>
          <Link href="/" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="page container">
        <div className={`card ${styles.successWrap}`}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Заказ оформлен!</h1>
          <p className={styles.successText}>
            Номер вашего заказа: <strong>{orderNumber}</strong>. Мы отправили
            подтверждение на указанный email.
          </p>
          <Link href="/" className="btn btn-primary">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Head>
        <title>Оформление заказа - Prnoia Store</title>
      </Head>
      <div className="container">
        <h1 className="section-title">Оформление заказа</h1>
        <p className="section-subtitle">
          Заполните данные для доставки и оплаты
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.layout}>
            <div className={`card ${styles.formCard}`}>
              <h2 className={styles.formTitle}>Контактные данные</h2>

              <div className={styles.field + (errors.fullName ? ` ${styles.fieldError}` : "")}>
                <label htmlFor="fullName">Имя и фамилия</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                />
                {errors.fullName && (
                  <div className={styles.errorText}>{errors.fullName}</div>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field + (errors.email ? ` ${styles.fieldError}` : "")}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div className={styles.errorText}>{errors.email}</div>
                  )}
                </div>

                <div className={styles.field + (errors.phone ? ` ${styles.fieldError}` : "")}>
                  <label htmlFor="phone">Телефон</label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                  />
                  {errors.phone && (
                    <div className={styles.errorText}>{errors.phone}</div>
                  )}
                </div>
              </div>

              <h2 className={styles.formTitle}>Адрес доставки</h2>

              <div className={styles.row}>
                <div className={styles.field + (errors.city ? ` ${styles.fieldError}` : "")}>
                  <label htmlFor="city">Город</label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ташкент"
                  />
                  {errors.city && (
                    <div className={styles.errorText}>{errors.city}</div>
                  )}
                </div>

                <div className={styles.field + (errors.zip ? ` ${styles.fieldError}` : "")}>
                  <label htmlFor="zip">Индекс</label>
                  <input
                    id="zip"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="100000"
                  />
                  {errors.zip && (
                    <div className={styles.errorText}>{errors.zip}</div>
                  )}
                </div>
              </div>

              <div className={styles.field + (errors.address ? ` ${styles.fieldError}` : "")}>
                <label htmlFor="address">Адрес</label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="ул. Амира Темура, 15"
                />
                {errors.address && (
                  <div className={styles.errorText}>{errors.address}</div>
                )}
              </div>

              <h2 className={styles.formTitle}>Оплата</h2>

              <div className={styles.field + (errors.cardNumber ? ` ${styles.fieldError}` : "")}>
                <label htmlFor="cardNumber">Номер карты</label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
                {errors.cardNumber && (
                  <div className={styles.errorText}>{errors.cardNumber}</div>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field + (errors.cardExpiry ? ` ${styles.fieldError}` : "")}>
                  <label htmlFor="cardExpiry">Срок действия</label>
                  <input
                    id="cardExpiry"
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={handleChange}
                    placeholder="ММ/ГГ"
                  />
                  {errors.cardExpiry && (
                    <div className={styles.errorText}>{errors.cardExpiry}</div>
                  )}
                </div>

                <div className={styles.field + (errors.cardCvc ? ` ${styles.fieldError}` : "")}>
                  <label htmlFor="cardCvc">CVC</label>
                  <input
                    id="cardCvc"
                    name="cardCvc"
                    value={form.cardCvc}
                    onChange={handleChange}
                    placeholder="123"
                    inputMode="numeric"
                  />
                  {errors.cardCvc && (
                    <div className={styles.errorText}>{errors.cardCvc}</div>
                  )}
                </div>
              </div>
            </div>

            <div className={`card ${styles.summary}`}>
              <h2 className={styles.summaryTitle}>Ваш заказ</h2>

              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className={styles.summaryItem}>
                <span>Доставка</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>К оплате</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                style={{ marginTop: 20 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Оформляем..." : "Подтвердить заказ"}
              </button>

              <Link
                href="/cart"
                className="btn btn-outline btn-block"
                style={{ marginTop: 10 }}
              >
                Вернуться в корзину
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

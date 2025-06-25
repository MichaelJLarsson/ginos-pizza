import { useState, useEffect, useContext } from "react";
import Pizza from "../Pizza";
import Cart from "../Cart";
import { CartContext } from "../context.js";
import { createLazyFileRoute } from "@tanstack/react-router";

const intl = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 1,
});

export const Route = createLazyFileRoute("/order")({ component: Order });

function Order() {
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  let price, selectedPizza;

  async function fetchPizzaTypes() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const pizzaRes = await fetch("/api/pizzas");
    const pizzaJson = await pizzaRes.json();
    setPizzaTypes(pizzaJson);
    setLoading(false);
  }

  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => {
      return pizzaType === pizza.id;
    });
    price = intl.format(selectedPizza.sizes[pizzaSize]);
  }

  async function checkout() {
    setLoading(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    setCart([]);
    setLoading(false);
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
        }}
      >
        <div>
          <div>
            <label htmlFor="pizza-type">Pizza Type</label>
            {!pizzaTypes.length ? (
              <p>Fetching pizza types...</p>
            ) : (
              <select
                name="pizza-type"
                value={pizzaType}
                onChange={(e) => setPizzaType(e.target.value)}
                id="pizza-type"
              >
                {pizzaTypes.map((pizzaType) => {
                  return (
                    <option key={pizzaType.id} value={pizzaType.id}>
                      {pizzaType.name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="pizza-size">Pizza Size</label>
            <div>
              <span>
                <input
                  checked={pizzaSize === "S"}
                  type="radio"
                  name="pizza-size"
                  value="S"
                  id="pizza-s"
                  onChange={() => setPizzaSize("S")}
                />
                <label htmlFor="pizza-s">Small</label>
              </span>
              <span>
                <input
                  checked={pizzaSize === "M"}
                  type="radio"
                  name="pizza-size"
                  value="M"
                  id="pizza-m"
                  onChange={() => setPizzaSize("M")}
                />
                <label htmlFor="pizza-m">Medium</label>
              </span>
              <span>
                <input
                  checked={pizzaSize === "L"}
                  type="radio"
                  name="pizza-size"
                  value="L"
                  id="pizza-l"
                  onChange={() => setPizzaSize("L")}
                />
                <label htmlFor="pizza-l">Large</label>
              </span>
            </div>
          </div>
          <button type="submit">Add to Cart</button>
        </div>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <div className="order-pizza">
            <Pizza
              name={selectedPizza.name}
              description={selectedPizza.description}
              image={selectedPizza.image}
            />
            <p>{price}</p>
          </div>
        )}
      </form>
      {loading ? (
        <h2>Loading... </h2>
      ) : (
        <Cart checkout={checkout} cart={cart} />
      )}
    </div>
  );
}

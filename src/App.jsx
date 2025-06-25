import { useState } from "react";
import { createRoot } from "react-dom/client";
import Order from "./Order.jsx";
import PizzaOfTheDay from "./PizzaOfTheDay.jsx";
import Header from "./Header.jsx";
import { CartContext } from "./context.js";

const App = () => {
  const cartHook = useState([]);
  return (
    <div>
      <CartContext.Provider value={cartHook}>
        <Header />
        <Order />
        <PizzaOfTheDay />
      </CartContext.Provider>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);

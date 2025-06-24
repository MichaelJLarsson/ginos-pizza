import { createRoot } from "react-dom/client";
import Order from "./Order.jsx";
import PizzaOfTheDay from "./PizzaOfTheDay.jsx";

const App = () => {
  return (
    <div>
      <h1>Padre Gino's</h1>
      <Order />
      <PizzaOfTheDay />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);

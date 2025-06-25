import { useState } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { CartContext } from "../context.js";
import Header from "../Header.jsx";
import PizzaOfTheDay from "../PizzaOfTheDay.jsx";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => {
    const cartHook = useState([]);
    return (
      <>
        <CartContext.Provider value={cartHook}>
          <div>
            <Header />
            <Outlet />
            <PizzaOfTheDay />
          </div>
        </CartContext.Provider>
        <TanStackRouterDevtools />
      </>
    );
  },
});

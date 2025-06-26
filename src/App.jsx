import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);

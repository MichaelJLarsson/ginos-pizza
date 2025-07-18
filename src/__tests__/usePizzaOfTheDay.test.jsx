import createFetchMock from "vitest-fetch-mock";
import { vi, test, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay.js";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const testPizza = {
  id: "calabrese",
  name: "The Calabrese Pizza",
  category: "Supreme",
  description:
    "Salami, Pancetta, Tomatoes, Red Onions, Friggitello Peppers, Garlic",
  image: "/public/pizzas/calabrese.webp",
  sizes: { S: 12.25, M: 16.25, L: 20.25 },
};
const jsonTestPizza = JSON.stringify(testPizza);

test("to be null on initial load", async () => {
  fetch.mockResponseOnce(jsonTestPizza);
  const { result } = renderHook(() => usePizzaOfTheDay(""));
  expect(result.current).toBeNull();
});

test("To call the API and get the Pizza of the day", async () => {
  fetch.mockResponseOnce(jsonTestPizza);
  const { result } = renderHook(() => usePizzaOfTheDay(""));
  await waitFor(async () => {
    expect(result.current).toEqual(testPizza);
  });
  expect(fetchMocker).toBeCalledWith("/api/pizza-of-the-day");
});

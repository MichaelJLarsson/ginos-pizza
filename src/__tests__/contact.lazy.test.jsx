import createFetchMock from "vitest-fetch-mock";
import { test, vi, expect, beforeEach, afterEach } from "vitest";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Route } from "../routes/contact.lazy";
import { render, fireEvent, cleanup } from "@testing-library/react";

const queryClient = new QueryClient();
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();
  queryClient.clear();
});

afterEach(cleanup);

test("Can submit contact form", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  );

  const nameInput = screen.getByPlaceholderText("Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const msgTextArea = screen.getByPlaceholderText("Message");

  const testData = {
    name: "Mikael",
    email: "hello@mikaellarsson.com",
    message: "Testing message!",
  };

  nameInput.value = testData.name;
  emailInput.value = testData.email;
  msgTextArea.value = testData.message;

  const button = screen.getByRole("button");
  button.click();

  const h3 = await screen.findByRole("heading", { level: 3 });
  expect(h3.innerText).toContain("Submitted");

  const requests = fetchMocker.requests();
  expect(requests.length).toBe(1);
  expect(requests[0].url).toBe("/api/contact");
  expect(fetchMocker).toHaveBeenCalledWith("/api/contact", {
    body: JSON.stringify(testData),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
});

test("Form cannot be submitted with invalid email", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  );

  const nameInput = screen.getByPlaceholderText("Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const msgTextArea = screen.getByPlaceholderText("Message");

  nameInput.value = "Mikael";
  emailInput.value = "not-an-email";
  msgTextArea.value = "Testing message!";

  const button = screen.getByRole("button");
  button.click();

  // Form should not submit, so no heading appears
  await expect(screen.findByRole("heading", { level: 3 })).rejects.toThrow();

  const requests = fetchMocker.requests();
  expect(requests.length).toBe(0);
});

test("Form cannot be submitted with empty required fields", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }));
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  );

  const nameInput = screen.getByPlaceholderText("Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const msgTextArea = screen.getByPlaceholderText("Message");

  nameInput.value = "";
  emailInput.value = "";
  msgTextArea.value = "";

  const button = screen.getByRole("button");
  fireEvent.click(button);

  // Form should not submit, so no heading appears
  const h3 = screen.findByRole("heading", { level: 3 });
  await expect(h3).rejects.toThrow();

  const requests = fetchMocker.requests();
  expect(requests.length).toBe(0);
});

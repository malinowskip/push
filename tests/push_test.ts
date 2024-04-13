import { assertEquals } from "https://deno.land/std@0.222.1/assert/assert_equals.ts";
import { push } from "../mod.ts";

async function mockPush(
  ...args: Parameters<typeof push>
): Promise<Parameters<typeof fetch>> {
  // @ts-ignore override fetch for testing purposes
  globalThis.fetch = function (
    ...args: Parameters<typeof fetch>
  ): Promise<Parameters<typeof fetch>> {
    return args as unknown as Promise<Parameters<typeof fetch>>;
  };
  return (await push(...args)) as unknown as Promise<Parameters<typeof fetch>>;
}

const testParams = {
  user: "USER",
  token: "TOKEN",
  message: "Hello, world!",
};

const [input, init] = await mockPush(testParams);

Deno.test("Uses the correct API endpoint", () => {
  assertEquals(input, "https://api.pushover.net/1/messages.json");
});

Deno.test("Issues a POST request", () => {
  assertEquals(init?.method, "POST");
});

Deno.test("Request body matches the provided parameters", () => {
  const inputParams = Object.entries(testParams);
  const sentParams = Array.from((init?.body as FormData).entries());
  assertEquals(inputParams, sentParams);
});

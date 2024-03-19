# @malinowskip/push

A small Deno utility for interacting with the
[Pushover Message API](https://pushover.net/api).

This package provides:

- a TypeScript module exposing a `push` function, which can be used to send
  notifications to the _Pushover Message API_ endpoint;
- a Deno command-line utility which may serve as an alternative to calling the
  Pushover Message API using curl.

## Usage examples

### Deno

```typescript
import { push } from "./mod.ts";

await push({
  user: "YOUR_USERNAME",
  token: "YOUR_TOKEN",
  message: "Hello, world!",
});
```

### CLI

```shell
// Send a message
deno run --allow-net https://raw.githubusercontent.com/malinowskip/push/main/cli.ts --user <YOUR_USERNAME> --token <YOUR_TOKEN> --message "Hello, world!"
```

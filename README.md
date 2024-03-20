# @malinowskip/push

A small Deno utility for sending Pushover notifications. In order to use the
API, it’s necessary to register a user and and application according to the
Pushover [documentation](https://pushover.net/api). A user key and an
application token is required to use the API.

This package provides:

- a TypeScript module exposing a `push` function, which can be used to send
  notifications to the _Pushover Message API_ endpoint;
- a Deno command-line utility which may serve as an alternative to calling the
  _Pushover Message API_ using curl.

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

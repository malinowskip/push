/**
 * @module
 * Utilities to send messages to the [Pushover Message
 * API](https://pushover.net/api) endpoint.
 */

/**
 * Based on the [Pushover Message API documentation](https://pushover.net/api).
 */
export interface PushoverMessage {
  /**
   * Your application’s API token.
   */
  token: string;

  /**
   * Your user/group key (or that of your target user), viewable when logged
   * into the Pushover dashboard; often referred to as USER_KEY in Pushover’s
   * documentation and code examples.
   */
  user: string;

  /**
   * Your message.
   */
  message: string;

  /**
   * A binary image attachment to send with the message.
   * @see https://pushover.net/api#attachments
   */
  attachment?: Blob;

  /**
   * A Base64-encoded image attachment to send with the message.
   * @see https://pushover.net/api#attachments
   */
  attachment_base64?: string;

  /**
   * The MIME type of the included attachment or attachment_base64.
   * @see https://pushover.net/api#attachments
   */
  attachment_type?: string;

  /**
   * The name of one of your devices to send just to that device instead of all
   * devices.
   * @see https://pushover.net/api#identifiers
   */
  device?: string;

  /**
   * Set to 1 to enable HTML parsing.
   */
  html?: 1;

  /**
   * @see https://pushover.net/api#priority
   */
  priority?: -2 | -1 | 0 | 1 | 2;

  /**
   * Seconds of interval between notification retries (applicable and required
   * if `priority`: `2` is set).
   * @see https://pushover.net/api#priority2
   */
  retry?: number;

  /**
   * Seconds after which retries will cease (applicable and required if
   * `priority`: `2` is set).
   * @see https://pushover.net/api#priority2
   */
  expire?: number;

  /**
   * A publicly-accessible URL that Pushover servers will send a request to when
   * the user has acknowledged the notification (if `priority:` `2` is set).
   * @see https://pushover.net/api#priority2
   */
  callback?: string;

  /**
   * The name of a supported sound to override your default sound choice.
   * @see https://pushover.net/api#sounds
   */
  sound?: string;

  /**
   * A Unix timestamp of a time to display instead of when our API received it.
   * @see https://pushover.net/api#timestamp
   */
  timestamp?: number;

  /**
   * Your message’s title, otherwise your app’s name is used.
   */
  title?: string;

  /**
   * A number of seconds that the message will live, before being deleted
   * automatically.
   * @see https://pushover.net/api#ttl
   */
  ttl?: number;

  /**
   * A supplementary URL to show with your message.
   * @see https://pushover.net/api#urls
   */
  url?: string;

  /**
   * A title for the URL specified as the url parameter, otherwise just the URL
   * is shown.
   * @see https://pushover.net/api#urls
   */
  url_title?: string;
}

/**
 * Push a message to the *Pushover Message API* endpoint.
 * @see https://pushover.net/api
 *
 * ## Example
 * ```ts
 * await push({user: "YOUR_USERNAME", token: "YOUR_TOKEN", message: "Hello, world!"})
 * ```
 */
export async function push(message: PushoverMessage): Promise<Response> {
  const formData = new FormData();

  for (const [key, value] of Object.entries(message)) {
    formData.append(key, typeof value === "number" ? value.toString() : value);
  }

  return await fetch("https://api.pushover.net/1/messages.json", {
    body: formData,
    method: "POST",
  });
}

import {
  ArgumentValue,
  Command,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { push, PushoverMessage } from "./lib.ts";
import packageMeta from "./deno.json" with { type: "json" };

const cmd = await new Command()
  .type("priority", priorityCliOptionType)
  .name("push")
  .version(packageMeta.version)
  .description(
    "Send Pushover (https://pushover.net/) notifications from the command line.",
  )
  .option("-t, --token <token:string>", "Application’s API token", {
    required: true,
  })
  .option("-u, --user <user:string>", "User key", { required: true })
  .option("-m, --message <message:string>", "Message", { required: true })
  .option(
    "-p, --priority <priority:priority>",
    "Priority: -2, -1, 0 (default), 1, or 2",
    {
      depends: ["retry", "expire"]
    }
  )
  .option(
    "-r, --retry <retry:number>",
    "How often (in seconds) the same priority 2 notification will be sent.",
    {
      depends: ["priority"],
    },
  )
  .option(
    "-e, --expire <expire:number>",
    "How many seconds a priority 2 notification will continue to be retried for.",
    { depends: ["priority"] },
  )
  .option("-d, --device <device:string>", "Device name")
  .option("-s, --sound <sound:string>", "Notification sound")
  .option("--timestamp <timestamp:number>", "UNIX timestamp")
  .option("--title <title:string>", "Message title")
  .option(
    "--ttl <ttl:number>",
    "Number of seconds after which the notification will disappear.",
  )
  .option("--url <url:string>", "A supplementary URL to show with your message")
  .option(
    "--url-title <url_title:string>",
    "Title for the URL specified as the url parameter.",
    { depends: ["url"] },
  )
  .option("--html", "Parse the message as HTML.", { value: (): 1 => 1 })
  .group("Image attachments")
  .option("-a, --attachment <attachment_path:string>", "Path to an image file.")
  .option("--attachment-base64 <attachment_base64:string>", "Base64 attachment")
  .option("--attachment-type <attachment_type:string>", "Attachment MIME type")
  .parse(Deno.args);

async function parseCliOptionsIntoMessage(
  options: typeof cmd.options,
): Promise<PushoverMessage> {
  let attachment: Blob | undefined;

  if (options.attachment) {
    try {
      const contents = await Deno.readFile(options.attachment);
      attachment = new Blob([contents]);
      delete options.attachment;
    } catch (e) {
      throw new Error(`Failed to read attachment file (${e.message}).`);
    }
  }

  const message: PushoverMessage = { ...options, attachment };

  return message;
}

function priorityCliOptionType({
  label,
  name,
  value,
}: ArgumentValue): -2 | -1 | 0 | 1 | 2 {
  const parsedValue = parseInt(value);
  if (
    parsedValue === -2 ||
    parsedValue === -1 ||
    parsedValue === 0 ||
    parsedValue === 1 ||
    parsedValue === 2
  ) {
    return parsedValue;
  }

  throw new Error(`${label} "${name}" must be one of -2, -1, 0, 1, or 2.`);
}

async function main() {
  const message = await parseCliOptionsIntoMessage(cmd.options);

  const response = await push(message);

  if (response.status !== 200) {
    const json = await response.json();
    if (json.errors instanceof Array) {
      for (const el of json.errors) {
        console.log(`Error: ${el.message}`);
      }
    } else {
      console.log("Error: Failed to send message.");
    }
  }
}

await main();

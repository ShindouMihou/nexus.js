# Nexus.js

*Slash commands for Discord.js, simplified.*

Neuxs.js is the Javascript port of the Java-Kotlin framework [Nexus](https://github.com/ShindouMihou/Nexus), unlike the original, the port 
is fairly barebones and doesn't intend to go beyond the basics of slash commands due to the following factors:
1. Synchronous nature of Javascript: Unlike the original framework heavily used on concurrency, 
we are limited to single-threaded executions here, which limits the potential for a lot of things such as auto-defers.

## Demo

```typescript
// commands/ping.ts
import {ChatInputCommandInteraction, SlashCommandUserOption} from "discord.js";
import {Command} from "@mihou/nexus.js";

export const PingCommand: Command = {
    name: "ping",
    description: "Pings a user.",
    options: [
        new SlashCommandUserOption().setName("user").setDescription("The user to pong.").setRequired(true)
    ],
    handler: (ev: ChatInputCommandInteraction) => {
        // do stuff here
    }
}
```

```typescript
// test.ts
import {Nexus} from "@mihou/nexus.js";

Nexus.manager.add(PingCommand)
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
    .on(Events.InteractionCreate, Nexus.onInteractionCreate)
    .once(Events.ClientReady, async client => {
        // Your other stuff here when the client is ready.
        
        Nexus.client = client
        await Nexus.synchronizer.sync()
    })
client.login(token)
```

## Installation
```shell
bun i @mihou/nexus.js
```
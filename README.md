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

// You can also add one or more commands directly using the conveinence function:
// Nexus.manager.many(PingCommand)

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

## Features

Nexus.js includes the following features from the original framework:
- [Middlewares](#middlewares): same concept as web frameworks' middlewares, tasks that are executed before the command, can also prevent the command from being dispatched.
- [Afterwares](#afterwares): the complete opposite of middlewares and are executed after the command is dispatched and does not disrupt the command from being dispatched.

### Middlewares

Middlewares are those executed before the command is dispatched, these are intended for things such as common
user role permission checking, or anything similar that can be extracted elsewhere. This is the same concept
as web frameworks' middlewares and can stop the command from being dispatched.

To create a middleware, simply add a new key-value to `Nexus.middlewares`, for example:
```typescript
Nexus.middlewares.set("nexus.log", (ev) => {
    console.log('User used the command ', ev.commandName)
    // Return true to continue to the next middleware, or dispatch the command if nothing more.
    return true
})
```

To use a middleware, you can either add it as a `global` middleware through:
```typescript
Nexus.globals.middlewares.push("nexus.log")
```

Add it as a command middleware by setting the `middlewares` option:
```typescript
export const PingCommand = {
    name: "ping",
    description: "pong",
    middlewares: ["nexus.log"],
    ...
}
```

Global middlewares take a higher priority over command middlewares, which means they are executed first before any other 
middleware. If your middleware depends on execution order, it's best to remember it, in addition, command middlewares are executed 
as their order in the array declaration is done.

### Afterwares

Afterwares are additional tasks that are to be executed after the command is dispatched, emphasis on dispatched,
which means this will be executed quite parallel with the command (although, with the single-threaded nature 
of Javascript, this should be about as soon as there is an idle time with the thread after dispatching).

To create an afterware, simply add a new key-value to `Nexus.afterwares`, for example:
```typescript
Nexus.afterwares.set("nexus.log", (ev) => {
    console.log('User used the command ', ev.commandName)
})
```

To use a afterware, you can either add it as a `global` afterware through:
```typescript
Nexus.globals.afterwares.push("nexus.log")
```

Add it as a command afterware by setting the `afterwares` option:
```typescript
export const PingCommand = {
    name: "ping",
    description: "pong",
    afterwares: ["nexus.log"],
    ...
}
```

Global afterwares take a higher priority over command afterwares, which means they are executed first before any other
afterware. If your afterware depends on execution order, it's best to remember it, in addition, command afterwares are executed
as their order in the array declaration is done.


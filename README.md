# Discord Bot Template

A lean, batteries-included [discord.js](https://discord.js.org) bot template built on a clean, layered TypeScript architecture. No database, no app-specific code — just the foundation and a `ping` command to copy from.

## Features

- **Layered architecture** — `core/` (pure domain, no discord.js), `discord/` (presentation), `shared/` (cross-cutting). Layer boundaries are enforced by ESLint.
- **Slash _and_ prefix commands** dispatched through a single `runCommandPipeline`, so access rules never drift between the two fronts.
- **Permissions** — declarative `scope` (`guild` / `mainGuildOnly` / `dm` / `anywhere`) + `authorization` (`everyone` / `owner`), plus an optional per-command `gate`.
- **Components V2** — fluent builders for containers, text, buttons, select menus, sections, separators and modals.
- **Self-updating interactive messages** — a `render`/`reduce` controller that re-renders on each interaction, with allow-lists and idle timeouts.
- **i18n** — typed `en` / `fr` language packs, resolved from the caller's Discord locale (swap in a per-user lookup once you add a database).
- **Dynamic loading** — commands and events are auto-discovered from their folders.
- **Typed config** — environment is read, validated and frozen once at startup; missing keys fail fast.
- **Tooling** — strict TypeScript, typed ESLint, Prettier, ESM with a `@/` path alias.

## Requirements

- Node.js **≥ 24**
- [pnpm](https://pnpm.io)

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill it in
pnpm deploy            # register the slash commands to your test guild
pnpm dev               # start the bot in watch mode
```

## Scripts

| Script             | What it does                                                     |
| ------------------ | ---------------------------------------------------------------- |
| `pnpm dev`         | Run the bot in watch mode (`tsx`).                               |
| `pnpm build`       | Compile to `dist/` (`tsc` + `tsc-alias`).                        |
| `pnpm start`       | Run the compiled bot (production).                               |
| `pnpm deploy`      | Register slash commands to the **test guild** (instant updates). |
| `pnpm deploy:prod` | Register commands for **production** (see below).                |
| `pnpm typecheck`   | Type-check without emitting.                                     |
| `pnpm lint`        | Lint (`pnpm lint:fix` to auto-fix).                              |
| `pnpm format`      | Format with Prettier (`pnpm format:check` to verify).            |

## Environment variables

| Variable                | Required | Description                                      |
| ----------------------- | :------: | ------------------------------------------------ |
| `DISCORD_TOKEN`         |    ✅    | Bot token.                                       |
| `APPLICATION_ID`        |    ✅    | Application (client) id.                         |
| `MAIN_GUILD_DISCORD_ID` |    ✅    | Main guild — target of `mainGuildOnly` commands. |
| `TEST_GUILD_DISCORD_ID` |    ✅    | Guild used by `pnpm deploy` for instant updates. |
| `OWNER_DISCORD_ID`      |    ✅    | User id treated as the bot owner.                |

## Project structure

```
src/
  core/            # Pure domain — no discord.js
    config/        # Env, read + validated once
    permissions/   # scope + authorization + requirements
    types.ts       # Supported locales
  discord/         # Presentation layer
    client/        # The gateway client
    commands/      # slash/ and prefix/ command modules
    components/    # Components V2 fluent builders
    events/        # Gateway event modules
    handlers/      # Dynamic command/event loaders
    interactions/  # Reply helpers + interactive messages
    lang/          # en/ and fr/ language packs
    presentations/ # State -> Container builders
    usecases/      # Command logic (transport-agnostic)
    registries/    # In-memory command tables + types
  shared/          # logger, Result
  deploy-commands.ts
  index.ts
```

## Adding a command

Create a module in `src/discord/commands/slash/<name>.ts` (and/or `commands/prefix/<name>.ts`) that `export default`s an object satisfying `SlashCommand` / `PrefixCommand` — the loader picks it up automatically. See `ping` for the full slash + prefix + presentation + use-case pattern. Then run `pnpm deploy`.

## Deploying commands

- **`pnpm deploy`** (development) — every command is registered to the **test guild**, where changes appear instantly.
- **`pnpm deploy:prod`** (production) — commands are split by scope:
  - `anywhere` / `guild` / `dm` → registered **globally**.
  - `mainGuildOnly` → registered to the **main guild** only.

## Adding a database

The template ships without persistence. To add one (e.g. Prisma), introduce a `core/persistence` client and `core/repositories`, then swap `resolveLocale` in `discord/locale.ts` for a per-user language lookup.

## License

PolyForm Noncommercial 1.0.0 — see [LICENSE](./LICENSE).

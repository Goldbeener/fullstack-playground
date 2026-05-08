# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pnpm-managed monorepo with Turborepo. Two apps (`server`, `web`) and two shared packages (`shared`, `config`). Purpose: validate full-stack scenarios like streaming and SSE.

## Stack

- **web**: Vue 3 (轻量级客户端)
- **server**: Node.js/TypeScript
- **shared**: Types, schemas, constants, utils shared across apps
- **config**: Shared TypeScript configs (`tsconfig.base.json`, `tsconfig.web.json`, `tsconfig.node.json`) and ESLint config
- **Linting/Formatting**: ESLint (`packages/config/eslint.config.mjs`)

## Common Commands

Run from repo root unless noted.

```bash
pnpm install                  # install all deps
pnpm dev                      # start all apps (via turbo)
pnpm build                    # build all packages/apps
pnpm lint                     # eslint
```

Single-app dev:
```bash
pnpm --filter server dev
pnpm --filter web dev
```

## Architecture Notes

- `packages/shared` is the source of truth for types and schemas — both `server` and `web` import from it. Add shared types there, not in app-local files.
- `packages/config` holds all base TS configs (`tsconfig.web.json` for Vue, `tsconfig.node.json` for server) and ESLint config; app-level `tsconfig.json` files extend from these.
- Turbo task graph is defined in `turbo.json` — check it before adding new scripts to understand caching and dependency order.
- The primary use case is streaming/SSE: server sends streamed responses, web consumes them. Keep that data flow in mind when adding routes or hooks.

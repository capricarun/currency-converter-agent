# Brief Agent — Currency Converter

An autonomous UX design agent that takes a design brief and runs it end to end: research plan,
competitive teardown, audience sizing, personas, prioritised features, information architecture —
and finishes by building a working interactive prototype you can actually type into.

**Live:** https://capricarun.github.io/currency-converter-agent/

Pre-loaded with this brief:

> **Design assignment: Currency Converter Mobile App.** Design a currency converter app (mobile or
> web) that provides users with a seamless and intuitive experience for converting currencies.
> Approach the project by considering: required research to understand user needs, target audience,
> key features and functions, and relevant user persona(s).

---

## What it does

Seven chained stages. Each one receives every earlier stage as context, so the personas are built
from the audience work, the features are argued from the personas, and the prototype is compiled
from the feature set.

| # | Stage | Output |
|---|-------|--------|
| 01 | Brief intake | Objective, scope, success metrics, constraints, open questions |
| 02 | Research plan | Six methods with samples and timings, non-leading research questions |
| 03 | Competitive teardown | Eight apps torn down, patterns extracted, the unclaimed gap |
| 04 | Audience & sizing | Five segments with shares, market context with sources, primary target |
| 05 | Personas | Three personas with jobs-to-be-done, plus an anti-persona |
| 06 | Feature definition | Fourteen features scored on MoSCoW, impact and effort |
| 07 | IA, flow & prototype | Screen map, primary flow, and the live prototype |

## Two ways to run it

**Without a key** — the agent runs immediately from an authored baseline built from desk research
(World Bank remittance pricing, FXC Intelligence flow data, RBI remittance figures, and a hands-on
teardown of the eight leading converter apps). Nothing to sign up for.

**With your own Anthropic key** — every stage is regenerated live by Claude, using forced tool calls
against a JSON schema per stage, streamed as it is written. Load a different brief and the agent
genuinely re-reasons about it rather than replaying a script.

The key is stored in your browser's local storage and posted directly to `api.anthropic.com`.
This is a static page on GitHub Pages: there is no backend, and nothing is proxied through any
server. Clear it any time from the same panel.

## The prototype

Stage 07 compiles a real converter, not a picture of one:

- Convert-as-you-type in both directions, with expression input (`25*3` works)
- 48 currencies, searchable by code or name, in a bottom sheet
- One-tap swap that repaints instantly and never blocks on the network
- Live mid-market rates from key-less endpoints, with a dated offline snapshot as fallback —
  and an honest banner when that fallback is in use
- **"What you'll actually get"** — the same amount through five routes (mid-market, digital
  transfer, card abroad, bank, airport bureau), with the loss shown in cash rather than percent.
  This is the design bet the teardown argues for: every incumbent shows a rate, almost none show
  what lands.
- 90-day trend read in plain language — "better than 70% of the last 90 days" — instead of a chart

## Design notes

The interface is a dark agent console; the prototype inside it is a light mobile app. That contrast
is deliberate — it keeps the thing being designed visually distinct from the thing doing the
designing.

Rate data comes from [Frankfurter](https://frankfurter.dev/) (ECB and 84 central banks, no key,
no quota) with [ExchangeRate-API's open endpoint](https://www.exchangerate-api.com/docs/free) as a
fallback. Cost-model percentages are anchored on the World Bank's Remittance Prices Worldwide
average of 6.36% (Q3 2025) and published card-scheme markups; they are labelled as typical, not
quoted.

## Running it locally

One file, no build step, no dependencies.

```bash
git clone https://github.com/capricarun/currency-converter-agent.git
cd currency-converter-agent
open index.html          # or: python3 -m http.server 8000
```

## Exporting

**Export submission** produces a standalone HTML file of the whole run — every stage, styled,
self-contained — suitable for sending on or printing to PDF.

---

Built with [Claude](https://claude.com/claude-code).

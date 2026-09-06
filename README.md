# Currenzy

A conversational currency agent. Ask in plain language; it works out what you
mean, fetches what it needs, shows its reasoning, and tells you what it would do.

**Live:** https://capricarun.github.io/currency-converter-agent/

---

## Why it reads as an agent

Chat bubbles alone don't make an agent — bolt them onto a converter and you get a
slower converter. Four things do the work:

**Natural language is the only input.** There are no pickers and no keypad.
*"How much is 2,400 dollars in rupees?"*, *"₹50,000 in pounds"*, *"should I send
money to Nigeria this week"* — names, ISO codes, countries, demonyms and symbols
all resolve.

**It shows its working.** Every turn opens with a live trace — `parse_request →
convert · USD→INR · 2,400`, `fetch_rates`, `fetch_history`, `score_position` —
each step spinning then ticking as it completes. This is the strongest signal
that something is reasoning rather than looking up.

**It has opinions.** Ask whether now is a good time and it doesn't hand back a
chart: *"I'd wait if you can. Today is only better than 35% of the last ninety
days. At the 90-day high you'd have received about ₹4,801 more on this amount."*

**It remembers.** *"What about pounds?"* keeps your amount and source currency.
The trace marks recalled slots with `↺ amount + pair`, so the memory is visible
rather than spooky. It also opens proactively: if the pair you last looked at has
moved more than 0.25% since your last visit, it says so and quantifies it against
your amount.

## The understanding engine

No model, no API key, no cost — a domain parser written for this one job.
Currency conversion is narrow enough that this is the better engineering choice:
it answers instantly, works offline, and every visitor gets a working agent the
moment the link opens.

- **Currencies** — 48, matched against a lexicon of codes, unit names, countries,
  demonyms and symbols. Longest phrase wins, so *"australian dollar"* beats
  *"dollar"* and *"moroccan dirham"* beats *"dirham"*.
- **Amounts** — commas, decimals, and `k` / `m` / `bn` / `lakh` / `crore`.
  Durations are stripped first, so *"the last 90 days"* is never read as ninety
  of anything.
- **Direction** — `to` / `into` / `in` / `→` split source from target; otherwise
  first mentioned is source.
- **Intent** — convert, rate, cost comparison, timing, trend, compare, watchlist
  add/remove/show, help, and a fallback that says plainly what it didn't catch.
- **Gaps** are filled from the conversation, then persisted between sessions.

## What it can tell you

| Ask | It does |
|-----|---------|
| *"2,400 dollars in rupees"* | Converts, at the mid-market rate, with freshness stated |
| *"What would actually land?"* | Five routes — mid-market, digital transfer, card, bank, bureau — with the loss in cash and a recommendation |
| *"Is now a good time?"* | Fetches 90 days, scores today's position, gives a verdict and quantifies the upside |
| *"Show the 90-day trend"* | Chart plus a plain-language read of the swing |
| *"Watch the Swiss franc"* | Keeps it against your amount, across sessions |

## Honest about its data

Rates come from [Frankfurter](https://frankfurter.dev/) (ECB and 84 central
banks), falling back to [ExchangeRate-API's open endpoint](https://www.exchangerate-api.com/docs/free).
When every feed refuses, it uses a dated snapshot and *says so* — in the header,
in the card, and in its own sentences. It never passes stale numbers off as live.

Route percentages are typical published markups anchored on the World Bank's
Remittance Prices Worldwide average of 6.36% (Q3 2025). They are labelled as
typical, not quoted as offers.

## Running it

One file, no dependencies, no build step.

```bash
git clone https://github.com/capricarun/currency-converter-agent.git
cd currency-converter-agent
open index.html          # or: python3 -m http.server 8000
```

Mobile-first: full-viewport layout, safe-area insets, haptics, 44px targets,
light and dark following the system with a manual override. Framed as a device
on wider screens.

---

Built with [Claude](https://claude.com/claude-code).

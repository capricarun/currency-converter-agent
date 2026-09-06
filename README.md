# Currenzy

A conversational currency agent. Ask in plain language; it works out what you
mean, fetches what it needs, shows its reasoning, and tells you what it would do.

**Live:** https://capricarun.github.io/currency-converter-agent/

Public, no sign-in, works on any device. On a phone, open it and choose
**Add to Home Screen** — it installs as a standalone app and still opens with
no signal, which is when a currency agent is most useful.

---

## Why it reads as an agent

Chat bubbles alone don't make an agent — bolt them onto a converter and you get a
slower converter. Four things do the work:

**Natural language is the only input.** There are no pickers and no keypad.
*"How much is 2,400 dollars in rupees?"*, *"₹50,000 in pounds"*, *"1,000 dollars
in Germany"*, *"convert 900 dollars to Toronto"* — currency names, ISO codes,
countries, demonyms, major cities and symbols all resolve. You never have to
know that Portugal is the euro or that Dubai is the dirham.

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
| *"Where does my money go furthest?"* | Ranks the five destinations this currency most often goes to, best first — tap one to convert |
| *"Show the 90-day trend"* | Chart plus a plain-language read of the swing |
| *"Watch the Swiss franc"* | Keeps it against your amount, across sessions |

## Ranking the five destinations

Every conversion also comes back with the five places that currency most often
goes — real corridors, not trading volume, so INR offers USD, AED, GBP, SAR and
SGD while GBP offers EUR, USD, INR, PKR and NGN.

Ranking them needs a basis, and the converted *amounts* are no basis at all:
¥362,880 and €2,196 are the same money. What is comparable is where each pair
sits inside **its own** 90-day range. A pair at 92% is near its own best in three
months; one at 20% is near its worst. That normalises to 0–100 across every
currency, so the bars can be read against each other at a glance.

Ninety days of history for all five arrives in a single request. Each row is a
button — tapping it converts into that currency, which is the point: the
recommendation is something you can act on rather than read.

The card says plainly that a high score means *this pair is near its own 90-day
best*, not that the currency is "strong" — a distinction that is easy to imply
by accident and misleading if you do.

## Honest about its data

Rates come from [Frankfurter](https://frankfurter.dev/) (ECB and 84 central
banks), falling back to [ExchangeRate-API's open endpoint](https://www.exchangerate-api.com/docs/free).
When every feed refuses, it uses a dated snapshot and *says so* — in the header,
in the card, and in its own sentences. It never passes stale numbers off as live.

Route percentages are typical published markups anchored on the World Bank's
Remittance Prices Worldwide average of 6.36% (Q3 2025). They are labelled as
typical, not quoted as offers.

## Installing and staying current

The app ships a manifest and a service worker, so it installs to a home screen
and launches full-screen with its own icon.

The service worker is deliberately **network-first**. Cache-first is the usual
choice and it is why installed web apps go stale for days — and this one was
already being served an old build by GitHub's CDN for minutes after each
deploy. Here the network always wins when it is reachable; the cache exists
only so the agent still opens offline. Cross-origin rate feeds are never
cached at all, because a stale exchange rate shown as live is the one thing
this app refuses to do.

When a new build takes over, the page reloads itself once — and only when
replacing an existing worker, so a first install never loops.

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

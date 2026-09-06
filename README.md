# Currenzy

A currency converter that answers the question people are actually asking.

**Live:** https://capricarun.github.io/currency-converter-agent/

Every converter on the market shows you a rate. Almost none show you what will
actually land in your account. Currenzy makes that gap the centre of the product.

---

## The design bet

A teardown of the eight leading converters — XE, Wise, Revolut, OANDA, Google,
Currency Converter Plus and two top free Android apps — turns up the same shape
every time: a mid-market rate, a currency picker, and offline caching. What
almost none of them do is connect that reference rate to the money you receive.

The global average cost of sending money is **6.36%** of the amount sent
(World Bank, Remittance Prices Worldwide, Q3 2025). That cost is mostly hidden
inside the rate rather than shown as a fee. So the home screen converts, and the
screen below it shows the same amount through five routes — mid-market, digital
transfer, card abroad, bank transfer, airport bureau — with the loss stated in
cash, not percent. Percentages are abstract; people act on money.

## What's in it

**Convert** — a custom keypad rather than the OS keyboard, so the layout never
jumps and the whole task stays on one screen. Type into either side; the other
recalculates. The keypad steps aside as soon as you scroll to the comparison,
and returns when you scroll back.

**Watchlist** — one amount held against every currency you care about, each row
carrying its own rate.

**Rates** — ninety days of history from the ECB, read in plain language
("today's rate beats 62% of the last 90 days") instead of a chart you have to
interpret. Alert threshold set 2% above today.

## Details worth noting

- **Offline is a state, not an error.** Rates come from key-less endpoints with
  a dated snapshot behind them. When the snapshot is in use the app says so —
  it never passes stale numbers off as live. The freshness pill carries the age
  in words.
- **Amounts never clip.** Type sizes are set by measuring real overflow rather
  than counting characters, because the room left depends on how wide the
  currency chip beside it is. Past a billion it falls back to compact notation.
- **Swap never waits on the network.** It repaints immediately from what's
  already loaded and upgrades in the background if fresher rates arrive.
- **Light and dark** both first-class, following the system with a manual
  override.
- Haptics on every key, 44px minimum targets, safe-area insets, reduced-motion
  respected.

## Running it

One file. No build step, no dependencies, no backend.

```bash
git clone https://github.com/capricarun/currency-converter-agent.git
cd currency-converter-agent
open index.html          # or: python3 -m http.server 8000
```

Rate data: [Frankfurter](https://frankfurter.dev/) (ECB and 84 central banks),
falling back to [ExchangeRate-API's open endpoint](https://www.exchangerate-api.com/docs/free).
Route percentages are typical published markups, labelled as such in the app —
they are not live quotes.

---

Built with [Claude](https://claude.com/claude-code).

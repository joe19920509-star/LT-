import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articles = [
  {
    slug: "fed-signals-patience-on-rates",
    title: "Fed Signals Patience as Inflation Cools",
    dek: "Central bankers weigh labor-market slack against sticky services prices.",
    category: "Markets",
    excerpt:
      "Federal Reserve officials opened the door to a slower pace of easing after the latest CPI print showed core services inflation holding above target.",
    body: `Federal Reserve officials opened the door to a slower pace of easing after the latest CPI print showed core services inflation holding above target.

The committee's post-meeting statement removed language that had previously emphasized "progress" on inflation, replacing it with a more balanced assessment of risks on both sides of the mandate.

Traders in fed funds futures pared back bets on a March cut, while the dollar strengthened against a basket of major currencies.

**What to watch next:** Chair remarks at the Jackson Hole symposium and revisions to payroll data, which could shift the median dot plot.

**For subscribers:** Our desk expects two 25bp moves this year, with the first likely in Q3 unless labor cracks widen materially.`,
  },
  {
    slug: "asia-equities-outperform-on-policy-support",
    title: "Asia Equities Outperform on Policy Support",
    dek: "Regional benchmarks notch a fifth straight week of gains.",
    category: "Asia",
    excerpt:
      "Investors rotated into exporters and hardware supply chains after Beijing outlined incremental stimulus for consumer durables.",
    body: `Investors rotated into exporters and hardware supply chains after Beijing outlined incremental stimulus for consumer durables.

South Korea's Kospi led gains in the region, while Japan's Nikkei 225 paused after a sharp yen-driven rally.

Cross-border flows into EM Asia turned positive for the first time since January, according to EPFR-tracked funds.

**Portfolio angle:** Quality compounders with net-cash balance sheets outperformed high-beta retail names.

**Subscriber note:** We highlight three ADRs with improving free-cash-flow conversion and below-peer valuations in our weekly Asia screen.`,
  },
  {
    slug: "credit-spreads-tighten-on-issuance-lull",
    title: "Credit Spreads Tighten on Issuance Lull",
    dek: "Investment-grade supply falls short of seasonal averages.",
    category: "Credit",
    excerpt:
      "Corporate bond spreads compressed as dealers reported lighter-than-expected new-issue calendars ahead of quarter-end.",
    body: `Corporate bond spreads compressed as dealers reported lighter-than-expected new-issue calendars ahead of quarter-end.

BBB industrials led the tightening move, while CCCs were more mixed as idiosyncratic restructuring headlines weighed on a handful of names.

Primary markets are expected to reopen in size after earnings season, which could test the recent rally.

**Risk:** A re-acceleration of supply without a matching pickup in demand could widen spreads by 15–25bp, our credit strategists estimate.

**Full analysis:** Subscribers can access our issuer-by-issuer liquidity heat map updated daily.`,
  },
  {
    slug: "energy-volatility-and-the-refining-margin",
    title: "Energy Volatility and the Refining Margin",
    dek: "Crude whipsaws on inventory builds and OPEC+ guidance.",
    category: "Commodities",
    excerpt:
      "Brent futures swung in a four-dollar range after weekly stockpiles surprised to the upside and refining margins softened.",
    body: `Brent futures swung in a four-dollar range after weekly stockpiles surprised to the upside and refining margins softened.

Refiners on the U.S. Gulf Coast cited maintenance schedules and weaker diesel demand from freight as headwinds.

Options markets priced a higher implied volatility term structure, suggesting positioning for event risk into the next ministerial meeting.

**Outlook:** We maintain a neutral tactical stance on crude but overweight integrated names with downstream optionality.

**Deep dive (subscribers):** Scenario tables for crack spreads under three macro paths.`,
  },
  {
    slug: "university-spinout-opens-series-b",
    title: "University Spinout Opens Series B as Strategics Circle",
    dek: "A lab-to-market story in specialty materials draws strategic interest from Asian industrials.",
    category: "Lab to Market",
    excerpt:
      "The company, spun out of a coastal research institute, cites repeatable pilot lines and two Fortune 500 offtake letters.",
    body: `The company, spun out of a coastal research institute, cites repeatable pilot lines and two Fortune 500 offtake letters.

Management highlighted gross-margin expansion from in-sourcing catalyst precursors rather than licensing overseas tollers.

**Lab to Market lens:** IP carve-outs, milestone-based grants, and the path from demonstration tonnes to nameplate capacity.

**Subscribers:** Cap table sensitivity and comparables against three listed peers in advanced ceramics.`,
  },
  {
    slug: "duration-bets-versus-carry-trades",
    title: "Duration Bets Versus Carry Trades in the Same Portfolio",
    dek: "When long-horizon themes meet tactical funding pressure.",
    category: "LongTerm & ShortTerm",
    excerpt:
      "Asset owners describe layering macro hedges without abandoning multi-year themes in electrification and grid hardware.",
    body: `Asset owners describe layering macro hedges without abandoning multi-year themes in electrification and grid hardware.

Short-term rates volatility has widened the dispersion between cash Treasuries and spread product, complicating roll strategies.

**LongTerm & ShortTerm:** We map where convexity pays for insurance and where carry still clears hurdle rates.

**For subscribers:** Two model portfolios with explicit rebalance triggers.`,
  },
  {
    slug: "liquidity-pockets-in-small-cap-reopenings",
    title: "Liquidity Pockets in Small-Cap Reopenings",
    dek: "Fast money meets slow clearing when secondaries cross primary calendars.",
    category: "Fast & Slow",
    excerpt:
      "Dealers note episodic depth in names under $3bn market cap as systematic flows pause and discretionary desks reload.",
    body: `Dealers note episodic depth in names under $3bn market cap as systematic flows pause and discretionary desks reload.

Slower-moving pension rebalancing interacts with faster ETF creations, producing two-speed tape behavior into month-end.

**Fast & Slow framing:** Which order types clear without impact and which still gap on headline risk.

**Subscriber toolkit:** Our liquidity heat-score by sector, refreshed weekly.`,
  },
];

async function main() {
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }
  console.log("Seeded articles:", articles.length);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

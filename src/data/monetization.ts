/**
 * Monetization configuration — read by AdSlot and the Support page.
 *
 * Philosophy: downloads are free forever (that's the point of torrents).
 * Monetization comes from visibility and goodwill, never from gating files.
 *
 * Enable a channel by filling in its external IDs below; everything else in
 * the UI reacts automatically.
 */

export interface AdSlotConfig {
  /** Master switch — set false to hide all ad slots globally. */
  enabled: boolean
  /** Your ad network tag id (Adsterra, a-ads, EthicalAds, etc.). Leave '' to use the house promo. */
  networkTagId: string
}

export interface SponsorTier {
  id: string
  name: string
  monthlyUsd: number
  blurb: string
  perks: string[]
  /** Rough swarm-health equivalent shown on tier cards. */
  swarmMetric: string
  highlight?: boolean
}

export const MONETIZATION = {
  ads: {
    enabled: true,
    networkTagId: '',
  } as AdSlotConfig,

  /** Buy-coffee style one-off contributions. */
  oneOff: {
    enabled: true,
    /** e.g. ko-fi: https://ko-fi.com/yourpage */
    url: '',
    suggestedAmountsUsd: [3, 5, 10],
  },

  /** Recurring sponsorships with perks (see SponsorTier). */
  tiers: {
    enabled: true,
    /** Fill with your Stripe Payment Link / GitHub Sponsors / Patreon URL. */
    checkoutBaseUrl: '',
    items: [
      {
        id: 'lurker',
        name: 'Lurker',
        monthlyUsd: 3,
        blurb: 'Keep the trackers and mirrors alive.',
        perks: [
          'Warm glow of seeding the commons',
          'Name on the supporters page',
          'Vote on the monthly featured model',
        ],
        swarmMetric: '≈ 40 GB mirrored bandwidth / month',
        highlight: false,
      },
      {
        id: 'seeder',
        name: 'Seeder',
        monthlyUsd: 8,
        blurb: 'Fund the always-on seedboxes.',
        perks: [
          'Everything in Lurker',
          'Request one artifact per month',
          'Early notifications for new releases',
        ],
        swarmMetric: '≈ 250 GB mirrored bandwidth / month',
        highlight: true,
      },
      {
        id: 'swarm',
        name: 'Swarm',
        monthlyUsd: 20,
        blurb: 'Scale the mirror network.',
        perks: [
          'Everything in Seeder',
          'Logo in the footer swarm board',
          'Two artifact requests per month',
        ],
        swarmMetric: '≈ 1 TB mirrored bandwidth / month',
        highlight: false,
      },
    ] as SponsorTier[],
  },

  /** Supporter leaderboard shown on the Support page. */
  backers: {
    enabled: true,
    items: [
      { name: 'quiet-river', tier: 'Seeder', months: 14 },
      { name: '0xseed', tier: 'Swarm', months: 9 },
      { name: 'tensorpilgrim', tier: 'Lurker', months: 21 },
      { name: 'anne-d', tier: 'Seeder', months: 6 },
      { name: 'm0nty', tier: 'Lurker', months: 3 },
    ],
  },
} as const

export type SponsorTierItem = (typeof MONETIZATION.tiers.items)[number]

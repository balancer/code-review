\<Template: Copy this file and replace all elements inside \<\> brackets. Delete this particular block.\>

# Rate Provider: `\<Name of Reviewed Contract\>`

## Details
- Reviewed by: @\<GitHub handle of primary reviewer\>
- Checked by: @\<GitHub handle of secondary reviewer\>
- Deployed at:
    - [\<network:address\>](\<link to contract on block explorer\>)
    - [\<network:address\>](\<link to contract on block explorer\>)
- Audit report(s):
    - [\<audit title\>](\<link to audit\>)

## Context
\<Write a brief description of the intended functionality here.\>

## Review Checklist: Bare Minimum Compatibility
Each of the items below represents an absolute requirement for the Rate Provider. If any of these is unchecked, the Rate Provider is unfit to use.

- [ ] Implements the [`IRateProvider`](https://github.com/balancer/balancer-v2-monorepo/blob/bc3b3fee6e13e01d2efe610ed8118fdb74dfc1f2/pkg/interfaces/contracts/pool-utils/IRateProvider.sol) interface.
- [ ] `getRate` returns an 18-decimal fixed point number (i.e., 1 == 1e18) regardless of underlying token decimals.

## Review Checklist: Common Findings
Each of the items below represents a common red flag found in Rate Provider contracts.

If none of these is checked, then this might be a pretty great Rate Provider! If any of these is checked, we must thoroughly elaborate on the conditions that lead to the potential issue. Decision points are not binary; a Rate Provider can be usable despite these boxes being checked. A check simply indicates that thorough vetting is required in a specific area, and this vetting should be used to inform a holistic analysis of the Rate Provider.

### Administrative Privileges
- [ ] The Rate Provider is upgradeable (e.g., via a proxy architecture or an `onlyOwner` function that updates the price source address). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - admin address: [\<network:address\>](\<link to contract block explorer\>)
    - admin type: \<EOA/multisig\> \<Delete this hint: If EOA, delete the whole sub-section below.\>
        - multisig threshold/signers: \<X/Y\>
        - multisig timelock? \<YES: minimum duration/NO\>

- [ ] Some other portion of the price pipeline is upgradeable (e.g., the token itself, an oracle, or some piece of a larger system that tracks the price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - upgradeable component: `\<contract name\>` ([\<network:address\>](\<link to contract block explorer\>))
    - admin address: [\<network:address\>](\<link to contract block explorer\>)
    - admin type: \<EOA/multisig\> \<Delete this hint: If EOA, delete the whole sub-section below.\>
        - multisig threshold/signers: \<X/Y\>
        - multisig timelock? \<YES: minimum duration/NO\>

### Oracles

A note on freshness, because the two questions below look like one, but are actually separate. An elapsed-time bound alone cannot be set for a source that stops publishing on a schedule: any maximum age short enough to catch a source that failed between publications also rejects every routine gap, and any bound loose enough to survive a routine gap is far too loose to catch a failure.

The asset class by itself does not decide the answer, since they may behave very differently. A tokenized real-world asset can belong to any of the three categories below. Determine which one by looking at what the source actually published over the last week, not just by the asset type.

| Category | When it publishes | What the value does while the source is silent | Is the gap a risk? |
|---|---|---|---|
| Live market quote on a venue calendar | during venue hours only, silent overnight and at weekends | can gap when the venue reopens, because the market re-prices without the source | Yes. This is the case the questions below exist for. |
| Periodic valuation, such as a net asset value mark | on its own schedule, which can mean gaps of several days | accrues smoothly, so the stale value is understated by a small and knowable amount | No. The gap is how the source works, not a defect. A maximum-age bound would reject the price during normal operation. |
| Real-world asset priced continuously | without interruption, including weekends | keeps being re-marked, so there is no scheduled gap at all | Not applicable. Leave the item below unchecked, and record the ordinary freshness answer above instead. |

The third category is the one most often misread: an asset can be a tokenized bond or equity, yet still have a source that never stops publishing. Check the publication record before assuming a calendar applies.

Sources from each category were measured on chain for calibration.

A live quote for a short-duration bond fund on a US equity venue published a session field that cycled through overnight, pre-market, regular, and post-market, updating about every 600 seconds in all four, then held a single closing mark from Saturday 00:00 UTC onward. By the following Monday's open that mark was about 61 hours old. Because all four trading sessions are used, a provider that accepts them all stays live around the clock on weekdays and only stops at weekends.

A fund net asset value mark published 23 times over 66 days, with routine gaps of 24, 46 to 49, and 91 to 98 hours. This tracks a slowly increasing NAV. Every one of its 23 moves was positive, between 0.013 and 0.22 percent, averaging about 0.03 percent a day. A maximum-age bound under about 120 hours would have rejected this price during normal operation, which is the clearest illustration of why this item asks about publication behavior instead of demanding a number.

A tokenized treasury bill kept publishing straight through a weekend, moving by a single quantization step of the feed. Its asset class suggested a market calendar: but its publication record showed none.

So, the exposure from a stale price is bounded by how far the value moves while the source is silent. The bond fund quote above moved about 0.005 percent across a full trading day. A gap is only worth worrying about when the value behind it can move meaningfully, or discontinuously, while nobody is publishing. Record the movement alongside the gap, because the gap on its own does not tell you whether there is a problem.

- [ ] Price data is provided by an off-chain source (e.g., a Chainlink oracle, a multisig, or a network of nodes). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - source: \<Delete this hint: If Chainlink, just write "Chainlink". Otherwise, elaborate.\>
    - source address: [\<network:address\>](\<link to contract block explorer\>)
    - any protections? \<YES: elaborate/NO\> \<Delete this hint: e.g., maximum rate delta\>

- [ ] The rate can go stale without anything rejecting it (i.e., neither the Rate Provider nor its source refuses a price that has stopped updating). \<Delete this hint: If unchecked, record below where freshness is enforced, then delete the remaining bullets.\>
    - where freshness is enforced: \<Rate Provider/source contract/nowhere\>
    - maximum age, if any: \<duration/none\>
    - expected update cadence: \<duration\> \<Delete this hint: e.g., a published Chainlink heartbeat, or an interval measured on chain\>

- [ ] The source stops publishing on a schedule rather than updating continuously (e.g., it follows market hours, or it publishes a periodic valuation). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - publication pattern: \<Delete this hint: e.g., US equity hours on weekdays; or a net asset value marked three times a week\>
    - longest routine gap: \<duration\> \<Delete this hint: measure it on chain rather than assuming; e.g., about 65 hours from a Friday close to a Monday open, or about 98 hours between periodic marks\>
    - is the published value a live market quote, or a periodic valuation? \<quote/valuation\>
    - while the source is silent, can the value move discontinuously? \<YES: elaborate/NO\> \<Delete this hint: this is the bullet that decides whether the gap is a risk or just how the source works. A quote can gap when the venue reopens. A smooth accrual, such as a net asset value that has only ever risen, cannot: the stale value is understated by a knowable and small amount.\>
    - does the source publish a market state or session field? \<YES: name the field and its values/NO\>
    - what does `getRate` return during a gap? \<the last published value, served as though current/reverts\>

- [ ] Price data is expected to be volatile (e.g., because it represents an open market price instead of a (mostly) monotonically increasing price). \<Delete this hint: If unchecked, delete all of the bullets below.\>
    - description: \<`X` in terms of `Y`\> \<Delete this hint: e.g., `wstETH` in terms of `ETH`\>
    - should be: \<`A` in terms of `B`\> \<Delete this hint: e.g., `wstETH` in terms of `stETH`\>

### Common Manipulation Vectors
- [ ] The Rate Provider is susceptible to donation attacks.

\<Delete this hint: If checked, elaborate here: is the donation public and atomic, or is it protected at all (privileged, bounded, distributed over time, etc.)?\>

## Additional Findings
To save time, we do not bother pointing out low-severity/informational issues or gas optimizations (unless the gas usage is particularly egregious). Instead, we focus only on high- and medium-severity findings which materially impact the contract's functionality and could harm users.

### \<H-01: Example High-severity Finding\>
### \<H-02: Example High-severity Finding\>
### \<M-01: Example Medium-severity Finding\>
### \<M-02: Example Medium-severity Finding\>

## Conclusion
**Summary judgment: \<USABLE/UNUSABLE\>**

\<Delete this hint: Formulate a nuanced conclusion here. Remember, it's okay if some of the boxes above are checked as long as reasonable protections are in place. If the Rate Provider is very obviously usable, say so. If it's very obviously not, say so: what specifically needs to change before it can be considered usable? If the conclusion is hazy, explain why, and leave the final determination up to the reader. Examples of completely unacceptable conditions include, but are not limited to: EOA admins, EOA price sources, market prices (instead of deposit/redemption prices).\>

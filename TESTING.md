# Testing Hills Roof Care

## Environments

- **Production:** https://jsjroofing.github.io/hills-roof-care/
  - Live Stripe Payment Links (real money)
  - Indexed by search engines and AI crawlers
  - Customers transact here
  - Repo: `jsjroofing/hills-roof-care` — branch `main`

- **Test:** https://jsjroofing.github.io/hills-roof-care-test/
  - Test-mode Stripe Payment Links (no real money)
  - `noindex, nofollow` + fully blocking `robots.txt`
  - Manus and Ben validate changes here before merging to production
  - Repo: `jsjroofing/hills-roof-care-test` — branch `main`

---

## Workflow for any change

1. Make changes in the `hills-roof-care` repo on a feature branch
2. Merge the feature branch into `hills-roof-care-test` (copy changes manually or via patch)
3. Run the full test harness (`test-harness.md`) against the test environment
4. Use Stripe test card `4242 4242 4242 4242` to verify all three payment flows
5. If all checks pass → merge the feature branch into `hills-roof-care` `main` (auto-deploys to production)
6. Re-run smoke tests against production
7. Tag the release with a date stamp

---

## Stripe test cards (most common)

| Outcome | Card number |
|---|---|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| Insufficient funds | 4000 0000 0000 9995 |
| 3D Secure required | 4000 0025 0000 3155 |
| Subscription fails on renewal | 4000 0000 0000 0341 |

Use any future expiry date, any 3-digit CVC, and any postcode.

---

## Test email address

Use `bentindale+hillstest@gmail.com` for all test signups. This keeps test receipts, confirmations, and Cal.com booking notifications isolated from real correspondence.

---

## Cal.com test event

A dedicated test event exists in Cal.com:

- **Event name:** `[TEST] Hills Roof Care — First Clean & Inspection`
- **Availability:** Wednesdays only, far-future dates
- **Visibility:** Private link only — not listed publicly
- The test deployment links to this event; production links to the real event

After each test booking, cancel it immediately so it does not appear on Emily's real schedule.

---

## What NOT to do

- Never merge a branch containing test Stripe URLs (`buy.stripe.com/test_...`) into the production repo
- Never push directly to the production `main` branch — always go via test first
- Never delete or modify the test products in Stripe — keep them stable so tests are repeatable
- Never use real customer email addresses for test signups — use `bentindale+hillstest@gmail.com`
- Never test live (production) Payment Links unless intentionally doing a real-money smoke test with Ben present

---

## How to identify which environment you're on

| Signal | Test | Production |
|---|---|---|
| Page banner | Green ⚠️ TEST ENVIRONMENT banner at top | No banner |
| Browser tab title | `[TEST] Hills Roof Care…` | `Hills Roof Care…` |
| Stripe checkout URL | Starts with `https://buy.stripe.com/test_` | Starts with `https://buy.stripe.com/` (no `test_`) |
| Stripe Dashboard | Orange "TEST MODE" badge in top bar | No badge |

---

## Resetting test data

- **Stripe:** Test mode data isolates automatically. Cancel test subscriptions in the Stripe Test dashboard when the list gets cluttered.
- **Cal.com:** Cancel test bookings immediately after testing — they appear on Emily's real schedule until cancelled.

---

## Risk: test links accidentally merged to production

If test Stripe URLs (`test_` prefix) ever appear in the production `hills-roof-care` repo, real customers will hit test Payment Links and no real money will be collected. If this occurs:

1. Revert the production `main` branch immediately
2. Force-push the revert
3. Verify production links are restored by checking `grep "buy.stripe.com" index.html`
4. Treat as launch-blocking until resolved

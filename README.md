# Hills Roof Care — Landing Page

Marketing landing page for the **Hills Roof Care** subscription service by [JSJ Roofing](https://jsjroofing.com.au).

**Live URL:** https://jsjroofing.github.io/hills-roof-care/

---

## Overview

A single-page static site targeting homeowners in Sydney's Hills District. It promotes a gutter-cleaning and roof-inspection subscription service with three purchase options, all connected to Stripe Checkout.

## Tech Stack

- Plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step
- Hosted on **GitHub Pages** (branch: `main`, root directory)
- Payments via **Stripe Payment Links** (redirects to `buy.stripe.com`)
- Booking via **Cal.com** embed

## File Structure

```
hills-roof-care/
├── index.html          # Main landing page (all CSS and JS inline)
├── privacy.html        # Privacy Policy
├── terms.html          # Terms of Service
├── cancel.html         # Cancellation Policy
├── logo.svg            # Full-colour JSJ Roofing logo (original, A4 canvas)
├── logo-hero.svg       # Full-colour logo, cropped viewBox for hero use
├── logo-white.svg      # All-white logo variant (unused — kept for reference)
├── favicon.ico         # Browser favicon
├── favicon-16.png      # 16×16 favicon
├── favicon-32.png      # 32×32 favicon
├── apple-touch-icon.png# iOS home screen icon
├── img-hero.jpg        # Hero background (Hills District rooftops)
├── img-gutter-problem.jpg  # Overflowing gutter photo
├── img-cracked-tile.jpg    # Cracked tile photo
└── img-inspection-report.jpg # Inspection report photo
```

## Stripe Integration

Payments use direct Stripe Payment Link redirects (no server required). Each CTA button calls `window.location.href` to the relevant Payment Link URL.

| Product | Mode | Stripe Price ID |
|---------|------|----------------|
| Monthly Plan ($108/month) | Subscription | `price_1TaA2qS44JwkysgbAKS2NUej` |
| Annual Plan ($1,199/year) | Subscription | `price_1TaA48S44JwkysgbnzvPf701` |
| Single Clean ($400) | One-off payment | `price_1TaA1jS44JwkysgbYmaTsmBg` |

**Stripe branding** (Dashboard → Settings → Branding):
- Primary colour: `#a2c354`
- Button colour: `#082b51`
- Logo: JSJ Roofing

## Cal.com Integration

Booking uses a Cal.com embed pointed at the `jsj-roofing` team's `gutter-clean` event type. The embed is loaded inline via the Cal.com snippet.

## Local Development

No build step required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deployment

Push to `main` — GitHub Pages deploys automatically within ~60 seconds.

```bash
git add .
git commit -m "your message"
git push
```

## Contacts

- **Business:** SBMN Operating Pty Ltd t/a JSJ Roofing — ABN 26 667 426 593
- **NSW Roofing Licence:** #451327C
- **Phone:** (02) 9090 4863
- **Email:** info@jsjroofing.com.au
- **Offices:** Unit 3/58-60 Melbourne Rd, Riverstone NSW 2765 · Unit 5/45-51 Huntley St, Alexandria NSW 2015

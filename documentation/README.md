# Portfolio implementation reference

Last reviewed: 2026-09-12

This document records the portfolio changes completed for Mayank Anand and explains how to maintain, test, deploy, and safely roll them back.

## Current production setup

| Area | Current implementation |
| --- | --- |
| Primary URL | `https://mayankanand.dev` |
| Alternate URL | `https://www.mayankanand.dev` |
| Hosting | Azure Static Web Apps |
| DNS provider | Cloudflare |
| Deployment source | Pushes to the `main` branch |
| Application type | Static HTML, CSS, and JavaScript |
| Content source | `Mayank_resume.pdf` and the résumé supplied for the Optum role |

The Azure-generated hostname remains available as the hosting origin:

`gray-mushroom-0f39e5610.6.azurestaticapps.net`

## Repository map

| Path | Responsibility |
| --- | --- |
| `index.html` | Page structure, portfolio copy, career content, links, and metadata |
| `css/styles.css` | Salesforce-blue visual system, responsive layouts, and component states |
| `js/script.js` | Navigation, career interaction, scroll behavior, reveal effects, and active-section tracking |
| `Mayank_resume.pdf` | Downloadable website résumé |
| `images/profile.jpg` | Profile image used in the hero section |
| `staticwebapp.config.json` | Azure Static Web Apps response security headers |
| `.github/workflows/azure-static-web-apps-gray-mushroom-0f39e5610.yml` | GitHub Actions deployment workflow |

## Change history

### Optum content and visual refresh

Commit: `0bf4f30` — `Refresh portfolio for Optum role`

- Updated the portfolio content using the supplied résumé.
- Positioned the current role as Software Engineering Lead at Optum / UnitedHealth Group.
- Refreshed the downloadable résumé.
- Rebuilt the visual direction around Salesforce blue.
- Updated the responsive layout and supporting JavaScript.

### Response-header hardening

Commit: `d1ceb17` — `Harden portfolio response headers`

Added the following response headers through `staticwebapp.config.json`:

- Content Security Policy
- Cross-Origin-Opener-Policy
- Permissions-Policy
- Referrer-Policy
- HTTP Strict Transport Security
- X-Content-Type-Options
- X-Frame-Options

When adding an external font, script, image host, API, or analytics service, update the Content Security Policy at the same time. Otherwise, the browser may correctly block the new resource.

### Interactive career redesign

Commit: `cf7390b` — `Redesign experience as interactive career chapters`

The repeated résumé-card timeline was replaced with a single interactive career explorer.

- A company index lets visitors choose a career chapter.
- One focused story is displayed at a time.
- Each chapter includes a human-readable summary, a measurable result, practical contributions, and the working toolkit.
- The content remains grounded in résumé facts; no new metrics should be added without a source.
- Desktop uses a left-hand chapter index and a right-hand story canvas.
- Tablet and mobile use a horizontally scrollable chapter selector.
- Arrow keys, Home, and End navigate between career tabs.
- ARIA tab roles, selected states, panel relationships, and focus management are included.
- Reduced-motion preferences continue to be respected by the site-wide motion rules.

## Career explorer architecture

The implementation has three layers.

### HTML

Each selector button contains a `data-career-target` value that matches the `id` of its corresponding panel.

```html
<button
  role="tab"
  aria-controls="career-panel-example"
  data-career-target="career-panel-example"
>
  ...
</button>

<article
  id="career-panel-example"
  role="tabpanel"
  aria-labelledby="career-tab-example"
  hidden
>
  ...
</article>
```

The active panel is the only panel without the `hidden` attribute.

### JavaScript

`showCareerChapter()` in `js/script.js` is the single state-changing function. It:

1. Updates the active tab class.
2. Updates `aria-selected`.
3. Maintains a single keyboard tab stop with `tabindex`.
4. Hides inactive panels and reveals the selected panel.
5. Moves focus and scrolls the selector into view during keyboard navigation.

### CSS

The career component is namespaced with `career-` classes. Important layout selectors include:

- `.career-explorer`
- `.career-index`
- `.career-tabs`
- `.career-tab`
- `.career-stage`
- `.career-panel`
- `.career-result`
- `.career-notes`
- `.career-tools`

Responsive changes are defined in the existing `800px` and `560px` media queries.

## Adding another role

1. Add a new `.career-tab` button inside `.career-tabs`.
2. Give the button a unique `id`, such as `career-tab-company`.
3. Set `data-career-target` and `aria-controls` to the new panel ID.
4. Add the matching `.career-panel` inside `.career-stage`.
5. Set the panel's `aria-labelledby` to the new button ID.
6. Add `hidden` unless the new role should be selected initially.
7. Keep only one tab marked `.active`, `aria-selected="true"`, and `tabindex="0"`.
8. Confirm the metric and role wording against the latest résumé.
9. Test click navigation, keyboard navigation, and mobile horizontal scrolling.

No JavaScript change is required when a role follows this structure; the script discovers tabs and panels through their existing attributes and classes.

## Domain and DNS reference

Azure Static Web Apps owns the TLS certificate and application delivery. Cloudflare currently provides authoritative DNS.

| Record | Host | Target | Proxy mode |
| --- | --- | --- | --- |
| CNAME | `@` | Azure-generated hostname | DNS only |
| CNAME | `www` | Azure-generated hostname | DNS only |
| TXT | `@` | Azure ownership-validation value | DNS only |

Cloudflare flattens the apex CNAME, providing the behavior Azure describes as an ALIAS record. Both the apex and `www` domains have been validated in Azure, and the apex domain is the default.

Keep the CNAME records in DNS-only mode unless Cloudflare proxying is deliberately tested with Azure TLS, redirects, caching, security headers, and certificate renewal. Do not change both DNS and Azure domain settings at the same time; changing one layer at a time makes failures reversible and easier to diagnose.

DNSSEC was enabled during setup. Its Cloudflare status was still `pending` when this document was reviewed on 2026-09-12, so confirm that it reaches `active` in Cloudflare before treating DNSSEC activation as complete.

Do not commit Cloudflare identifiers, credentials, Azure deployment tokens, or the literal domain-validation value to this repository.

## Deployment flow

The GitHub Actions workflow deploys automatically when a commit is pushed to `main`.

```text
Local change
  -> commit on main
  -> push to origin/main
  -> GitHub Actions workflow
  -> Azure Static Web Apps
  -> mayankanand.dev
```

The workflow uses the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN_GRAY_MUSHROOM_0F39E5610`. Never replace that secret with a token committed directly into the workflow.

## Pre-deployment checklist

- Run `git diff --check`.
- Confirm only intended files are modified with `git status --short`.
- Confirm each `data-career-target` has a matching panel ID.
- Open the site at desktop, tablet, and mobile widths.
- Test career tabs with mouse/touch.
- Test Arrow Left, Arrow Right, Arrow Up, Arrow Down, Home, and End.
- Confirm visible focus styles.
- Confirm the résumé download opens the latest `Mayank_resume.pdf`.
- Confirm external links open correctly.
- Confirm the browser console has no Content Security Policy errors.
- After deployment, check both `https://mayankanand.dev` and `https://www.mayankanand.dev`.
- Confirm the expected security headers remain present in the production response.

## Safe rollback

Prefer a new revert commit instead of rewriting shared branch history.

```bash
git revert <commit-sha>
git push origin main
```

Useful reference commits:

- Interactive experience UI: `cf7390b`
- Security headers: `d1ceb17`
- Optum portfolio and résumé refresh: `0bf4f30`

Avoid `git reset --hard` or force-pushing `main`; both can discard unrelated work and make the deployment history harder to audit.

## Maintenance principles

- Treat the résumé as the source of truth for employers, titles, dates, and metrics.
- Write portfolio copy in first-person, plain language.
- Prefer one clear interaction over multiple decorative cards.
- Preserve semantic HTML and keyboard support when changing visuals.
- Re-test the Content Security Policy whenever a third-party resource is introduced.
- Keep production-domain changes documented here alongside the code change that depends on them.

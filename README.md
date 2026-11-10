# Sarvamangal Education Trust — website

Next.js 16 site for [sarvamangaleducationtrust.org](https://sarvamangaleducationtrust.org),
with content (events, causes, homepage copy) managed in Sanity.

```bash
npm install
cp .env.example .env.local   # leave SANITY_PROJECT_ID empty to use built-in seed content
npm run dev                  # http://localhost:3000
```

Content editors use the Studio in `studio/` (`cd studio && npm install && npm run dev`).

## Connecting Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (free plan is enough).
2. Put its project ID in `.env.local` (`SANITY_PROJECT_ID`) and `studio/.env` (`SANITY_STUDIO_PROJECT_ID`).
3. In the project's API settings, add the site's URL and `http://localhost:3333` as CORS origins.
4. Add a webhook: URL `https://<site>/api/revalidate`, trigger on create/update/delete,
   projection `{_type}`, header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`.
5. `cd studio && npm run deploy` to host the Studio for the trust's team.

See `CLAUDE.md` for architecture, conventions and the content still to confirm.

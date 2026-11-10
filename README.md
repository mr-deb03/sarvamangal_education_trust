# Sarvamangal Education Trust — website

Next.js 16 site for [sarvamangaleducationtrust.org](https://sarvamangaleducationtrust.org),
with the Payload CMS admin built in at `/admin`.

```bash
npm install
cp .env.example .env.local   # DATABASE_URI + PAYLOAD_SECRET
npm run seed                 # load the original content (35 events, causes, homepage)
npm run dev                  # site: http://localhost:3000 · admin: http://localhost:3000/admin
```

`DATABASE_URI` takes a Postgres URL (`postgres://user:password@localhost:5432/sarvamangal`)
or, for quick local work, a SQLite file (`file:./sarvamangal-local.db`). Leave it empty to
run the site on built-in content without the admin.

See `CLAUDE.md` for architecture, conventions and the content still to confirm.

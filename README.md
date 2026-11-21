# Genesys India Job Directory — Product with Sasi

A blue-branded, mobile-first job directory based on **26 positions across 21 distinct role titles** shown in a November 2026 Genesys hiring presentation. It follows the layout language of the earlier UnitedHealth Group / Optum directory by `productwithsasi`: avatar + LinkedIn in the header, clean blue hero, sticky search and filters, individual job cards, and a fixed LinkedIn CTA on mobile.

**Important:** The 26 positions are a **presentation snapshot**, not a verified live count. Categories have 12 Engineering, 3 AI & Security, 2 Applications, 6 Consulting and 3 Sales positions. Where a direct Workday posting URL could be supported by published evidence, the card links to that posting. For others, it clearly says **Search official site**, directing visitors to Genesys Workday search. A direct link for one posting does not assert that all repetitions of that title are still open.

## Run / verify

No npm dependencies are required.

```bash
npm test
npm run build
python3 -m http.server 3000 --directory dist
```

Visit `http://localhost:3000`.

## Deploy to Vercel

1. Create a new GitHub repository or use the repository you provide for this project.
2. Commit the contents of this folder (not the parent ZIP).
3. Import into Vercel. Framework preset: **Other**. The `vercel.json` already configures `npm run build` and the `dist` output.
4. Deploy. Share the resulting Vercel URL with reel viewers.

## Maintaining the jobs

Edit `data/jobs.json` and run `npm test && npm run build`. The build checks job totals, category totals, unique IDs, and Workday-only direct job URLs. To change the 26-position presentation snapshot, edit those checks as appropriate.

Locations without a confirmed job-specific city have been labelled as such. Before promoting an individual listing, confirm the direct link, role title and the latest application status on Genesys Workday. The official employer filter provided for this project is:

`https://genesys.wd1.myworkdayjobs.com/Genesys?q=India`

The header photo loads from the publicly accessible prior GitHub repository, with an **S** fallback. To self-host later, add a photo in `src/` and replace the header image URL. Keep employer branding separate from the owner's blue brand identity.

## Sharing

`src/share-cover.png` is a dedicated preview image showing the job theme, not the profile photo. Job pages and social previews use a different information hierarchy: the reel can conceal the company name for curiosity while the destination page explicitly names Genesys. This is an independent directory and not an official Genesys website.

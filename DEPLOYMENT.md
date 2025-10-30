# Deploying to Vercel with Data Scraping

This guide explains how to deploy your Chicago Independent Cinema Calendar to Vercel and set up automated data scraping.

## Quick Start

1. **Push your code to GitHub** (already done!)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
3. **Deploy!** Vercel will automatically build and deploy

## Setting Up Data Scraping on Vercel

### Option 1: Vercel Cron Jobs + KV Storage (Recommended)

This setup uses Vercel's built-in features for scheduled scraping.

#### Step 1: Enable Vercel KV Storage

1. Go to your project on Vercel dashboard
2. Click "Storage" → "Create Database" → "KV"
3. Name it `movie-calendar-kv`
4. Click "Create"
5. Vercel will automatically add the KV environment variables

#### Step 2: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
CRON_SECRET=your-random-secret-here
```

Generate a random secret:
```bash
openssl rand -base64 32
```

#### Step 3: Deploy

The `vercel.json` file is already configured to run scraping at midnight daily:

```json
{
  "crons": [
    {
      "path": "/api/cron/scrape",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Cron Schedule Examples:**
- `0 0 * * *` - Midnight daily
- `0 */6 * * *` - Every 6 hours
- `0 0,12 * * *` - Midnight and noon daily

#### Step 4: Test Your Cron Job

After deployment, manually trigger:
```bash
curl -X GET https://your-app.vercel.app/api/cron/scrape \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### How It Works:

1. **Scheduled Run**: Vercel triggers `/api/cron/scrape` at midnight
2. **Scraping**: Function scrapes all theater websites
3. **Storage**: Stores movies in Vercel KV (key-value database)
4. **API**: Frontend fetches from `/api/movies` which reads from KV

---

### Option 2: External Scraping Service

If Vercel's serverless functions can't scrape (due to bot protection), use an external service:

#### Using Apify (Web Scraping Platform)

1. **Create Apify Account**: [apify.com](https://apify.com)
2. **Create an Actor** to scrape theater websites
3. **Schedule it** to run daily
4. **Store results** in Apify Dataset
5. **Fetch from Vercel**: Your `/api/movies` endpoint fetches from Apify API

Example Vercel function:
```typescript
// api/movies.ts
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export default async function handler(req, res) {
  const dataset = await client.dataset('YOUR_DATASET_ID').listItems();
  return res.json(dataset.items);
}
```

#### Using GitHub Actions

Run scraping on GitHub's servers, store in your repo:

1. Create `.github/workflows/scrape.yml`:
```yaml
name: Scrape Movies
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run scrape  # Your scraping script
      - run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add data/movies.json
          git commit -m "Update movie data"
          git push
```

2. Vercel auto-deploys when you push to main

---

### Option 3: Dedicated Scraping Server

For most reliable scraping, use a separate server:

#### Using Railway / Render / Fly.io

1. **Deploy your Express server** to Railway/Render
2. **Keep scrapers running** on that server
3. **Store data** in PostgreSQL/MongoDB
4. **Vercel frontend** fetches from your API server

**Benefits:**
- No serverless timeouts
- Can use Puppeteer/Playwright
- More reliable scraping

---

### Option 4: Use Theater APIs (Best if Available)

Some theaters may provide APIs:

- **Music Box**: Check their website for API docs
- **Siskel Film Center**: May have RSS feeds
- **Landmark**: Corporate site might have API

Contact theaters directly to ask about API access.

---

## Troubleshooting

### Scrapers Get 403 Errors

Theater websites block scrapers. Solutions:

1. **Use Puppeteer/Playwright** (requires separate server, not Vercel)
2. **Rotate User-Agents** and add delays
3. **Use Proxy Services** (BrightData, ScraperAPI)
4. **Contact theaters** for API access

### Vercel Function Timeouts

- **Free tier**: 10 second limit
- **Pro tier**: 60 second limit
- **Solution**: Use external scraper or break into smaller functions

### KV Storage Limits

- **Free tier**: 256 MB, 30 operations/month
- **Solution**: Upgrade to Pro or use external database

---

## Current Configuration

Your app is currently set up with:

✅ Vercel-compatible API routes (`/api/*`)
✅ Cron job configuration (`vercel.json`)
✅ Sample data fallback if scraping fails
✅ KV storage integration ready

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Enable Vercel KV storage
- [ ] Set `CRON_SECRET` environment variable
- [ ] Deploy and test
- [ ] Monitor cron job logs
- [ ] If scraping fails → consider external service option

---

## Recommended Approach

For this project, I recommend:

**Development/MVP**: Use sample data (current setup)
**Production v1**: Vercel Cron + KV with Puppeteer on external server
**Production v2**: Contact theaters for API access or RSS feeds

This gives you a working site immediately while you work on production scraping!

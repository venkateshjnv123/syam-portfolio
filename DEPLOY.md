# Deploy Guide — Syam Kumar Portfolio

## Step 1: Install Node.js (one time)

1. Go to https://nodejs.org
2. Download the **LTS** version (green button)
3. Run the installer — click Next through everything
4. Open a new PowerShell window and run: `node --version`
   Should show something like `v22.x.x` ✓

---

## Step 2: Install project dependencies (one time)

Open PowerShell in the `syam-portfolio` folder:
```powershell
cd "C:\Users\syam1\Downloads\syam-portfolio"
npm install
```

Wait ~1 minute for packages to download.

---

## Step 3: Preview locally

```powershell
npm run dev
```

Open your browser at **http://localhost:3000** — you'll see the portfolio live.

Press `Ctrl+C` to stop.

---

## Step 4: Add your portrait photo (optional)

Replace the `[ portrait ]` placeholder with your photo:
1. Copy your photo to `public/portrait.jpg`
2. Open `app/page.tsx` and find the line that says `{/* Replace with your portrait */}`
3. Replace:
   ```jsx
   <div className="ph"><span>[ portrait ]</span></div>
   ```
   with:
   ```jsx
   <img src="/portrait.jpg" alt="Syam Kumar" />
   ```

---

## Step 5: Create GitHub repo

1. Go to https://github.com → click **New repository**
2. Name it `syam-portfolio`, set to **Public** or **Private**
3. Don't add README (we already have files)
4. Copy the repo URL (e.g. `https://github.com/yourusername/syam-portfolio.git`)

In PowerShell:
```powershell
cd "C:\Users\syam1\Downloads\syam-portfolio"
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/yourusername/syam-portfolio.git
git push -u origin main
```

---

## Step 6: Deploy to Vercel (free)

1. Go to https://vercel.com → Sign up with GitHub
2. Click **Add New → Project**
3. Find `syam-portfolio` → click **Import**
4. Leave all settings as-is → click **Deploy**
5. Done! Your site is live at `https://syam-portfolio.vercel.app`

---

## Step 7: Custom domain (optional)

1. In Vercel → your project → **Settings → Domains**
2. Add your domain (e.g. `syamtalks.in`)
3. Follow the DNS instructions Vercel gives you

---

## Monthly update workflow

1. Open `content/projects.ts`
2. Replace the `videoUrl` values with your new YouTube links
3. Update `title`, `category`, `duration` as needed
4. Save the file, then:

```powershell
git add content/projects.ts
git commit -m "Update projects - June 2026"
git push
```

Vercel auto-deploys in ~60 seconds. Done!

---

## Update your email

Open `content/site.ts` and change:
```ts
email: 'syamtalks@gmail.com',  // ← put your real email here
```

---

## Enable contact form emails (optional)

When you want contact form messages sent to your email:
1. Sign up at https://resend.com (free — 100 emails/day)
2. Add your domain and get an API key
3. In Vercel → your project → **Settings → Environment Variables**
   - Add `RESEND_API_KEY` = your key
   - Add `CONTACT_TO_EMAIL` = your email
4. Uncomment the Resend section in `app/api/contact/route.ts`
5. Push and redeploy

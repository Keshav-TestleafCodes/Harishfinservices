# FinFolio — Deployment Guide
## Free Hosting: Render (Backend) + Vercel (Frontend) + Supabase (Database)

```
┌─────────────────────────────────────────────────────────┐
│                     FREE STACK                          │
│                                                         │
│  Users ──► Vercel (React)  ──► Render (Spring Boot)    │
│                                      │                  │
│                               Supabase (PostgreSQL)     │
│                               + /tmp uploads (ephemeral)│
└─────────────────────────────────────────────────────────┘
```

---

## STEP 1 — Push to GitHub

```bash
cd finfolio
git init
git add .
git commit -m "initial commit"
# Create a repo on github.com then:
git remote add origin https://github.com/YOUR_USERNAME/finfolio.git
git push -u origin main
```

---

## STEP 2 — Supabase (Free PostgreSQL)

1. Go to **https://supabase.com** → Sign up free
2. Click **New Project** → choose a region close to your users
3. Set a strong database password → save it
4. Once created, go to **Project Settings → Database**
5. Copy the **Connection string (URI)** — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
   Add `?sslmode=require` at the end:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres?sslmode=require
   ```
6. Save this — you'll need it in Step 3.

**Free tier:** 500 MB storage, 2 projects, unlimited API requests ✅

---

## STEP 3 — Render (Spring Boot Backend)

1. Go to **https://render.com** → Sign up free (use GitHub login)
2. Click **New → Web Service**
3. Connect your GitHub repo → select the `finfolio` repo
4. Configure:

   | Setting | Value |
   |---|---|
   | **Name** | `finfolio-api` |
   | **Root Directory** | `backend` |
   | **Environment** | `Docker` |
   | **Region** | Closest to your users |
   | **Instance Type** | `Free` |

5. Add **Environment Variables** (click "Add Environment Variable"):

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your Supabase connection string from Step 2 |
   | `APP_JWT_SECRET` | Any random 40+ character string (e.g. run `openssl rand -base64 40`) |
   | `FRONTEND_URL` | `https://finfolio.vercel.app` *(update after Step 4)* |
   | `SPRING_PROFILES_ACTIVE` | `prod` |

6. Click **Create Web Service** → wait ~5 min for first deploy
7. Copy your backend URL: `https://finfolio-api.onrender.com`

> ⚠️ **Free tier note:** Render free services sleep after 15 min of inactivity.
> First request after sleep takes ~30 seconds to wake up. This is normal on the free plan.

---

## STEP 4 — Vercel (React Frontend)

1. Go to **https://vercel.com** → Sign up free (use GitHub login)
2. Click **Add New → Project**
3. Import your `finfolio` GitHub repo
4. Configure:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Add **Environment Variable**:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://finfolio-api.onrender.com` *(your Render URL)* |

6. Click **Deploy** → wait ~2 min
7. Your site is live at: `https://finfolio.vercel.app` (or custom domain)

---

## STEP 5 — Update CORS on Render

After Vercel gives you your URL:
1. Go back to Render → your `finfolio-api` service
2. Update the `FRONTEND_URL` environment variable to your exact Vercel URL
3. Render will auto-redeploy

---

## STEP 6 — Verify Everything Works

- [ ] Visit your Vercel URL — portfolio loads
- [ ] Go to `/login` — sign in with `admin` / `admin123`
- [ ] Create a project, upload a PDF/PPTX/XLSX
- [ ] Log out → verify files are downloadable publicly
- [ ] **Change the admin password immediately** (see below)

---

## Changing the Admin Password

Currently there's no UI for this. Options:

**Option A — Via H2 console (local):**
```bash
cd backend && mvn spring-boot:run
# Visit http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:file:./data/finfolio
```

**Option B — Add a change-password endpoint** (recommended for production):
```java
// POST /api/auth/change-password
// Body: { "oldPassword": "...", "newPassword": "..." }
```

---

## File Storage Note

Render's free tier uses **ephemeral storage** — uploaded files in `/tmp` are wiped on redeploy or service restart. For production-grade persistent file storage, integrate one of these (all have free tiers):

### Cloudinary (easiest — images, PDFs, Office files)
```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.34.0</version>
</dependency>
```
Set `CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name` in Render env vars.

### Supabase Storage (already have Supabase)
Use the Supabase Java client to upload files to Supabase Storage buckets instead of local disk.

### Backblaze B2 (10 GB free)
S3-compatible API — swap `FileStorageService` to use the AWS S3 SDK pointed at B2.

---

## Local Development

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
# H2 console: http://localhost:8080/h2-console
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
# Proxies /api → localhost:8080 automatically
```

### Default credentials
- Username: `admin`
- Password: `admin123`

---

## Architecture Summary

```
finfolio/
├── backend/                  # Spring Boot 3.2
│   ├── Dockerfile            # Multi-stage build for Render
│   ├── src/main/
│   │   ├── java/com/finfolio/
│   │   │   ├── config/       # Security, CORS
│   │   │   ├── controller/   # Auth, Projects, Files
│   │   │   ├── entity/       # User, Project, ProjectFile
│   │   │   ├── repository/   # JPA repositories
│   │   │   ├── security/     # JWT filter & util
│   │   │   └── service/      # Business logic
│   │   └── resources/
│   │       ├── application.properties       # Local (H2)
│   │       └── application-prod.properties  # Prod (PostgreSQL)
│
└── frontend/                 # React 18 + Vite
    ├── vercel.json           # SPA routing config
    ├── src/
    │   ├── context/          # Auth context + JWT storage
    │   ├── pages/
    │   │   ├── public/       # Home, Projects, ProjectDetail
    │   │   ├── admin/        # Dashboard, Projects, Form, Files
    │   │   └── LoginPage
    │   ├── components/       # ProjectCard, Layouts
    │   └── utils/api.js      # Axios + env-aware base URL
```

---

## Cost Breakdown

| Service | Free Tier Limits | Paid Plan |
|---|---|---|
| **Vercel** | 100 GB bandwidth/mo, unlimited deploys | $20/mo |
| **Render** | 750 hrs/mo (1 service = always on), sleeps after 15min idle | $7/mo to never sleep |
| **Supabase** | 500 MB DB, 1 GB storage, 2 projects | $25/mo |
| **Total** | **$0/month** | ~$52/mo |

For a freelancer portfolio, the free tier is perfectly sufficient. 🎉

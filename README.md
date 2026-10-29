# Minimal To-Do App

A clean, mobile-responsive to-do list built with vanilla HTML, CSS, and JavaScript.

## Features
- Add, complete, and delete tasks
- Data persistence using `localStorage`
- Task filtering (`All`, `Active`, `Completed`)
- Responsive design tailored for mobile and desktop screens

---

## Deployment Guide

### Option 1: Deploy to Vercel

#### Method A: Using the CLI (Fastest)
1. Run in terminal:
   ```bash
   npx vercel
   ```
2. Follow the prompt to log in and select the default settings (`Enter` to confirm).
3. Vercel will output a live production URL instantly.

#### Method B: Via GitHub Dashboard
1. Push this folder to a GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **Add New... > Project**.
3. Import your GitHub repository and click **Deploy**.

---

### Option 2: Deploy to Render

1. Push your code to GitHub (see steps in Method B above).
2. Log into [render.com](https://render.com) and click **New + > Static Site**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Build Command**: Leave empty
   - **Publish Directory**: `.` (or `./`)
5. Click **Create Static Site**. Render will build and deploy your site with a free `onrender.com` URL.

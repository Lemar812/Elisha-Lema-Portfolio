# Deployment Checklist

## Pre-Deployment
- [ ] All code committed to GitHub
- [ ] `.env` files created locally with correct values
- [ ] MongoDB Atlas cluster created and user credentials saved
- [ ] Backend tested locally (`npm run dev` + `node server/index.js`)
- [ ] Frontend tested locally (`npm run dev`)
- [ ] Admin dashboard tested (login, create/edit works/skills)
- [ ] Contact form tested
- [ ] All images and assets are properly linked

## MongoDB Atlas Setup
- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Free M0 cluster created
- [ ] Database user created (admin / password)
- [ ] Connection string obtained
- [ ] Connection string includes: username, password, database name (lx_portfolio)

## Backend Deployment (Railway)
- [ ] GitHub repository created and public
- [ ] Code pushed to GitHub main branch
- [ ] Railway account created at railway.app
- [ ] Project created in Railway from GitHub repo
- [ ] Environment variables set in Railway:
  - [ ] `MONGODB_URI` = Full connection string
  - [ ] `JWT_SECRET` = nanah_812_secret_key_god_tier
  - [ ] `ADMIN_USERNAME` = admin
  - [ ] `ADMIN_PASSWORD` = Nanah@812
  - [ ] `NODE_ENV` = production
- [ ] Deployment successful
- [ ] Railway URL copied (e.g., https://portfolio-production-xxx.railway.app)
- [ ] Test backend: Visit `{RAILWAY_URL}/api/stats` - should return JSON

## Frontend Deployment (Vercel)
- [ ] `.env.production` file created with Railway URL
- [ ] Vercel account created at vercel.app
- [ ] Project imported from GitHub
- [ ] Build settings verified:
  - [ ] Framework: Vite
  - [ ] Build Command: npm run build
  - [ ] Output Directory: dist
- [ ] Environment variables set in Vercel:
  - [ ] `VITE_API_URL` = Your Railway backend URL
- [ ] Deployment successful
- [ ] Vercel URL obtained (e.g., https://portfolio-xyz.vercel.app)

## Post-Deployment Testing
### Frontend (Vercel)
- [ ] Home page loads
- [ ] All sections visible (Hero, About, Skills, Works, etc.)
- [ ] Navigation works
- [ ] Images load correctly
- [ ] Animations play smoothly
- [ ] Scroll to top on refresh works
- [ ] Mobile responsive design works

### Admin Dashboard
- [ ] Visit `/admin/login`
- [ ] Login works (admin / Nanah@812)
- [ ] Overview dashboard displays stats
- [ ] Works section displays projects
- [ ] Skills section displays skills
- [ ] Can add new work/skill
- [ ] Can edit existing work/skill
- [ ] Can delete work/skill

### Contact Form
- [ ] Contact form is visible
- [ ] Email address is copyable
- [ ] Phone numbers are copyable
- [ ] Form can be filled and submitted
- [ ] Email received in inbox (elishalema12@gmail.com)
- [ ] Form data saved in admin Messages section

### Legal Pages
- [ ] Privacy Policy page loads (`/privacy-policy`)
- [ ] Terms of Service page loads (`/terms-of-service`)
- [ ] Footer links work

## Live Site Verification
- [ ] All external links work
- [ ] Analytics/stats tracking works (visit counter increments)
- [ ] Database operations complete without lag
- [ ] No console errors in browser DevTools
- [ ] No CORS errors
- [ ] HTTPS works (green padlock in browser)

## Maintenance & Updates

### To Update Your Site:
1. Make changes locally
2. Test locally with `npm run dev` and `node server/index.js`
3. Commit: `git add . && git commit -m "message" && git push`
4. Vercel/Railway auto-deploy (check dashboards for status)

### To Seed Database:
```powershell
cd server
node seed.js
```

### To Change Admin Password:
Edit in MongoDB Atlas directly or update in `server/seed.js` and reseed

## Success Indicators
✅ Frontend loads at Vercel URL
✅ Admin dashboard accessible with login
✅ Can create/edit/delete works and skills
✅ Contact form sends emails
✅ Database data persists after refresh
✅ No 404 or 500 errors in console
✅ Performance is good (Lighthouse score >80)

## Support URLs
- Vercel Support: vercel.com/support
- Railway Support: railway.app/support
- MongoDB Support: community.mongodb.com
- Email: elishalema12@gmail.com (for site-related inquiries)

---

**Deployment Date:** _______________
**Frontend URL:** _______________
**Backend URL:** _______________
**Status:** 🟢 Live

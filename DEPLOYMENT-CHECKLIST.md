# 🚀 **Netlify Deployment Checklist**

## ✅ **What I've Done For You**

- ✅ **Committed all code** to git repository
- ✅ **Created all necessary files** for Next.js 14 deployment
- ✅ **Prepared database migration** for Supabase
- ✅ **Set up environment configuration** structure

## 📋 **Your Manual Steps Required**

### **Step 1: Environment Setup (5 minutes)**

**1.1 Create `.env.local` file:**
```bash
# In your project root, run:
cp env.example .env.local
```

**1.2 Edit `.env.local` with your actual values:**
```env
# App Configuration (update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# n8n Integration (optional)
NEXT_PUBLIC_INPUT_WEBHOOK_URL=your_n8n_webhook_url
```

### **Step 2: Supabase Database Setup (10 minutes)**

**2.1 Get your Supabase credentials:**
- Go to [supabase.com](https://supabase.com)
- Open your project → Settings → API
- Copy: Project URL, anon key, service role key

**2.2 Run database migration:**
- Go to your Supabase project → SQL Editor
- Copy entire contents of `supabase-migration.sql`
- Paste and click "Run"
- Verify `requests` table was created

### **Step 3: Push to GitHub (2 minutes)**

**3.1 Push your code:**
```bash
git push origin main
```

**3.2 Verify repository is public/accessible:**
- Go to your GitHub repository
- Ensure it's accessible to Netlify

### **Step 4: Netlify Deployment (15 minutes)**

**4.1 Create Netlify account:**
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub

**4.2 Deploy from Git:**
- Click "New site from Git"
- Choose GitHub → your repository
- Select `main` branch

**4.3 Configure build settings:**
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 18

**4.4 Add environment variables:**
- Go to Site settings → Environment variables
- Add all variables from your `.env.local`

### **Step 5: Update App URL (5 minutes)**

**5.1 Get your Netlify URL:**
- After deployment, note your app URL
- Format: `https://your-app-name.netlify.app`

**5.2 Update environment variables:**
- Go back to Netlify → Environment variables
- Update `NEXT_PUBLIC_APP_URL` to your actual Netlify URL
- Redeploy site

### **Step 6: Test Everything (10 minutes)**

**6.1 Test the deployed app:**
- Visit your Netlify URL
- Fill out the form with test data
- Check that it creates records in Supabase
- Verify History page works
- Test the callback URL display

**6.2 Verify these work:**
- ✅ Form submission
- ✅ Supabase connection
- ✅ History page
- ✅ Callback URL shows correct production URL
- ✅ No console errors

## 🚨 **Common Issues & Quick Fixes**

### **Build Fails**
- **Problem:** Missing dependencies
- **Fix:** Run `npm install` locally, commit `package-lock.json`

### **Environment Variables Not Working**
- **Problem:** Variables not set in Netlify
- **Fix:** Double-check all variables in Netlify environment settings

### **Supabase Connection Errors**
- **Problem:** Wrong credentials or missing migration
- **Fix:** Verify Supabase URL/key and run migration again

### **App URL Shows localhost**
- **Problem:** `NEXT_PUBLIC_APP_URL` not updated
- **Fix:** Update in Netlify environment variables and redeploy

## 🎯 **Success Indicators**

After deployment, you should see:
- ✅ App loads without errors
- ✅ Form creates records in Supabase
- ✅ History page displays data
- ✅ Callback URL shows: `https://your-app-name.netlify.app/api/callback`
- ✅ No red errors in browser console
- ✅ Mobile responsive design

## 📞 **Need Help?**

If you get stuck:
1. Check Netlify build logs for errors
2. Verify all environment variables are set
3. Test locally first with `npm run dev`
4. Check browser console for JavaScript errors

## 🚀 **Next Steps After Deployment**

1. **Set up n8n workflow** (optional)
2. **Configure custom domain** (optional)
3. **Set up monitoring** (optional)
4. **Add authentication** (optional)

---

**Total estimated time: 45-60 minutes**

Your app is production-ready! Just follow these steps and you'll have a fully functional Tekton Words app deployed on Netlify.

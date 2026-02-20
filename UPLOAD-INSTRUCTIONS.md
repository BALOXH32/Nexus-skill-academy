# 📤 HOW TO UPLOAD TO YOUR HOSTING

## 🎯 What You Need to Upload

You have **3 files** to work with:

### 1. **login-with-supabase.html** ← Main file to upload
   - This is your updated login page
   - **Rename it to:** `login.html` (or whatever your current login page is named)
   - Upload to your hosting file manager in the same location as your other HTML files

### 2. **nexus-logo.png** ← Your logo image
   - Upload this to your hosting file manager
   - Put it in the **same folder** as login.html
   - OR put it in an `images/` or `assets/` folder and update the path in the HTML

### 3. **database-schema.sql** ← For Supabase (NOT for hosting)
   - DO NOT upload this to your hosting
   - This is ONLY for your Supabase database
   - Use it in Supabase Dashboard → SQL Editor

---

## 📋 Step-by-Step Upload Instructions

### STEP 1: Update Supabase Credentials (IMPORTANT!)

Before uploading, open `login-with-supabase.html` and update these lines (around line 560):

```javascript
// 🔹 REPLACE THESE WITH YOUR ACTUAL CREDENTIALS
const SUPABASE_URL = "https://xmbdxpekhxjqabevkcbd.supabase.co";  
const SUPABASE_PUBLIC_KEY = "eyJhbGci...YOUR_ACTUAL_KEY_HERE";
```

Get these from: Supabase Dashboard → Settings → API

---

### STEP 2: Upload to Your Hosting

1. **Login to your hosting control panel** (cPanel, Plesk, or File Manager)

2. **Go to File Manager** → Navigate to your website folder (usually `public_html` or `www`)

3. **Upload these 2 files:**
   - `login-with-supabase.html` (rename to `login.html`)
   - `nexus-logo.png`

4. **If you already have a login.html file:**
   - Option A: Replace it with the new one (recommended)
   - Option B: Rename the old one to `login-old.html` (backup) and upload new one

---

### STEP 3: Setup Supabase Database

1. **Open Supabase Dashboard**: https://app.supabase.com/

2. **Go to SQL Editor** (left sidebar)

3. **Click "New Query"**

4. **Copy everything from** `database-schema.sql` and paste it

5. **Click "Run"** button (or press Ctrl+Enter)

6. You should see: ✅ "Success. No rows returned"

---

## 📁 File Structure on Your Hosting

After upload, your hosting should look like this:

```
public_html/  (or www/ or your root folder)
├── index.html
├── courses.html
├── login.html  ← Your new login page (renamed from login-with-supabase.html)
├── nexus-logo.png  ← Your logo
├── assets/
│   └── chatbot/
│       ├── chatbot.css
│       └── chatbot.js
└── [other files...]
```

---

## ✅ Testing After Upload

1. **Visit your website:** `https://yourwebsite.com/login.html`

2. **Check browser console** (Press F12):
   - You should see: `✅ Supabase client initialized`
   - If you see errors, check your Supabase credentials

3. **Test Signup:**
   - Click "Sign Up" tab
   - Fill in: Name, Email, Password
   - Click "Create Account"
   - Should show success message

4. **Check Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - You should see your new user

---

## 🔧 Common Issues & Fixes

### Issue: Logo not showing

**Fix:**
- Make sure `nexus-logo.png` is uploaded to the same folder as login.html
- OR update the image path in the HTML:
  ```html
  <img src="nexus-logo.png" alt="Nexus">
  <!-- Change to: -->
  <img src="images/nexus-logo.png" alt="Nexus">
  <!-- if logo is in images/ folder -->
  ```

### Issue: "Invalid API key" error

**Fix:**
- Double-check you copied the **anon/public** key (NOT service_role)
- Make sure there are no extra spaces when pasting
- Verify your Supabase project is active

### Issue: Supabase not connecting

**Fix:**
- Check the browser console for errors
- Verify you updated BOTH the URL and Public Key
- Make sure you saved the file after editing

---

## 📝 Summary

**What to upload to hosting:**
✅ login-with-supabase.html (rename to login.html)
✅ nexus-logo.png

**What NOT to upload to hosting:**
❌ database-schema.sql (use in Supabase instead)
❌ src/supabaseClient.js (already included in the HTML)
❌ README files (just for reference)

**Order of operations:**
1. Update Supabase credentials in the HTML file
2. Upload login.html and nexus-logo.png to hosting
3. Run database-schema.sql in Supabase
4. Test the login page

That's it! Your login system is now connected to Supabase! 🎉

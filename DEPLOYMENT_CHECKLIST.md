# 🚀 Deployment Checklist

## Before Pushing Code

- [ ] All changes tested locally
- [ ] No console.log statements in production
- [ ] HTML files validated (no syntax errors)
- [ ] CSS file properly formatted
- [ ] JavaScript tested in browser
- [ ] Images/assets paths correct
- [ ] manifest.json updated (if needed)

## After GitHub Push (Workflow Runs)

The GitHub Actions workflow will automatically:

1. **Validate** - Check all files for errors
   - HTML syntax validation
   - CSS brace matching
   - JavaScript syntax
   - Critical files existence
   - File sizes verification

2. **Build** - Test the project
   - Verify all required files
   - Check file integrity

3. **Backup** - Create automatic backup
   - Creates backup branch with timestamp

4. **Update Cache** - Auto-increment version
   - Updates `CACHE_NAME` in sw.js
   - Commits change back to GitHub

5. **Verify** - Ensure everything worked
   - Checks updated sw.js syntax
   - Generates deployment report

## If Validation Fails ❌

The workflow will:
- ❌ STOP before updating cache version
- 🔄 Roll back any changes
- 📋 Show detailed error report

Fix the errors and push again.

## If Validation Succeeds ✅

The workflow will:
- ✅ Update cache version automatically
- 📝 Commit change to main branch
- 📊 Generate deployment report

Then you can:
1. Pull latest code: `git pull`
2. Deploy to FTP (all files including updated sw.js)
3. Users get fresh version automatically

## Deployment to Hostinger

```bash
# 1. Pull latest changes
git pull

# 2. Check what changed
git status

# 3. FTP all files to Hostinger
# Make sure to include the UPDATED sw.js

# 4. Test the live site
# Open in incognito to see fresh version
```

## Files to Always Push to FTP

- ✅ All .html files
- ✅ styles.css
- ✅ main.js
- ✅ sw.js (IMPORTANT - contains new cache version)
- ✅ manifest.json
- ✅ All assets folders

## Monitoring

After deployment, check:
- [ ] Site loads without errors (DevTools → Console)
- [ ] Service Worker updated (DevTools → Application → Service Workers)
- [ ] New cache version registered (DevTools → Application → Cache Storage)
- [ ] No 404 errors for assets
- [ ] CSS and layout displaying correctly

## Emergency Rollback

If something goes wrong:

1. **On GitHub:** The workflow will auto-rollback
2. **On Your Server:** Reupload previous version of files
3. **Clear Caches:** See manual steps below

## Manual Cache Clear (If Needed)

For users experiencing issues:

1. Browsers: Hard refresh (Ctrl+Shift+R)
2. Clear cache in DevTools
3. Unregister service worker
4. Hard refresh again

---

**Last Updated:** $(date)
**Deployment System:** GitHub Actions with Auto-Versioning

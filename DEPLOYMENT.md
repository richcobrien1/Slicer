# Deploying Slicer to Vercel

## Prerequisites
✅ GitHub account with Slicer repository
✅ Vercel account (free tier works great)

## Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "Add New Project"
4. Import your `richcobrien1/Slicer` repository

### 2. Configure Project
Vercel should auto-detect Vite settings, but verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. Environment Variables
No environment variables needed for this project!

### 4. Deploy
Click "Deploy" - first deployment takes ~2-3 minutes

### 5. Your Live URL
You'll get a URL like: `https://slicer-[random].vercel.app`

## Important Notes

### Large Files Warning
Your repo includes:
- `knurled-containers-model_files.zip` (27MB)
- `onami-pet-food-bowl-raiser-stand-model_files.zip` (6.9MB)
- Various STL files (22MB total in public/models/)

**Total:** ~56MB of 3D model files

Vercel limits:
- Free tier: 100MB deployment size (you're safe!)
- Serverless function size: N/A (not using serverless)

### Automatic Deployments
Once connected, every push to `main` branch automatically deploys!

## Testing Locally Before Deploy
```bash
npm run build
npm run preview
```

## Custom Domain (Optional)
In Vercel dashboard:
1. Go to your project settings
2. Domains tab
3. Add custom domain (if you have one)

## Expected Build Output
```
✓ 150+ modules transformed
✓ built in ~15s
dist/index.html                   0.46 kB
dist/assets/index-[hash].css     12.34 kB
dist/assets/index-[hash].js     850.12 kB
```

## Troubleshooting

### If build fails:
1. Check Node version (Vercel uses Node 18+ by default)
2. Clear cache in Vercel dashboard
3. Check build logs in Vercel

### If models don't load:
- STL files in `public/models/` folder will be at `/models/*.stl`
- Check browser console for 404 errors

## Performance Tips
- STL files are already optimized
- Vite automatically minifies JS/CSS
- Vercel CDN handles caching automatically

## What Gets Deployed
✅ All code in `dist/` after build
✅ All files in `public/` folder
✅ All STL models
❌ node_modules (installed fresh on Vercel)
❌ Source files (only built output)

Your app should deploy perfectly as-is! 🚀

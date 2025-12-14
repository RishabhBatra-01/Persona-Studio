# 🛠️ Setup Guide for Persona Studio

Complete setup instructions for developers and contributors.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Google Gemini API Key** ([Get Free Key](https://aistudio.google.com/app/apikey))

### Check Your Versions

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/yourusername/persona-studio.git

# Navigate to project directory
cd persona-studio
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

**Expected output:**
```
added 200+ packages in 30s
```

**If you see errors:**
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force` then `npm install`

### Step 3: Set Up Environment (Optional)

```bash
# Copy example environment file
cp .env.example .env.local
```

**Edit `.env.local`** (optional):
```env
# Add your API key (or add it via the app UI later)
VITE_API_KEY=your_gemini_api_key_here
```

**Note:** Users can add their API key through the app interface, so this step is optional.

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v6.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open [http://localhost:5173](http://localhost:5173)

You should see the Persona Studio welcome screen! 🎉

## 🔑 Getting Your API Key

### Step 1: Visit Google AI Studio

Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Step 2: Sign In

Sign in with your Google account

### Step 3: Create API Key

1. Click **"Create API Key"**
2. Select **"Create API key in new project"** (or use existing)
3. Copy your API key

### Step 4: Add to App

**Option A: Via App Interface (Recommended)**
1. Open the app
2. Click the key icon in the header
3. Paste your API key
4. Click "Connect Key"

**Option B: Via Environment File**
1. Add to `.env.local`: `VITE_API_KEY=your_key_here`
2. Restart dev server

## 📦 Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Build

```bash
# Create production build
npm run build
```

Output will be in `dist/` folder

### Preview

```bash
# Preview production build locally
npm run preview
```

### Type Check

```bash
# Check TypeScript types
npx tsc --noEmit
```

## 🔧 Troubleshooting

### Issue: Port 5173 Already in Use

**Solution:**
```bash
# Kill the process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
npm run dev -- --port 3000
```

### Issue: Module Not Found

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Fails

**Solution:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Fix any errors shown
# Then try building again
npm run build
```

### Issue: API Key Not Working

**Checklist:**
- [ ] API key is correct (no extra spaces)
- [ ] Billing is enabled in Google Cloud (for Pro models)
- [ ] API key has Gemini API enabled
- [ ] Using correct model (Flash or Pro)

**Test your API key:**
Visit [Google AI Studio](https://aistudio.google.com/) and try generating an image there first.

### Issue: Images Not Generating

**Common causes:**
1. **No API key** - Add your key via the app
2. **Invalid API key** - Check for typos
3. **Billing not enabled** - Enable in Google Cloud Console
4. **Rate limit** - Wait a few minutes and try again
5. **Network issue** - Check your internet connection

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Development

To test on mobile devices:

```bash
# Start dev server with network access
npm run dev -- --host

# You'll see:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.1.x:5173/
```

Open the Network URL on your mobile device (must be on same WiFi).

## 🔒 Security Notes

### Never Commit:
- ❌ `.env` files
- ❌ `.env.local` files
- ❌ API keys
- ❌ Personal data

### Always:
- ✅ Use `.env.example` for templates
- ✅ Add sensitive files to `.gitignore`
- ✅ Let users provide their own API keys

## 📚 Project Structure

```
persona-studio/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── docs/               # Documentation
├── App.tsx             # Main app component
├── index.tsx           # Entry point
├── types.ts            # TypeScript types
├── constants.ts        # App constants
└── theme.css           # Theme styles
```

## 🎨 Customization

### Change Theme Colors

Edit `index.html` CSS variables:

```css
:root {
  --bg-primary: #0A0E1A;
  --text-primary: #F8FAFC;
  /* ... more variables */
}
```

### Add New Styles

Edit `constants.ts`:

```typescript
export const HEADSHOT_STYLES = [
  // Add your new style here
  {
    id: 'your_style',
    name: 'Your Style',
    description: 'Description',
    promptModifier: 'Your prompt'
  }
];
```

## 🚀 Deployment

See [VERCEL_DEPLOYMENT_GUIDE.md](docs/VERCEL_DEPLOYMENT_GUIDE.md) for deployment instructions.

## 📖 Additional Resources

- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [docs/](docs/) - Detailed documentation
- [Custom Style Guide](docs/CUSTOM_STYLE_GUIDE.md) - How to use custom styles

## ❓ Need Help?

- 📧 Email: your.email@example.com
- 🐛 [Report Issues](https://github.com/yourusername/persona-studio/issues)
- 💬 [Discussions](https://github.com/yourusername/persona-studio/discussions)

## ✅ Setup Complete!

If you've followed all steps, you should now have:
- ✅ Project cloned
- ✅ Dependencies installed
- ✅ Dev server running
- ✅ API key configured
- ✅ App working in browser

**Happy coding! 🎉**

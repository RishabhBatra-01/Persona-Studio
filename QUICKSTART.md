# ⚡ Quick Start - 2 Minutes Setup

Get Persona Studio running in 2 minutes!

## 🚀 Super Quick Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/persona-studio.git
cd persona-studio

# 2. Install dependencies
npm install

# 3. Start the app
npm run dev
```

**That's it!** Open [http://localhost:5173](http://localhost:5173)

## 🔑 Add Your API Key

1. Get a free API key: [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click the key icon in the app header
3. Paste your API key
4. Start generating!

## ✅ Verify Everything Works

### Test Checklist:
- [ ] App loads at http://localhost:5173
- [ ] Welcome modal appears (first time only)
- [ ] Can upload a photo
- [ ] Can select a style
- [ ] Can generate headshot (with API key)
- [ ] Can download result

## 🐛 Having Issues?

### Quick Fixes:

**App won't start?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**API key not working?**
- Check for typos (no extra spaces)
- Make sure billing is enabled for Pro models
- Try generating in [Google AI Studio](https://aistudio.google.com/) first

## 📚 Need More Help?

- [Full Setup Guide](SETUP.md) - Detailed instructions
- [README](README.md) - Project overview
- [Contributing](CONTRIBUTING.md) - How to contribute

## 🎉 You're Ready!

Start transforming selfies into professional headshots! 🚀

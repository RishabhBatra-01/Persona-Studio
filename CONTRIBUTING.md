# Contributing to Persona Studio

Thank you for your interest in contributing! 🎉

## 🚀 Quick Start for Contributors

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/persona-studio.git
cd persona-studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment (Optional)

```bash
# Copy the example env file
cp .env.example .env.local

# Add your Google Gemini API key (optional - can be added via UI)
# Edit .env.local and add: VITE_API_KEY=your_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Make Your Changes

- Create a new branch: `git checkout -b feature/your-feature-name`
- Make your changes
- Test thoroughly
- Commit with clear messages

### 6. Submit Pull Request

```bash
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub!

## 📋 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

### Component Structure

```tsx
import React from 'react';

interface ComponentProps {
  // Props with clear types
}

export const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  
  return (
    // JSX
  );
};
```

### Commit Messages

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Refactor: what was refactored`
- `Docs: documentation changes`

### Testing Checklist

Before submitting PR:

- [ ] Code builds without errors (`npm run build`)
- [ ] App runs in development (`npm run dev`)
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] No console errors
- [ ] Follows existing code style
- [ ] Updated documentation if needed

## 🐛 Reporting Bugs

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS info

## 💡 Suggesting Features

Include:
- Clear description
- Use case and benefits
- Mockups or examples (if applicable)

## 📝 Documentation

- Update README.md if adding features
- Add comments for complex code
- Update relevant docs in `/docs` folder

## ❓ Questions?

Open an issue or reach out to the maintainers!

Thank you for contributing! 🙏

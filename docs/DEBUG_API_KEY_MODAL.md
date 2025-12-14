# Debug: API Key Modal Not Appearing

## Issue
When user clicks "Create Magic" without API key, the modal should open but it's not appearing.

## Code Analysis

The logic is correct in `App.tsx`:

```typescript
const handleGenerate = async () => {
  if (!originalImage || !selectedStyle) return;
  
  if (!apiKey) {
    setIsKeyModalOpen(true);  // ✅ This should open modal
    return;
  }
  // ...
}
```

## Possible Causes

### 1. API Key is Actually Set
Check if `process.env.API_KEY` or localStorage has a value:

```typescript
// In App.tsx line 29-31
const [apiKey, setApiKey] = useState<string>(() => {
  return localStorage.getItem('gemini_api_key') || process.env.API_KEY || '';
});
```

**Solution:** Clear localStorage and check .env.local

### 2. Modal Z-Index Issue
The modal has `z-[100]` but something might be covering it.

**Solution:** Increase z-index or check for overlapping elements

### 3. Modal Not Rendering
Check if ApiKeyModal component is imported and rendered correctly.

## Quick Fixes

### Fix 1: Add Console Logs (Debugging)

Add to `App.tsx` in `handleGenerate`:

```typescript
const handleGenerate = async () => {
  console.log('🔍 handleGenerate called');
  console.log('📸 originalImage:', !!originalImage);
  console.log('🎨 selectedStyle:', selectedStyle?.name);
  console.log('🔑 apiKey:', apiKey ? 'EXISTS' : 'MISSING');
  console.log('🚪 isKeyModalOpen:', isKeyModalOpen);
  
  if (!originalImage || !selectedStyle) {
    console.log('❌ Missing image or style');
    return;
  }
  
  if (!apiKey) {
    console.log('🚨 No API key - opening modal');
    setIsKeyModalOpen(true);
    return;
  }
  
  // ... rest of code
}
```

### Fix 2: Force Modal Open on Mount (Testing)

Add to `App.tsx` after state declarations:

```typescript
// TEMPORARY: Force modal open for testing
useEffect(() => {
  if (!apiKey) {
    console.log('🔧 No API key detected on mount');
    setTimeout(() => setIsKeyModalOpen(true), 1000);
  }
}, []);
```

### Fix 3: Check localStorage

Open browser console and run:

```javascript
// Check current value
console.log('API Key:', localStorage.getItem('gemini_api_key'));

// Clear it
localStorage.removeItem('gemini_api_key');

// Reload page
location.reload();
```

### Fix 4: Verify Modal Rendering

Add console log to ApiKeyModal:

```typescript
// In components/ApiKeyModal.tsx
export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, initialKey }) => {
  console.log('🎭 ApiKeyModal render - isOpen:', isOpen);
  
  const [key, setKey] = useState(initialKey);

  useEffect(() => {
    setKey(initialKey);
  }, [initialKey, isOpen]);

  if (!isOpen) {
    console.log('❌ Modal not open - returning null');
    return null;
  }
  
  console.log('✅ Modal is open - rendering');
  
  // ... rest of code
}
```

## Testing Steps

1. **Clear localStorage:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Check .env.local:**
   - Open `.env.local`
   - Make sure `GEMINI_API_KEY` is empty or remove the line
   - Restart dev server

3. **Test the flow:**
   - Upload an image
   - Select a style
   - Click "Create Magic"
   - Check browser console for logs
   - Modal should appear

4. **Check browser console:**
   - Look for any errors
   - Check the console logs we added
   - Verify state changes

## Expected Console Output

When working correctly:
```
🔍 handleGenerate called
📸 originalImage: true
🎨 selectedStyle: Corporate Grey
🔑 apiKey: MISSING
🚪 isKeyModalOpen: false
🚨 No API key - opening modal
🎭 ApiKeyModal render - isOpen: true
✅ Modal is open - rendering
```

## Alternative: Add Visual Indicator

If modal still doesn't show, add a temporary alert:

```typescript
const handleGenerate = async () => {
  if (!originalImage || !selectedStyle) return;
  
  if (!apiKey) {
    alert('No API key found! Opening modal...');
    setIsKeyModalOpen(true);
    return;
  }
  // ...
}
```

This will confirm if the logic is being triggered.

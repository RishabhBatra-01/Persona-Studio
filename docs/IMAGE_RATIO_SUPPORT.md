# Image Aspect Ratio Support

## 📐 Current Aspect Ratio Configuration

### Input Images (Upload)
**Supported:** Any aspect ratio
**Processing:** Proportional resize maintaining original aspect ratio

The app accepts images of any aspect ratio and intelligently resizes them while preserving proportions:

```typescript
// From utils/imageUtils.ts
maxWidth = 1536px
quality = 0.8 (JPEG compression)

// Resize logic:
if (width > height) {
  // Landscape: resize based on width
  if (width > 1536px) {
    height = (height * 1536) / width
    width = 1536
  }
} else {
  // Portrait: resize based on height
  if (height > 1536px) {
    width = (width * 1536) / height
    height = 1536
  }
}
```

**Examples:**
- 4000×3000 (4:3) → 1536×1152 (4:3 preserved)
- 3000×4000 (3:4) → 1152×1536 (3:4 preserved)
- 1920×1080 (16:9) → 1536×864 (16:9 preserved)
- 1080×1920 (9:16) → 864×1536 (9:16 preserved)
- 2000×2000 (1:1) → 1536×1536 (1:1 preserved)

### Display Aspect Ratios

#### 1. **Preview Display (Style Selection)**
```css
aspect-[3/4]  /* 3:4 portrait ratio */
```
- **Ratio:** 3:4 (Portrait)
- **Use Case:** Showing uploaded image before generation
- **Behavior:** Image is cropped/fitted to 3:4 container
- **Location:** Left side during style selection

#### 2. **Result Display (Generated Headshot)**
```css
/* Mobile */
aspect-[3/4]  /* 3:4 portrait ratio */

/* Desktop */
md:aspect-auto md:h-[600px]  /* Natural aspect ratio, 600px height */
```
- **Mobile:** Fixed 3:4 portrait ratio
- **Desktop:** Natural aspect ratio with 600px height
- **Use Case:** Displaying final generated headshot
- **Location:** Main result view with comparison slider

---

## 🎯 Recommended Aspect Ratios

### For Best Results (Professional Headshots)

#### 1. **Portrait (Recommended)**
- **3:4** (e.g., 1152×1536) - Standard portrait
- **2:3** (e.g., 1024×1536) - Classic portrait
- **4:5** (e.g., 1229×1536) - Instagram portrait

**Why:** Professional headshots are typically portrait-oriented

#### 2. **Square (Good)**
- **1:1** (e.g., 1536×1536) - Square format
- **Use Case:** Social media profiles, avatars

#### 3. **Landscape (Acceptable)**
- **4:3** (e.g., 1536×1152) - Standard landscape
- **16:9** (e.g., 1536×864) - Widescreen
- **Use Case:** LinkedIn banners, website headers

---

## 📊 Aspect Ratio Comparison

| Ratio | Dimensions (max 1536) | Best For | Support |
|-------|----------------------|----------|---------|
| **3:4** | 1152×1536 | Professional headshots | ✅ Optimal |
| **2:3** | 1024×1536 | Classic portraits | ✅ Optimal |
| **4:5** | 1229×1536 | Instagram posts | ✅ Optimal |
| **1:1** | 1536×1536 | Profile pictures | ✅ Good |
| **4:3** | 1536×1152 | Landscape photos | ✅ Good |
| **16:9** | 1536×864 | Banners/headers | ⚠️ Acceptable |
| **9:16** | 864×1536 | Vertical video | ⚠️ Acceptable |

---

## 🔧 Technical Details

### Image Processing Pipeline

```
1. User uploads image (any ratio)
   ↓
2. Validate file type (JPG, PNG, WEBP)
   ↓
3. Load image and get dimensions
   ↓
4. Calculate proportional resize (max 1536px)
   ↓
5. Create canvas with new dimensions
   ↓
6. Draw image maintaining aspect ratio
   ↓
7. Compress to JPEG (quality 0.8)
   ↓
8. Convert to base64
   ↓
9. Send to Gemini API
```

### Gemini API Constraints

**Input:**
- Max dimension: 1536px (recommended)
- Supported formats: JPEG, PNG, WEBP
- Max file size: ~10MB (after compression)

**Output:**
- Generated images maintain input aspect ratio
- Resolution: Similar to input (up to 1536px)
- Format: PNG (base64 encoded)

---

## 🎨 UI Display Behavior

### Style Selection Screen
```
┌─────────────────────────────────┐
│  Preview (3:4 fixed)            │
│  ┌─────────────┐                │
│  │             │                │
│  │   Original  │                │
│  │    Image    │                │
│  │             │                │
│  └─────────────┘                │
│                                 │
│  Style Cards →                  │
└─────────────────────────────────┘
```

### Result Screen (Desktop)
```
┌─────────────────────────────────────────┐
│  Result (natural ratio, 600px height)   │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │    Before/After Comparison        │  │
│  │    (Slider)                       │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Edit Panel →                           │
└─────────────────────────────────────────┘
```

### Result Screen (Mobile)
```
┌─────────────┐
│  Result     │
│  (3:4)      │
│  ┌─────────┐│
│  │         ││
│  │ Before/ ││
│  │ After   ││
│  │         ││
│  └─────────┘│
│             │
│  Edit Panel │
└─────────────┘
```

---

## 🔄 Aspect Ratio Conversion

### If You Want to Change Display Ratios

#### Option 1: Change Preview Ratio
```typescript
// In App.tsx, line ~304
// Current:
aspect-[3/4]

// Change to:
aspect-[2/3]   // Taller portrait
aspect-[1/1]   // Square
aspect-[4/5]   // Instagram style
```

#### Option 2: Change Result Ratio (Mobile)
```typescript
// In App.tsx, line ~411
// Current:
aspect-[3/4] md:aspect-auto

// Change to:
aspect-[1/1] md:aspect-auto   // Square on mobile
aspect-[4/5] md:aspect-auto   // Instagram on mobile
```

#### Option 3: Change Max Dimension
```typescript
// In utils/imageUtils.ts
// Current:
maxWidth = 1536

// Change to:
maxWidth = 2048  // Higher quality
maxWidth = 1024  // Faster processing
```

---

## 📱 Platform-Specific Recommendations

### LinkedIn
- **Ratio:** 4:5 or 1:1
- **Dimensions:** 400×400 to 7680×4320
- **Recommended:** 1200×1200 (square)

### Instagram
- **Profile:** 1:1 (1080×1080)
- **Portrait:** 4:5 (1080×1350)
- **Landscape:** 1.91:1 (1080×566)

### Facebook
- **Profile:** 1:1 (180×180 minimum)
- **Cover:** 16:9 (820×312)

### Twitter/X
- **Profile:** 1:1 (400×400)
- **Header:** 3:1 (1500×500)

### Professional Use
- **Business Cards:** 3:4 or 2:3
- **Resumes:** 3:4 portrait
- **ID Photos:** 1:1 or 3:4

---

## ⚙️ Customization Guide

### To Support Specific Aspect Ratios

#### Step 1: Add Aspect Ratio Options
```typescript
// Create new file: types.ts (add to existing)
export enum AspectRatio {
  PORTRAIT_3_4 = '3/4',
  PORTRAIT_2_3 = '2/3',
  SQUARE = '1/1',
  LANDSCAPE_4_3 = '4/3',
  INSTAGRAM = '4/5'
}
```

#### Step 2: Add UI Selector
```typescript
// In App.tsx
const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT_3_4);

// Add selector UI
<select onChange={(e) => setSelectedRatio(e.target.value)}>
  <option value="3/4">Portrait (3:4)</option>
  <option value="1/1">Square (1:1)</option>
  <option value="4/5">Instagram (4:5)</option>
</select>
```

#### Step 3: Apply Dynamic Ratio
```typescript
// In display component
<div className={`aspect-[${selectedRatio}]`}>
  <img src={image} />
</div>
```

---

## 🚀 Performance Considerations

### Current Settings (Optimized)
- **Max dimension:** 1536px
- **Quality:** 0.8 (80%)
- **Format:** JPEG

**Pros:**
- ✅ Fast upload
- ✅ Quick processing
- ✅ Good quality
- ✅ API-friendly size

**Cons:**
- ⚠️ Not suitable for print (use 2048px+)
- ⚠️ Some quality loss from compression

### For Higher Quality
```typescript
// Change in utils/imageUtils.ts
maxWidth = 2048  // Higher resolution
quality = 0.9    // Better quality

// Trade-offs:
// + Better image quality
// - Slower upload
// - More API processing time
// - Higher costs
```

### For Faster Processing
```typescript
maxWidth = 1024  // Lower resolution
quality = 0.7    // More compression

// Trade-offs:
// + Faster upload
// + Quicker processing
// + Lower costs
// - Reduced quality
```

---

## 📋 Summary

### What's Supported
✅ **Any input aspect ratio** (automatically resized proportionally)
✅ **Portrait ratios** (3:4, 2:3, 4:5) - Optimal
✅ **Square ratio** (1:1) - Good
✅ **Landscape ratios** (4:3, 16:9) - Acceptable

### Display Ratios
- **Preview:** 3:4 portrait (fixed)
- **Result (Mobile):** 3:4 portrait (fixed)
- **Result (Desktop):** Natural ratio, 600px height

### Processing
- **Max dimension:** 1536px
- **Maintains:** Original aspect ratio
- **Compression:** JPEG 80% quality
- **Output:** Same ratio as input

### Recommendations
🎯 **Best:** 3:4 portrait (1152×1536)
👍 **Good:** 1:1 square (1536×1536)
✅ **OK:** 4:3 landscape (1536×1152)

---

## 🔍 FAQ

**Q: Can I upload a 16:9 landscape photo?**
A: Yes, but it will be displayed in a 3:4 container (cropped) during preview. The generated output will maintain 16:9.

**Q: What happens to very wide images?**
A: They're resized proportionally to max 1536px width, maintaining aspect ratio.

**Q: Can I change the output aspect ratio?**
A: The output matches the input ratio. To change it, you'd need to crop/resize the input first.

**Q: Why 1536px max?**
A: It's the optimal balance for Gemini API - good quality, fast processing, reasonable costs.

**Q: Does the AI generate different ratios?**
A: No, the AI maintains the input image's aspect ratio in the output.

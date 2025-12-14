// Optimized image utilities with better performance

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * OPTIMIZED: Uses OffscreenCanvas when available for better performance
 * Falls back to regular canvas for older browsers
 */
export const compressAndResizeImage = async (
  file: File, 
  maxWidth = 1536, 
  quality = 0.8
): Promise<string> => {
  // Fail fast for non-images
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file (JPG, PNG, WEBP).');
  }

  // Create bitmap from file (more efficient than Image)
  const bitmap = await createImageBitmap(file);
  
  let width = bitmap.width;
  let height = bitmap.height;

  // Calculate new dimensions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxWidth) {
      width = Math.round((width * maxWidth) / height);
      height = maxWidth;
    }
  }

  // Use OffscreenCanvas if available (better performance)
  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Browser processing failed. Please try a different browser.');
  }

  // Optimize rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // White background for transparency
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  
  // Clean up bitmap
  bitmap.close();

  // Convert to blob then to base64 (more efficient)
  if (canvas instanceof OffscreenCanvas) {
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    return blobToBase64(blob);
  } else {
    return canvas.toDataURL('image/jpeg', quality);
  }
};

// Helper to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
};

export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

// NEW: Image caching with IndexedDB
let dbPromise: Promise<IDBDatabase> | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('persona-studio-cache', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
      };
    });
  }
  return dbPromise;
};

export const cacheImage = async (key: string, dataUrl: string): Promise<void> => {
  try {
    const db = await getDB();
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    store.put(dataUrl, key);
  } catch (error) {
    console.warn('Failed to cache image:', error);
  }
};

export const getCachedImage = async (key: string): Promise<string | null> => {
  try {
    const db = await getDB();
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to get cached image:', error);
    return null;
  }
};

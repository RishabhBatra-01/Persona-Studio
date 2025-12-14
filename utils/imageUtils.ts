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
 * Resizes and compresses an image file to ensure it meets API requirements 
 * and optimizes upload speed.
 * Max dimension: 1536px (Good balance for Gemini Flash Image)
 * Quality: 0.8 JPEG
 */
export const compressAndResizeImage = (file: File, maxWidth = 1536, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Fail fast for non-images
    if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload a valid image file (JPG, PNG, WEBP).'));
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width *= maxWidth / height));
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            reject(new Error('Browser processing failed. Please try a different browser.'));
            return;
        }

        // Draw and compress
        ctx.fillStyle = '#FFFFFF'; // Prevent transparent backgrounds turning black
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Return compressed base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image. The file may be corrupted.'));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
  });
};

export const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
};

export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/jpeg'; // Default to jpeg if not found
};
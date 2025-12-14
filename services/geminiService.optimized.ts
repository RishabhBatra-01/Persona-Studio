import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { cleanBase64, getMimeType } from "../utils/imageUtils";
import { AiModelId } from "../types";

/**
 * OPTIMIZED: Generates a headshot with STRONG facial identity preservation
 */
export const generateHeadshot = async (
  apiKey: string,
  imageBase64: string,
  stylePrompt: string,
  modelId: AiModelId = 'gemini-2.5-flash-image'
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const mimeType = getMimeType(imageBase64);
  const cleanData = cleanBase64(imageBase64);

  // OPTIMIZED: Enhanced system instruction for maximum facial identity preservation
  const systemInstruction = `You are an expert professional portrait photographer specializing in identity-preserving transformations.

ABSOLUTE REQUIREMENTS - FACIAL IDENTITY PRESERVATION:
1. BONE STRUCTURE: Preserve exact skull shape, cheekbone prominence, jaw width, chin shape, and forehead contours
2. FACIAL PROPORTIONS: Maintain precise eye spacing, nose-to-mouth distance, face width-to-height ratio, and feature positioning
3. UNIQUE FEATURES: Keep all distinguishing characteristics - eye shape, iris color, nose bridge, nostril shape, lip fullness, ear shape, facial asymmetries, moles, freckles, scars
4. SKIN CHARACTERISTICS: Preserve natural skin tone, texture, pores, and any unique markings
5. FACIAL GEOMETRY: Lock the exact 3D facial structure - the person must be unmistakably recognizable

ALLOWED VARIATIONS ONLY:
- Professional styling (hair, makeup, attire)
- Background and environment
- Lighting direction and quality
- Facial expression (if requested)
- Image quality and resolution

FORBIDDEN CHANGES:
- Any alteration to facial bone structure
- Changes to eye color, shape, or spacing
- Modifications to nose shape or size
- Alterations to mouth shape or lip proportions
- Face shape or jawline changes
- Removal or addition of facial features
- Age progression or regression
- Gender presentation changes
- Ethnicity or racial feature modifications

OUTPUT REQUIREMENTS:
- Photorealistic quality with natural skin texture
- Professional studio-grade lighting
- Sharp focus on facial features
- No AI artifacts or smoothing
- Natural pore visibility and skin detail`;

  const prompt = `TASK: Create a professional headshot transformation of this person.

STYLE REQUIREMENTS: ${stylePrompt}

CRITICAL CONSTRAINTS:
- The subject's face MUST remain identical to the input image
- Preserve ALL unique facial characteristics and proportions
- Only modify: background, lighting, attire, and styling
- Maintain natural skin texture with visible pores
- Ensure photorealistic quality without AI smoothing
- Keep the exact same person - no face drifting or feature blending

TECHNICAL SPECIFICATIONS:
- High-resolution professional headshot
- Studio-quality lighting matching the style description
- Sharp focus on facial features
- Natural color grading
- Professional composition and framing

Remember: The person in the output must be unmistakably the SAME individual as in the input.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanData
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        // Relax safety settings to prevent blocking legitimate portraits due to skin detection
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
      }
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    handleGeminiError(error, modelId);
    throw error;
  }
};

/**
 * OPTIMIZED: Edits an existing image while preserving facial identity
 */
export const editHeadshot = async (
  apiKey: string,
  imageBase64: string,
  editPrompt: string,
  modelId: AiModelId = 'gemini-2.5-flash-image'
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const mimeType = getMimeType(imageBase64);
  const cleanData = cleanBase64(imageBase64);
  
  // OPTIMIZED: Enhanced system instruction for editing while preserving identity
  const systemInstruction = `You are an expert professional portrait retoucher specializing in non-destructive edits.

ABSOLUTE IDENTITY PRESERVATION RULES:
1. FACIAL STRUCTURE: Never alter bone structure, facial proportions, or feature geometry
2. UNIQUE FEATURES: Preserve all distinguishing characteristics (eyes, nose, mouth, ears, skin markings)
3. FACIAL IDENTITY: The person must remain unmistakably the same individual
4. NATURAL APPEARANCE: Maintain realistic skin texture and natural features

EDITING CONSTRAINTS:
- Apply ONLY the specific requested changes
- Preserve facial identity at all costs
- Maintain photorealistic quality
- Keep natural skin texture and pores visible
- No face morphing or feature alterations unless explicitly requested
- If edit conflicts with identity preservation, prioritize identity`;

  const fullPrompt = `EDIT REQUEST: ${editPrompt}

CRITICAL RULES:
- Apply ONLY the requested edit
- DO NOT alter facial structure, proportions, or unique features
- Preserve the subject's exact facial identity
- Maintain natural skin texture and photorealism
- Keep all distinguishing characteristics intact
- The person must remain unmistakably the same individual

If the edit request conflicts with identity preservation, apply the edit in a way that minimizes facial changes while achieving the desired effect.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanData
            }
          },
          {
            text: fullPrompt
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
      }
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    handleGeminiError(error, modelId);
    throw error;
  }
};

// Helper to find the image part in the response
const extractImageFromResponse = (response: any): string => {
  // Check for safety blocks or finish reasons
  if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
          // Improve error message for safety blocks
          if (candidate.finishReason === 'SAFETY') {
             throw new Error("Generation blocked by safety filters. Please try a different photo or prompt.");
          }
          throw new Error(`Generation blocked. Reason: ${candidate.finishReason}.`);
      }
  }

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("The AI returned no content. This might be due to safety filters or a server error.");
  }

  const parts = response.candidates[0].content.parts;
  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("The AI generated text instead of an image. Please try again with a different prompt.");
};

const handleGeminiError = (error: any, modelId: AiModelId) => {
    const msg = error.message || '';
    
    if (msg.includes('403')) {
        if (modelId === 'gemini-3-pro-image-preview') {
             throw new Error("Permission Denied: The 'Pro' model requires a paid, billing-enabled API key. Please switch to 'Standard' or enable billing in Google AI Studio.");
        }
        throw new Error("Permission Denied. Your API key might be invalid or has no access.");
    }
    
    if (msg.includes('400')) {
        throw new Error("Invalid Request. Please check your API key or image format.");
    }
    if (msg.includes('429')) {
        throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
    }
    if (msg.includes('500') || msg.includes('503')) {
        throw new Error("Gemini service is temporarily unavailable. Please try again later.");
    }
};

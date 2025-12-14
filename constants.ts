import { HeadshotStyle, AiModelConfig } from './types';

export const AI_MODELS: AiModelConfig[] = [
  {
    id: 'gemini-2.5-flash-image',
    name: 'Standard',
    badge: 'Flash',
    description: 'Fast generation (seconds). Good for quick ideas.'
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Pro',
    badge: 'Paid Key',
    description: 'Highest quality. Requires a billing-enabled API key.'
  }
];

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Grey',
    description: 'Clean, professional studio look with a neutral grey backdrop.',
    promptModifier: 'professional corporate headshot, wearing a business suit, neutral grey studio background, soft studio lighting, high quality, photorealistic',
    previewColor: 'from-gray-500 to-gray-700'
  },
  {
    id: 'tech_office',
    name: 'Modern Tech',
    description: 'Smart casual look in a modern, open-plan office environment.',
    promptModifier: 'modern professional headshot, wearing smart casual tech attire, blurred modern open office background with glass and plants, bright natural lighting, photorealistic',
    previewColor: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'academic',
    name: 'Academic Library',
    description: 'Intellectual vibe with a blurred library or bookshelf background.',
    promptModifier: 'professional academic headshot, wearing smart blazer or tweed jacket, blurred library bookshelf background, warm lighting, intellectual look, photorealistic',
    previewColor: 'from-amber-700 to-orange-900'
  },
  {
    id: 'medical',
    name: 'Medical / Clinical',
    description: 'Clean, trustworthy look suitable for healthcare professionals.',
    promptModifier: 'professional medical headshot, wearing white lab coat or scrubs, clean bright clinical background, soft lighting, trustworthy expression, photorealistic',
    previewColor: 'from-cyan-500 to-blue-400'
  },
  {
    id: 'real_estate',
    name: 'Luxury Interior',
    description: 'Bright, welcoming look with a modern luxury home backdrop.',
    promptModifier: 'professional real estate agent headshot, wearing smart business attire, blurred luxury modern home interior background, bright welcoming lighting, high key',
    previewColor: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    description: 'Relaxed, remote-work friendly atmosphere in a cozy cafe.',
    promptModifier: 'casual professional headshot, wearing smart casual clothes, blurred coffee shop background with warm ambient lights, relaxed atmosphere, bokeh',
    previewColor: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'speaker',
    name: 'Keynote Speaker',
    description: 'Dynamic stage lighting for thought leaders and presenters.',
    promptModifier: 'professional headshot as a keynote speaker, wearing smart attire, blurred dark stage background with purple and blue spotlight bokeh, confident pose, dramatic lighting',
    previewColor: 'from-purple-600 to-pink-600'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Natural',
    description: 'Approachable and friendly vibe with soft outdoor lighting.',
    promptModifier: 'professional outdoor headshot, wearing business casual, blurred park or city garden background, golden hour sunlight, bokeh effect, warm tones, photorealistic',
    previewColor: 'from-green-500 to-emerald-700'
  },
  {
    id: 'startup',
    name: 'Startup Creative',
    description: 'Energetic and creative look with a colorful urban backdrop.',
    promptModifier: 'creative professional headshot, wearing stylish casual clothes, colorful urban brick wall or artistic office background, dynamic lighting, sharp focus',
    previewColor: 'from-orange-500 to-red-700'
  },
  {
    id: 'black_white',
    name: 'Dramatic B&W',
    description: 'Timeless and serious black and white portrait.',
    promptModifier: 'black and white professional headshot, dramatic contrast lighting, studio black background, serious and elegant expression, noir style',
    previewColor: 'from-gray-800 to-black'
  },
  {
    id: 'custom',
    name: 'Custom Style',
    description: 'Describe your own unique setting, lighting, and attire.',
    promptModifier: '', // Populated dynamically
    previewColor: 'from-pink-500 to-rose-600'
  }
];
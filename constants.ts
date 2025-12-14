import { NanoBananaPrompt } from './types';

export const DEFAULT_PROMPT: NanoBananaPrompt = {
  image_prompt: {
    subject: {
      age: 25,
      gender: 'unspecified',
      ethnicity: 'unspecified',
      skin_tone: 'neutral',
      hair_style: 'natural',
      hair_color: 'natural',
      expression: 'neutral',
      clothing: 'casual',
      pose: 'standing',
      accessories: '',
    },
    style: {
      art_style: 'photorealistic',
      fidelity: 90,
      texture_realism: 80,
      material_influence: 'organic',
      artistic_reference: '',
    },
    camera: {
      type: 'DSLR',
      lens: '50mm',
      depth_of_field: 'medium',
      framing: 'medium-shot',
      angle: 'eye-level',
      rule_of_thirds: true,
    },
    lighting: {
      type: 'softbox',
      direction: 'front-left',
      color_temperature: 'neutral',
      shadow_intensity: 40,
      hdr_enabled: false,
    },
    environment: {
      location_type: 'studio',
      description: 'simple backdrop',
      time_of_day: 'unknown',
      weather: 'clear',
      detail_level: 'moderate',
    },
    mood: {
      preset: 'balanced',
      color_grading: 'standard',
      emotional_tone: 'neutral',
    },
    quality: {
      resolution: '4K',
      artifact_suppression: true,
      sharpness: 75,
      noise_level: 10,
      consistency_lock: true,
    },
    negative_prompt: ['blurry', 'distorted', 'low quality', 'bad anatomy'],
  },
};

export const OPTIONS = {
  gender: ['male', 'female', 'non-binary', 'unspecified'],
  skin_tone: ['pale', 'fair', 'neutral', 'olive', 'tan', 'brown', 'dark brown', 'black', 'fantasy'],
  hair_color: ['blonde', 'brunette', 'black', 'red', 'white', 'grey', 'pastel', 'neon'],
  art_styles: ['photorealistic', 'cinematic', 'anime', 'digital painting', 'oil painting', 'cyberpunk', 'vaporwave', 'noir', 'minimalist', 'pixel art'],
  camera_types: ['DSLR', 'mirrorless', 'film camera', 'smartphone', 'drone', 'security cam'],
  lenses: ['14mm', '24mm', '35mm', '50mm', '85mm', '135mm', '200mm', 'macro 100mm'],
  lighting_types: ['natural', 'studio', 'cinematic', 'neon', 'candlelight', 'bioluminescent', 'hard flash'],
  locations: ['indoor', 'outdoor', 'studio', 'abstract', 'space', 'underwater'],
  moods: ['balanced', 'dramatic', 'joyful', 'melancholic', 'eerie', 'romantic', 'tense', 'ethereal'],
  resolutions: ['1K', '2K', '4K', '8K'],
};

export const generateRandomPrompt = (): NanoBananaPrompt => {
  const r = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const rb = () => Math.random() > 0.5;

  const clothes = ['Casual Streetwear', 'Formal Suit', 'Cybernetic Armor', 'Vintage 1950s', 'High Fantasy Robes', 'Tactical Gear', 'Minimalist Fashion'];
  const poses = ['Standing confident', 'Sitting relaxed', 'Action jump', 'Portrait close-up', 'Walking away', 'Floating zero-g'];
  const refs = ['Greg Rutkowski', 'Syd Mead', 'Alphonse Mucha', 'Zaha Hadid', 'Roger Deakins', 'Wes Anderson'];

  return {
    image_prompt: {
      subject: {
        age: ri(18, 70),
        gender: r(OPTIONS.gender),
        ethnicity: r(['East Asian', 'Caucasian', 'Black', 'Latino', 'South Asian', 'Middle Eastern', 'Mixed']),
        skin_tone: r(OPTIONS.skin_tone),
        hair_style: r(['Short bob', 'Long flowing', 'Buzz cut', 'Mohawk', 'Braided', 'Bald']),
        hair_color: r(OPTIONS.hair_color),
        expression: r(['Neutral', 'Happy', 'Angry', 'Mysterious', 'Surprised', 'Serene']),
        clothing: r(clothes),
        pose: r(poses),
        accessories: r(['Glasses', 'Earrings', 'Necklace', 'Scarf', 'Hat', 'Headphones']),
      },
      style: {
        art_style: r(OPTIONS.art_styles),
        fidelity: ri(60, 100),
        texture_realism: ri(50, 100),
        material_influence: r(['Organic', 'Metallic', 'Plastic', 'Fabric', 'Liquid', 'Ethereal']),
        artistic_reference: Math.random() > 0.7 ? r(refs) : '',
      },
      camera: {
        type: r(OPTIONS.camera_types),
        lens: r(OPTIONS.lenses),
        depth_of_field: r(['shallow', 'medium', 'deep']),
        framing: r(['close-up', 'medium-shot', 'full-body', 'wide-angle']),
        angle: r(['eye-level', 'low-angle', 'high-angle']),
        rule_of_thirds: rb(),
      },
      lighting: {
        type: r(OPTIONS.lighting_types),
        direction: r(['front', 'side', 'back', 'top', 'bottom']),
        color_temperature: r(['warm', 'neutral', 'cool']),
        shadow_intensity: ri(20, 80),
        hdr_enabled: rb(),
      },
      environment: {
        location_type: r(OPTIONS.locations),
        description: r(['Busy city street', 'Quiet forest', 'Neon lab', 'Desert dunes', 'Ocean cliff', 'Cozy living room']),
        time_of_day: r(['Dawn', 'Noon', 'Dusk', 'Midnight']),
        weather: r(['Clear', 'Rainy', 'Cloudy', 'Snowy', 'Foggy']),
        detail_level: r(['minimal', 'moderate', 'high', 'intricate']),
      },
      mood: {
        preset: r(OPTIONS.moods),
        color_grading: r(['Vibrant', 'Muted', 'Black & White', 'Sepia', 'Teal & Orange']),
        emotional_tone: r(['Peaceful', 'Energetic', 'Dark', 'Hopeful']),
      },
      quality: {
        resolution: r(OPTIONS.resolutions),
        artifact_suppression: true,
        sharpness: ri(60, 90),
        noise_level: ri(5, 30),
        consistency_lock: rb(),
      },
      negative_prompt: ['blurry', 'distorted', 'low quality', 'bad anatomy', 'watermark'],
    },
  };
};
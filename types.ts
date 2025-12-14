export interface NanoBananaPrompt {
  image_prompt: {
    subject: SubjectSettings;
    style: StyleSettings;
    camera: CameraSettings;
    lighting: LightingSettings;
    environment: EnvironmentSettings;
    mood: MoodSettings;
    quality: QualitySettings;
    negative_prompt: string[];
  };
}

export interface SubjectSettings {
  age?: number;
  gender: 'male' | 'female' | 'non-binary' | 'unspecified';
  ethnicity: string;
  skin_tone: string;
  hair_style: string;
  hair_color: string;
  expression: string;
  clothing: string;
  pose: string;
  accessories: string;
}

export interface StyleSettings {
  art_style: string;
  fidelity: number; // 0-100
  texture_realism: number; // 0-100
  material_influence: string;
  artistic_reference: string;
}

export interface CameraSettings {
  type: string;
  lens: string;
  depth_of_field: 'shallow' | 'medium' | 'deep' | 'infinite';
  framing: 'close-up' | 'medium-shot' | 'full-body' | 'wide-angle' | 'macro';
  angle: 'eye-level' | 'low-angle' | 'high-angle' | 'bird-eye' | 'dutch-angle';
  rule_of_thirds: boolean;
}

export interface LightingSettings {
  type: string;
  direction: string;
  color_temperature: 'warm' | 'neutral' | 'cool';
  shadow_intensity: number; // 0-100
  hdr_enabled: boolean;
}

export interface EnvironmentSettings {
  location_type: 'indoor' | 'outdoor' | 'studio' | 'abstract';
  description: string;
  time_of_day: string;
  weather: string;
  detail_level: 'minimal' | 'moderate' | 'high' | 'intricate';
}

export interface MoodSettings {
  preset: string;
  color_grading: string;
  emotional_tone: string;
}

export interface QualitySettings {
  resolution: '1K' | '2K' | '4K' | '8K';
  artifact_suppression: boolean;
  sharpness: number; // 0-100
  noise_level: number; // 0-100
  consistency_lock: boolean;
}

export type ModuleKey = keyof NanoBananaPrompt['image_prompt'];

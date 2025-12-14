import React from 'react';
import { NanoBananaPrompt, SubjectSettings, StyleSettings, CameraSettings, LightingSettings, EnvironmentSettings, MoodSettings, QualitySettings } from '../types';
import { InputGroup, Select, Slider, TextInput, Toggle } from './UIComponents';
import { OPTIONS } from '../constants';

interface PromptFormProps {
  prompt: NanoBananaPrompt;
  updatePrompt: (section: keyof NanoBananaPrompt['image_prompt'], key: string, value: any) => void;
  updateNegativePrompt: (value: string[]) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, updatePrompt, updateNegativePrompt }) => {
  const p = prompt.image_prompt;

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateNegativePrompt(val.split(',').map(s => s.trim()).filter(s => s.length > 0));
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Subject Section */}
      <div className="space-y-4">
        <h3 className="text-banana-400 text-sm font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">Subject Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Gender">
              <Select options={OPTIONS.gender} value={p.subject.gender} onChange={(e) => updatePrompt('subject', 'gender', e.target.value)} />
            </InputGroup>
            <InputGroup label={`Age: ${p.subject.age || 25} yrs`}>
              <Slider min={1} max={100} value={p.subject.age || 25} onChange={(e) => updatePrompt('subject', 'age', parseInt(e.target.value))} />
            </InputGroup>
            <InputGroup label="Ethnicity">
              <TextInput placeholder="e.g., East Asian, Scandinavian..." value={p.subject.ethnicity} onChange={(e) => updatePrompt('subject', 'ethnicity', e.target.value)} />
            </InputGroup>
            <InputGroup label="Skin Tone">
              <Select options={OPTIONS.skin_tone} value={p.subject.skin_tone} onChange={(e) => updatePrompt('subject', 'skin_tone', e.target.value)} />
            </InputGroup>
             <InputGroup label="Hair Color">
              <Select options={OPTIONS.hair_color} value={p.subject.hair_color} onChange={(e) => updatePrompt('subject', 'hair_color', e.target.value)} />
            </InputGroup>
             <InputGroup label="Hair Style">
              <TextInput placeholder="e.g., Pixie cut, long wavy..." value={p.subject.hair_style} onChange={(e) => updatePrompt('subject', 'hair_style', e.target.value)} />
            </InputGroup>
             <InputGroup label="Clothing">
              <TextInput placeholder="e.g., Cyberpunk jacket..." value={p.subject.clothing} onChange={(e) => updatePrompt('subject', 'clothing', e.target.value)} />
            </InputGroup>
             <InputGroup label="Pose">
              <TextInput placeholder="e.g., Dynamic jumping..." value={p.subject.pose} onChange={(e) => updatePrompt('subject', 'pose', e.target.value)} />
            </InputGroup>
        </div>
      </div>

      {/* Style Section */}
      <div className="space-y-4">
        <h3 className="text-banana-400 text-sm font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">Style & Rendering</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Art Style">
            <Select options={OPTIONS.art_styles} value={p.style.art_style} onChange={(e) => updatePrompt('style', 'art_style', e.target.value)} />
          </InputGroup>
          <InputGroup label="Material Influence">
             <TextInput placeholder="e.g., Porcelain, Carbon Fiber..." value={p.style.material_influence} onChange={(e) => updatePrompt('style', 'material_influence', e.target.value)} />
          </InputGroup>
          <InputGroup label="Fidelity" helper="Lower for abstraction, higher for realism">
            <Slider min={0} max={100} value={p.style.fidelity} onChange={(e) => updatePrompt('style', 'fidelity', parseInt(e.target.value))} suffix="%" />
          </InputGroup>
          <InputGroup label="Texture Realism">
            <Slider min={0} max={100} value={p.style.texture_realism} onChange={(e) => updatePrompt('style', 'texture_realism', parseInt(e.target.value))} suffix="%" />
          </InputGroup>
        </div>
      </div>

       {/* Camera Section */}
       <div className="space-y-4">
        <h3 className="text-banana-400 text-sm font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">Camera & Optic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Camera Type">
            <Select options={OPTIONS.camera_types} value={p.camera.type} onChange={(e) => updatePrompt('camera', 'type', e.target.value)} />
          </InputGroup>
          <InputGroup label="Lens">
            <Select options={OPTIONS.lenses} value={p.camera.lens} onChange={(e) => updatePrompt('camera', 'lens', e.target.value)} />
          </InputGroup>
          <InputGroup label="Framing">
             <Select options={['close-up', 'medium-shot', 'full-body', 'wide-angle', 'macro']} value={p.camera.framing} onChange={(e) => updatePrompt('camera', 'framing', e.target.value)} />
          </InputGroup>
          <InputGroup label="Angle">
             <Select options={['eye-level', 'low-angle', 'high-angle', 'bird-eye', 'dutch-angle']} value={p.camera.angle} onChange={(e) => updatePrompt('camera', 'angle', e.target.value)} />
          </InputGroup>
          <div className="md:col-span-2 pt-2">
            <Toggle label="Enable Rule of Thirds Grid" checked={p.camera.rule_of_thirds} onChange={(v) => updatePrompt('camera', 'rule_of_thirds', v)} />
          </div>
        </div>
      </div>

      {/* Environment & Lighting */}
      <div className="space-y-4">
        <h3 className="text-banana-400 text-sm font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">World & Light</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <InputGroup label="Location Type">
            <Select options={OPTIONS.locations} value={p.environment.location_type} onChange={(e) => updatePrompt('environment', 'location_type', e.target.value)} />
          </InputGroup>
          <InputGroup label="Lighting Type">
            <Select options={OPTIONS.lighting_types} value={p.lighting.type} onChange={(e) => updatePrompt('lighting', 'type', e.target.value)} />
          </InputGroup>
          <InputGroup label="Time of Day">
             <TextInput placeholder="e.g., Golden Hour, Midnight..." value={p.environment.time_of_day} onChange={(e) => updatePrompt('environment', 'time_of_day', e.target.value)} />
          </InputGroup>
          <InputGroup label="Weather">
             <TextInput placeholder="e.g., Rainy, Foggy..." value={p.environment.weather} onChange={(e) => updatePrompt('environment', 'weather', e.target.value)} />
          </InputGroup>
           <InputGroup label="Shadow Intensity">
            <Slider min={0} max={100} value={p.lighting.shadow_intensity} onChange={(e) => updatePrompt('lighting', 'shadow_intensity', parseInt(e.target.value))} suffix="%" />
          </InputGroup>
          <div className="pt-6">
            <Toggle label="Enable HDR Processing" checked={p.lighting.hdr_enabled} onChange={(v) => updatePrompt('lighting', 'hdr_enabled', v)} />
          </div>
        </div>
      </div>

       {/* Quality & Constraints */}
       <div className="space-y-4">
        <h3 className="text-banana-400 text-sm font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">Quality & Output</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <InputGroup label="Resolution">
            <Select options={OPTIONS.resolutions} value={p.quality.resolution} onChange={(e) => updatePrompt('quality', 'resolution', e.target.value)} />
          </InputGroup>
           <InputGroup label="Sharpness">
            <Slider min={0} max={100} value={p.quality.sharpness} onChange={(e) => updatePrompt('quality', 'sharpness', parseInt(e.target.value))} suffix="%" />
          </InputGroup>
          <div className="md:col-span-2 space-y-3">
             <Toggle label="Artifact Suppression" checked={p.quality.artifact_suppression} onChange={(v) => updatePrompt('quality', 'artifact_suppression', v)} />
             <Toggle label="Consistency Lock" checked={p.quality.consistency_lock} onChange={(v) => updatePrompt('quality', 'consistency_lock', v)} />
          </div>
          <div className="md:col-span-2">
            <InputGroup label="Negative Prompt (comma separated)">
              <TextInput 
                placeholder="e.g., blurry, bad hands, text..." 
                value={p.negative_prompt.join(', ')} 
                onChange={handleNegativePromptChange} 
              />
            </InputGroup>
          </div>
        </div>
      </div>

    </div>
  );
};

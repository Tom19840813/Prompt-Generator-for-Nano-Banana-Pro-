import React, { useEffect, useRef } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import * as d3 from 'd3';
import { NanoBananaPrompt } from '../types';

interface PromptRadarProps {
  prompt: NanoBananaPrompt;
}

export const PromptRadar: React.FC<PromptRadarProps> = ({ prompt }) => {
  // Calculate metrics based on prompt values
  const fidelity = prompt.image_prompt.style.fidelity;
  const mood = prompt.image_prompt.mood.emotional_tone !== 'neutral' ? 80 : 30;
  const complexity = (
    (prompt.image_prompt.environment.detail_level === 'intricate' ? 100 : 50) + 
    (prompt.image_prompt.lighting.shadow_intensity)
  ) / 2;
  const tech = (
    (prompt.image_prompt.quality.resolution === '8K' ? 100 : 50) + 
    (prompt.image_prompt.quality.sharpness)
  ) / 2;
  const stylization = 100 - prompt.image_prompt.style.texture_realism;

  const data = [
    { subject: 'Realism', A: fidelity, fullMark: 100 },
    { subject: 'Atmosphere', A: mood, fullMark: 100 },
    { subject: 'Complexity', A: complexity, fullMark: 100 },
    { subject: 'Tech Specs', A: tech, fullMark: 100 },
    { subject: 'Stylization', A: stylization, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Prompt Profile"
            dataKey="A"
            stroke="#eab308"
            strokeWidth={2}
            fill="#eab308"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fefce8' }}
            itemStyle={{ color: '#eab308' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface TokenDensityProps {
  prompt: NanoBananaPrompt;
}

export const TokenDensity: React.FC<TokenDensityProps> = ({ prompt }) => {
  const d3Container = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove();

      // Simple pseudo-token calculation
      const jsonString = JSON.stringify(prompt.image_prompt);
      const tokenCount = Math.ceil(jsonString.length / 4);
      const maxTokens = 500; // Hypothetical limit for Nano Banana Pro
      const percent = Math.min((tokenCount / maxTokens) * 100, 100);

      const width = 300;
      const height = 10;

      const g = svg.append("g");

      // Background
      g.append("rect")
        .attr("width", "100%")
        .attr("height", height)
        .attr("rx", 5)
        .attr("fill", "#27272a");

      // Fill
      g.append("rect")
        .attr("width", `${percent}%`)
        .attr("height", height)
        .attr("rx", 5)
        .attr("fill", percent > 90 ? "#ef4444" : "#eab308")
        .transition()
        .duration(800)
        .attr("width", `${percent}%`); // Animate width

    }
  }, [prompt]);

  // Approx token count for display
  const tokenCount = Math.ceil(JSON.stringify(prompt.image_prompt).length / 4);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>Token Usage Est.</span>
        <span>{tokenCount} / 500</span>
      </div>
      <svg className="w-full h-3" ref={d3Container} />
    </div>
  );
};

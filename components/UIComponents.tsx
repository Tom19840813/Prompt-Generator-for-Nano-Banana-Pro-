import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-nano-900";
  
  const variants = {
    primary: "bg-banana-500 hover:bg-banana-400 text-nano-900 focus:ring-banana-500",
    secondary: "bg-nano-800 hover:bg-zinc-700 text-white border border-zinc-700 focus:ring-zinc-500",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white focus:ring-zinc-500",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon: Icon, action }) => {
  return (
    <div className={`bg-nano-800 border border-zinc-800 rounded-lg overflow-hidden ${className}`}>
      {(title || Icon) && (
        <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2 text-banana-400 font-semibold">
            {Icon && <Icon size={18} />}
            <span>{title}</span>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  helper?: string;
  children: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, helper, children }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      {children}
      {helper && <p className="text-xs text-zinc-500">{helper}</p>}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }> = ({ options, className, ...props }) => (
  <select 
    className={`w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-banana-500 focus:ring-1 focus:ring-banana-500 transition-colors ${className}`}
    {...props}
  >
    {options.map(opt => (
      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
    ))}
  </select>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input 
    type="text"
    className={`w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-banana-500 focus:ring-1 focus:ring-banana-500 transition-colors ${className}`}
    {...props}
  />
);

export const Slider: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { suffix?: string }> = ({ className, suffix, ...props }) => (
  <div className="flex items-center gap-3">
    <input 
      type="range"
      className={`w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-banana-500 ${className}`}
      {...props}
    />
    {suffix && <span className="text-xs font-mono text-banana-400 min-w-[3rem] text-right">{props.value}{suffix}</span>}
  </div>
);

export const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label?: string }> = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between cursor-pointer group" onClick={() => onChange(!checked)}>
    {label && <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{label}</span>}
    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-banana-500' : 'bg-zinc-700'}`}>
      <span 
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </div>
  </div>
);

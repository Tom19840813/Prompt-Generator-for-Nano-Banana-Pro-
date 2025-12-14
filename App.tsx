import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Copy, Download, Share2, RotateCcw, Zap, History, Code, Shuffle, Bookmark, Table, Sparkles, Trash2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { NanoBananaPrompt } from './types';
import { DEFAULT_PROMPT, generateRandomPrompt } from './constants';
import { PromptForm } from './components/PromptForm';
import { Button, Card } from './components/UIComponents';
import { PromptRadar, TokenDensity } from './components/Visualizers';

// Helper to save/load from local storage
const HISTORY_KEY = 'nano_banana_history';
const LIBRARY_KEY = 'nano_banana_library';
const MAX_HISTORY = 10;

function App() {
  const [prompt, setPrompt] = useState<NanoBananaPrompt>(DEFAULT_PROMPT);
  const [history, setHistory] = useState<NanoBananaPrompt[]>([]);
  const [library, setLibrary] = useState<NanoBananaPrompt[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'history' | 'library'>('history');
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Load history & library on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedLibrary = localStorage.getItem(LIBRARY_KEY);
    
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error("Failed to parse history", e); }
    }
    if (savedLibrary) {
      try { setLibrary(JSON.parse(savedLibrary)); } catch (e) { console.error("Failed to parse library", e); }
    }
    
    // Check for hash params for sharing
    if (window.location.hash) {
        try {
            const decoded = JSON.parse(atob(decodeURIComponent(window.location.hash.substring(1))));
            if (decoded && decoded.image_prompt) {
                setPrompt(decoded);
            }
        } catch(e) {
            console.error("Invalid share link");
        }
    }
  }, []);

  const updatePrompt = useCallback((section: keyof NanoBananaPrompt['image_prompt'], key: string, value: any) => {
    setPrompt(prev => ({
      ...prev,
      image_prompt: {
        ...prev.image_prompt,
        [section]: {
          ...prev.image_prompt[section],
          [key]: value
        }
      }
    }));
  }, []);

  const updateNegativePrompt = useCallback((values: string[]) => {
    setPrompt(prev => ({
        ...prev,
        image_prompt: {
            ...prev.image_prompt,
            negative_prompt: values
        }
    }));
  }, []);

  const handleGenerate = () => {
    // Add to history
    const newHistory = [prompt, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleRandomize = () => {
    const newPrompt = generateRandomPrompt();
    setPrompt(newPrompt);
  };

  const handleSaveToLibrary = () => {
    const newLibrary = [prompt, ...library];
    setLibrary(newLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(newLibrary));
    setSidebarTab('library');
    setShowSidebar(true);
  };

  const removeFromLibrary = (index: number) => {
    const newLibrary = library.filter((_, i) => i !== index);
    setLibrary(newLibrary);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(newLibrary));
  };

  const handleAIEnhance = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not configured. Please ensure process.env.API_KEY is available.");
      return;
    }

    setIsEnhancing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentJson = JSON.stringify(prompt.image_prompt);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this image generation prompt JSON and enhance it creatively. 
        Fill in any generic fields with high-quality, artistic details suitable for a pro-grade image generator. 
        Keep the structure EXACTLY the same. 
        Current JSON: ${currentJson}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              image_prompt: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  style: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  camera: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  lighting: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  environment: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  mood: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  quality: { type: Type.OBJECT, properties: {}, additionalProperties: true },
                  negative_prompt: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      });

      if (response.text) {
        const enhanced = JSON.parse(response.text);
        if (enhanced && enhanced.image_prompt) {
          setPrompt(enhanced);
        }
      }
    } catch (error) {
      console.error("AI Enhance error:", error);
      alert("Failed to enhance prompt with AI. Check console for details.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleExportSheets = () => {
    // Flatten the object for CSV
    const flatten = (obj: any, prefix = ''): Record<string, string> => {
      return Object.keys(obj).reduce((acc: Record<string, string>, k) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]))
          Object.assign(acc, flatten(obj[k], pre + k));
        else
          acc[pre + k] = Array.isArray(obj[k]) ? obj[k].join(', ') : String(obj[k]);
        return acc;
      }, {});
    };

    const flat = flatten(prompt.image_prompt);
    const headers = Object.keys(flat).join('\t');
    const values = Object.values(flat).join('\t');
    const csvContent = `${headers}\n${values}`;

    navigator.clipboard.writeText(csvContent);
    alert("Copied to clipboard! You can now Paste (Ctrl+V) directly into Google Sheets.");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(prompt, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'json' | 'txt') => {
    const content = format === 'json' ? JSON.stringify(prompt, null, 2) : JSON.stringify(prompt);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nano-banana-prompt.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
      const hash = encodeURIComponent(btoa(JSON.stringify(prompt)));
      window.location.hash = hash;
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
  };

  const handleReset = () => {
      if(confirm("Reset all settings to default?")) {
          setPrompt(DEFAULT_PROMPT);
          window.location.hash = '';
      }
  }

  const loadFromStorage = (p: NanoBananaPrompt) => {
      setPrompt(p);
      setShowSidebar(false);
  }

  return (
    <div className="flex flex-col h-screen bg-nano-900 text-zinc-100 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex-none bg-nano-800 border-b border-zinc-800 px-6 py-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-banana-500 rounded-lg flex items-center justify-center text-nano-900 shadow-lg shadow-banana-500/20">
                <Settings size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Nano Banana Pro</h1>
                <p className="text-xs text-zinc-400 font-medium">Precision Prompt Engineering Suite</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" icon={History} onClick={() => { setShowSidebar(!showSidebar); setSidebarTab('history'); }}>History / Library</Button>
            <Button variant="secondary" icon={RotateCcw} onClick={handleReset}>Reset</Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Column: Form Builder */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 border-r border-zinc-800 scroll-smooth">
          <div className="max-w-3xl mx-auto">
             <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-200">Prompt Parameters</h2>
                <div className="flex gap-2">
                     <Button variant="secondary" onClick={handleRandomize} icon={Shuffle} className="bg-zinc-800 text-xs py-1.5 px-3">
                        Randomize
                     </Button>
                </div>
             </div>
             <PromptForm prompt={prompt} updatePrompt={updatePrompt} updateNegativePrompt={updateNegativePrompt} />
          </div>
        </div>

        {/* Right Column: Preview & Actions */}
        <div className="w-96 flex-none bg-nano-800 p-6 border-l border-zinc-800 flex flex-col gap-6 overflow-y-auto z-0">
            
            {/* Visualizer Card */}
            <Card title="Prompt Analysis" className="bg-nano-900/50">
                <PromptRadar prompt={prompt} />
                <TokenDensity prompt={prompt} />
            </Card>

            {/* Output Preview */}
            <div className="flex-1 min-h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Code size={16} /> JSON Output
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">Nano Banana v1.2</span>
                </div>
                <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-xs text-zinc-400 overflow-auto relative group">
                    <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(prompt, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                     <Button variant="secondary" icon={Sparkles} onClick={handleAIEnhance} disabled={isEnhancing} className={isEnhancing ? "animate-pulse" : ""}>
                        {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                    </Button>
                    <Button variant="secondary" icon={Bookmark} onClick={handleSaveToLibrary}>
                        Save
                    </Button>
                </div>

                <Button variant="primary" icon={Zap} className="w-full py-3 text-lg shadow-lg shadow-banana-500/10" onClick={handleGenerate}>
                    Generate Prompt
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                     <Button variant="secondary" icon={Table} onClick={handleExportSheets} title="Copy for Google Sheets">
                        Sheets Copy
                    </Button>
                    <Button variant="secondary" icon={Share2} onClick={handleShare}>
                        Share Link
                    </Button>
                     <Button variant="ghost" icon={Copy} onClick={handleCopy}>
                        {copied ? 'Copied!' : 'Copy JSON'}
                    </Button>
                    <Button variant="ghost" icon={Download} onClick={() => handleDownload('json')}>
                        Export
                    </Button>
                </div>
            </div>

        </div>

        {/* Sidebar (History & Library) */}
        {showSidebar && (
          <div className="absolute inset-y-0 right-0 w-96 bg-nano-800 shadow-2xl border-l border-zinc-700 z-50 transform transition-transform flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-nano-900">
                  <h3 className="font-bold text-lg text-white">Manager</h3>
                  <button onClick={() => setShowSidebar(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
              
              <div className="flex border-b border-zinc-800">
                  <button 
                    className={`flex-1 py-3 text-sm font-medium ${sidebarTab === 'history' ? 'text-banana-500 border-b-2 border-banana-500 bg-zinc-800/50' : 'text-zinc-400 hover:bg-zinc-800/30'}`}
                    onClick={() => setSidebarTab('history')}
                  >
                      History
                  </button>
                  <button 
                    className={`flex-1 py-3 text-sm font-medium ${sidebarTab === 'library' ? 'text-banana-500 border-b-2 border-banana-500 bg-zinc-800/50' : 'text-zinc-400 hover:bg-zinc-800/30'}`}
                    onClick={() => setSidebarTab('library')}
                  >
                      Saved Library
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {sidebarTab === 'history' ? (
                      <>
                        {history.length === 0 && <p className="text-zinc-500 text-sm text-center py-10">No history yet.</p>}
                        {history.map((h, i) => (
                            <div key={i} onClick={() => loadFromStorage(h)} className="p-3 bg-zinc-900 rounded border border-zinc-700 cursor-pointer hover:border-banana-500 transition-colors group">
                                <div className="flex justify-between text-xs text-banana-400 mb-1">
                                    <span className="font-semibold">{h.image_prompt.subject.gender} {h.image_prompt.subject.ethnicity}</span>
                                    <span className="opacity-70">{h.image_prompt.style.art_style}</span>
                                </div>
                                <p className="text-xs text-zinc-500 line-clamp-2">
                                    {h.image_prompt.subject.clothing}, {h.image_prompt.environment.description}
                                </p>
                            </div>
                        ))}
                      </>
                  ) : (
                      <>
                        {library.length === 0 && <p className="text-zinc-500 text-sm text-center py-10">No saved prompts.</p>}
                        {library.map((h, i) => (
                            <div key={i} className="relative group">
                                <div onClick={() => loadFromStorage(h)} className="p-3 bg-zinc-900 rounded border border-zinc-700 cursor-pointer hover:border-banana-500 transition-colors">
                                    <div className="flex justify-between text-xs text-banana-400 mb-1">
                                        <span className="font-semibold">{h.image_prompt.subject.gender} {h.image_prompt.subject.ethnicity}</span>
                                        <span className="opacity-70">{h.image_prompt.style.art_style}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 line-clamp-2">
                                        {h.image_prompt.subject.clothing}, {h.image_prompt.environment.description}
                                    </p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeFromLibrary(i); }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                      </>
                  )}
              </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
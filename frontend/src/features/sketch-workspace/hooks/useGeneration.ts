import { useState } from 'react';
import { toast } from 'sonner';

export type GenerationState = 'idle' | 'processing_variants' | 'wireframe_generated' | 'variant_selected' | 'reviewing_tags' | 'selecting_palettes' | 'processing_code' | 'completed' | 'failed';

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [visionModel, setVisionModel] = useState('gemini-2.0-flash');
  const [codeModel, setCodeModel] = useState('gemini-2.0-pro');
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  
  const [variants, setVariants] = useState<{ 
    id: string, 
    label: string, 
    thumbnail: string,
    complexity: string,
    componentCount: number,
    tags: string[]
  }[]>([]);
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [tweakPrompt, setTweakPrompt] = useState('');
  const [isTweaking, setIsTweaking] = useState(false);
  
  const [componentTags, setComponentTags] = useState<{ id: string, label: string, type: string }[]>([
    { id: '1', label: 'Navigation Bar', type: 'Navbar' },
    { id: '2', label: 'Hero Section', type: 'Hero' },
    { id: '3', label: 'Feature Grid', type: 'Grid' },
    { id: '4', label: 'Footer', type: 'Footer' },
  ]);
  
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  
  // Advanced Configuration State
  const [customTheme, setCustomTheme] = useState({
    primary: '#000000',
    secondary: '#f4f4f5',
    bg: '#ffffff',
    text: '#09090b',
    border: '#e4e4e7'
  });
  
  const [customTypography, setCustomTypography] = useState({
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16
  });
  
  const [useCustomStyles, setUseCustomStyles] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = () => {
    setGenerationState('processing_variants');
    setAgentLogs(['Agent 1 (Vision): Analyzing sketch...', 'Agent 2 (Planner): Planning layout variants...']);
    toast.info('Analyzing sketch and generating variants...');
    
    setTimeout(() => {
      setVariants([
        { 
          id: '1', 
          label: 'Modern Sidebar', 
          thumbnail: 'https://picsum.photos/seed/layout1/400/250',
          complexity: 'Medium',
          componentCount: 12,
          tags: ['Navbar', 'Sidebar', 'Dashboard', 'Grid']
        },
        { 
          id: '2', 
          label: 'Minimal Hero', 
          thumbnail: 'https://picsum.photos/seed/layout2/400/250',
          complexity: 'Low',
          componentCount: 8,
          tags: ['Hero', 'CTA', 'Features']
        },
        { 
          id: '3', 
          label: 'Bento Grid', 
          thumbnail: 'https://picsum.photos/seed/layout3/400/250',
          complexity: 'High',
          componentCount: 24,
          tags: ['Grid', 'Cards', 'Interactive']
        },
      ]);
      setGenerationState('wireframe_generated');
      setGenerated(true);
      toast.success('Variants generated successfully!');
    }, 2500);
  };

  const handleCopy = () => {
    setIsCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    toast.success('Downloading React component...');
  };

  const handleTweak = () => {
    if (!tweakPrompt.trim()) return;
    setIsTweaking(true);
    setAgentLogs(prev => [...prev, `User: ${tweakPrompt}`, 'Agent 1 (Vision): Re-analyzing selected variant...', 'Agent 2 (Planner): Applying tweaks to layout...']);
    toast.info('Applying tweaks to the selected variant...');
    
    setTimeout(() => {
      setIsTweaking(false);
      setTweakPrompt('');
      toast.success('Variant tweaked successfully!');
    }, 2000);
  };

  const handleSelectVariant = (id: string) => {
    setSelectedVariantId(id);
    setGenerationState('variant_selected');
    toast.info('Variant selected. Reviewing component tags...');
  };

  const handleConfirmVariant = () => {
    setGenerationState('reviewing_tags');
  };

  const handleConfirmTags = () => {
    setGenerationState('selecting_palettes');
    toast.info('Tags confirmed. Select your preferred palette.');
  };

  const handleConfirmPalettes = () => {
    handleGenerateCode();
  };

  const handleGenerateCode = () => {
    setGenerationState('processing_code');
    setAgentLogs(prev => [...prev, 'Agent 3 (Code Gen): Generating React components...', 'Agent 4 (Validator): Validating accessibility and responsiveness...']);
    toast.info('Generating final React code...');
    
    setTimeout(() => {
      setGenerationState('completed');
      toast.success('Code generation complete!');
    }, 3000);
  };

  return {
    isGenerating, setIsGenerating,
    generated, setGenerated,
    visionModel, setVisionModel,
    codeModel, setCodeModel,
    generationState, setGenerationState,
    variants, setVariants,
    selectedVariantId, setSelectedVariantId,
    tweakPrompt, setTweakPrompt,
    isTweaking, setIsTweaking,
    componentTags, setComponentTags,
    agentLogs, setAgentLogs,
    customTheme, setCustomTheme,
    customTypography, setCustomTypography,
    useCustomStyles, setUseCustomStyles,
    isCopied, setIsCopied,
    handleGenerate,
    handleCopy,
    handleDownload,
    handleTweak,
    handleSelectVariant,
    handleConfirmVariant,
    handleConfirmTags,
    handleConfirmPalettes,
    handleGenerateCode
  };
}

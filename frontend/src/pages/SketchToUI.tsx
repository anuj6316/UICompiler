import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, Download, Trash2, Undo, Redo, ChevronLeft, ChevronRight, MousePointer2, 
  PenTool, Square, Circle as CircleIcon, Type, Image as ImageIcon, 
  Play, Code2, Smartphone, Monitor, Tablet, Palette, ChevronDown, 
  CheckCircle2, Loader2, Copy, Check, ExternalLink, History as HistoryIcon,
  Settings, HelpCircle, LogOut, User, Eye, Code, Search, Command, Sliders,
  LayoutDashboard, Layers, Menu, X, ArrowLeft, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser, getInitials } from '../contexts/UserContext';
import { Stage, Layer, Line, Rect, Circle, Text as KonvaText, Transformer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { motion, AnimatePresence } from 'motion/react';
import { env } from '../config/env';
import { useTheme } from '../contexts/ThemeContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  Tabs, TabsContent, TabsList, TabsTrigger, Progress, Badge, 
  ScrollArea, Skeleton, Collapsible, CollapsibleContent, CollapsibleTrigger,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Avatar, AvatarFallback,
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
  Input, Textarea, Toaster
} from '@/components/ui';
import { toast } from 'sonner';

type ElementType = 'pen' | 'rect' | 'circle' | 'text' | 'image';

interface CanvasElement {
  id: string;
  type: ElementType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
}

const THEMES = [
  { id: 'modern', name: 'Modern', bg: 'bg-white dark:bg-[#111113]', primary: 'bg-zinc-900 dark:bg-zinc-200', text: 'text-zinc-900 dark:text-zinc-200', secondary: 'bg-zinc-100 dark:bg-[#1e1e24]', border: 'border-zinc-200 dark:border-white/[0.1]' },
  { id: 'playful', name: 'Playful', bg: 'bg-yellow-50 dark:bg-purple-950', primary: 'bg-pink-500 dark:bg-pink-400', text: 'text-purple-900 dark:text-purple-100', secondary: 'bg-yellow-100 dark:bg-purple-900', border: 'border-yellow-200 dark:border-purple-800' },
  { id: 'corporate', name: 'Corporate', bg: 'bg-slate-50 dark:bg-slate-900', primary: 'bg-blue-700 dark:bg-blue-500', text: 'text-slate-900 dark:text-slate-100', secondary: 'bg-slate-200 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700' },
  { id: 'minimal', name: 'Minimal', bg: 'bg-[#FAFAFA] dark:bg-black', primary: 'bg-black dark:bg-white', text: 'text-black dark:text-white', secondary: 'bg-gray-100 dark:bg-zinc-900', border: 'border-gray-200 dark:border-zinc-800' },
];

const FONTS = [
  { id: 'sans', name: 'Inter (Sans)', class: 'font-sans' },
  { id: 'serif', name: 'Playfair (Serif)', class: 'font-serif' },
  { id: 'mono', name: 'JetBrains (Mono)', class: 'font-mono' },
];

const URLImage = ({ shape, isSelected, onSelect, onChange, isSelectTool }: any) => {
  const [img] = useImage(shape.src);
  const shapeRef = useRef<any>(null);

  return (
    <KonvaImage
      image={img}
      id={shape.id}
      ref={shapeRef}
      draggable={isSelectTool}
      x={shape.x || 0}
      y={shape.y || 0}
      width={shape.width}
      height={shape.height}
      scaleX={shape.scaleX || 1}
      scaleY={shape.scaleY || 1}
      rotation={shape.rotation || 0}
      onClick={isSelectTool ? onSelect : undefined}
      onTap={isSelectTool ? onSelect : undefined}
      onDragEnd={(e: any) => {
        onChange({
          ...shape,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e: any) => {
        const node = shapeRef.current;
        onChange({
          ...shape,
          x: node.x(),
          y: node.y(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          rotation: node.rotation(),
        });
      }}
    />
  );
};

const RenderElement = ({ shape, isSelected, onSelect, onChange, isSelectTool }: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const commonProps = {
    id: shape.id,
    ref: shapeRef,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    draggable: isSelectTool,
    x: shape.x || 0,
    y: shape.y || 0,
    scaleX: shape.scaleX || 1,
    scaleY: shape.scaleY || 1,
    rotation: shape.rotation || 0,
    onClick: isSelectTool ? (e: any) => onSelect() : undefined,
    onTap: isSelectTool ? (e: any) => onSelect() : undefined,
    onDragEnd: (e: any) => {
      onChange({
        ...shape,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e: any) => {
      const node = shapeRef.current;
      onChange({
        ...shape,
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      });
    }
  };

  return (
    <React.Fragment>
      {shape.type === 'pen' && (
        <Line
          {...commonProps}
          points={shape.points}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          hitStrokeWidth={10}
        />
      )}
      {shape.type === 'rect' && (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          fill={shape.fill}
        />
      )}
      {shape.type === 'circle' && (
        <Circle
          {...commonProps}
          radius={shape.radius}
          fill={shape.fill}
        />
      )}
      {shape.type === 'text' && (
        <KonvaText
          {...commonProps}
          text={shape.text}
          fontSize={shape.fontSize}
          fontFamily={shape.fontFamily}
          fill={shape.stroke}
        />
      )}
      {shape.type === 'image' && (
        <URLImage
          shape={shape}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          isSelectTool={isSelectTool}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

type GenerationState = 'idle' | 'processing_variants' | 'wireframe_generated' | 'variant_selected' | 'reviewing_tags' | 'selecting_palettes' | 'processing_code' | 'completed' | 'failed';

export default function SketchToUI() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  
  // Sidebar & project state
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isEditingName, setIsEditingName] = useState(false);
  const projectNameRef = useRef<HTMLInputElement>(null);
  
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'select' | 'rect' | 'circle' | 'text'>('pen');
  const [fillColor, setFillColor] = useState<string>('transparent');
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          setElements(elements.filter(el => el.id !== selectedId));
          setSelectedId(null);
        }
      }
      if (e.key === 'v') setTool('select');
      if (e.key === 'p') setTool('pen');
      if (e.key === 'r') setTool('rect');
      if (e.key === 'o') setTool('circle');
      if (e.key === 't') setTool('text');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyStep, history, selectedId, elements]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [theme, setTheme] = useState(THEMES[0]);
  const [font, setFont] = useState(FONTS[0]);
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

  const activeStyles = {
    bg: useCustomStyles ? { backgroundColor: customTheme.bg } : {},
    primary: useCustomStyles ? { backgroundColor: customTheme.primary } : {},
    secondary: useCustomStyles ? { backgroundColor: customTheme.secondary } : {},
    text: useCustomStyles ? { color: customTheme.text } : {},
    border: useCustomStyles ? { borderColor: customTheme.border } : {},
    headingFont: useCustomStyles ? { fontFamily: customTypography.headingFont } : {},
    bodyFont: useCustomStyles ? { fontFamily: customTypography.bodyFont, fontSize: `${customTypography.baseSize}px` } : {}
  };

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [generated]); // Re-check size when generated state changes (split screen)

  const handleMouseDown = (e: any) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    const id = Date.now().toString();
    const isDark = document.documentElement.classList.contains('dark');
    const stroke = isDark ? '#ffffff' : '#000000';

    setIsDrawing(true);
    setSelectedId(null);

    if (tool === 'pen') {
      setElements([...elements, { id, type: 'pen', points: [pos.x, pos.y], stroke, strokeWidth: 3 }]);
    } else if (tool === 'rect') {
      setElements([...elements, { id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, stroke, strokeWidth: 3, fill: fillColor }]);
    } else if (tool === 'circle') {
      setElements([...elements, { id, type: 'circle', x: pos.x, y: pos.y, radius: 0, stroke, strokeWidth: 3, fill: fillColor }]);
    } else if (tool === 'text') {
      const text = prompt('Enter text:') || 'Text';
      setElements([...elements, { id, type: 'text', x: pos.x, y: pos.y, text, fontSize, fontFamily, stroke, strokeWidth: 1 }]);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    let lastElement = { ...elements[elements.length - 1] };

    if (tool === 'pen') {
      lastElement.points = lastElement.points!.concat([point.x, point.y]);
    } else if (tool === 'rect') {
      lastElement.width = point.x - lastElement.x!;
      lastElement.height = point.y - lastElement.y!;
    } else if (tool === 'circle') {
      const dx = point.x - lastElement.x!;
      const dy = point.y - lastElement.y!;
      lastElement.radius = Math.sqrt(dx * dx + dy * dy);
    }

    const newElements = [...elements];
    newElements[elements.length - 1] = lastElement;
    setElements(newElements);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // Save to history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const id = Date.now().toString();
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const newElement: CanvasElement = { 
            id, 
            type: 'image',
            x: 50, 
            y: 50, 
            width: img.width / 4, 
            height: img.height / 4, 
            stroke: 'transparent', 
            strokeWidth: 0,
            src: img.src
          };
          const newElements = [...elements, newElement];
          setElements(newElements);
          
          // Save to history
          const newHistory = history.slice(0, historyStep + 1);
          newHistory.push(newElements);
          setHistory(newHistory);
          setHistoryStep(newHistory.length - 1);
          
          toast.success('Image uploaded successfully');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedId(null);
    setGenerated(false);
    setHistory([[]]);
    setHistoryStep(0);
  };

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

  const [isCopied, setIsCopied] = useState(false);

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
      // In a real app, we'd update the variant here
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

  return (
    <DashboardLayout
      header={({ setIsMobileMenuOpen }) => (
        <header className="h-16 border-b border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#111113]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-white/[0.08] rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 shadow-sm dark:shadow-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Back button */}
          <button 
            onClick={() => navigate('/')}
            className="hidden lg:flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-zinc-200 dark:bg-white/[0.08] hidden lg:block" />
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-none text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">Draft</Badge>
            {isEditingName ? (
              <input
                ref={projectNameRef}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
                className="text-xs font-semibold bg-transparent border border-zinc-300 dark:border-white/[0.1] px-2 py-1 rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 w-40"
                autoFocus
              />
            ) : (
              <span 
                className="text-xs text-zinc-500 font-semibold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                onClick={() => { setIsEditingName(true); setTimeout(() => projectNameRef.current?.select(), 0); }}
                title="Click to edit project name"
              >
                {projectName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Style & Font Selectors */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-[#1e1e24] p-1 rounded-none">
            <Select value={theme.id} onValueChange={(val) => setTheme(THEMES.find(t => t.id === val) || THEMES[0])}>
              <SelectTrigger className="h-8 w-[100px] rounded-none text-[10px] font-bold uppercase tracking-wider bg-transparent border-none hover:bg-white dark:hover:bg-white/[0.1] transition-all">
                <Palette className="w-3 h-3 mr-2" />
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-200 dark:border-white/[0.08]">
                {THEMES.map(t => (
                  <SelectItem key={t.id} value={t.id} className="text-xs rounded-none">{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={font.id} onValueChange={(val) => setFont(FONTS.find(f => f.id === val) || FONTS[0])}>
              <SelectTrigger className="h-8 w-[100px] rounded-none text-[10px] font-bold uppercase tracking-wider bg-transparent border-none hover:bg-white dark:hover:bg-white/[0.1] transition-all">
                <Type className="w-3 h-3 mr-2" />
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-zinc-200 dark:border-white/[0.08]">
                {FONTS.map(f => (
                  <SelectItem key={f.id} value={f.id} className="text-xs rounded-none">{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-6 w-px bg-zinc-200 dark:bg-[#222228] mx-1" />

          {generated && (
            <div className="flex items-center bg-zinc-100 dark:bg-[#1e1e24] p-1 rounded-none">
              <button 
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded-none transition-all duration-300 ${deviceMode === 'desktop' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDeviceMode('tablet')}
                className={`p-2 rounded-none transition-all duration-300 ${deviceMode === 'tablet' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded-none transition-all duration-300 ${deviceMode === 'mobile' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <Button 
            onClick={handleGenerate}
            disabled={generationState !== 'idle' || elements.length === 0}
            className="rounded-none h-10 px-6 font-bold uppercase tracking-wider text-xs shadow-lg shadow-zinc-200 dark:shadow-none transition-all active:scale-95"
          >
            {generationState === 'processing_variants' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            {generationState === 'processing_variants' ? 'Generating...' : 'Generate UI'}
          </Button>

          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-none hover:bg-zinc-100 dark:hover:bg-white/[0.05]">
                    <Sliders className="w-5 h-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-96 p-0 border-l border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#111113]">
                <SheetHeader className="p-6 border-b border-zinc-200 dark:border-white/[0.08]">
                  <SheetTitle className="text-sm font-bold uppercase tracking-widest">Advanced Configuration</SheetTitle>
                  <SheetDescription className="text-xs">Customize your project's global styles and typography.</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)]">
                  <div className="p-8 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Custom Theme</h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`h-7 text-[9px] rounded-none px-3 font-bold uppercase tracking-wider transition-all ${useCustomStyles ? 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900' : ''}`}
                          onClick={() => setUseCustomStyles(!useCustomStyles)}
                        >
                          {useCustomStyles ? 'Active' : 'Enable'}
                        </Button>
                      </div>
                      
                      <div className={`space-y-6 transition-all duration-500 ${useCustomStyles ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        {[
                          { label: 'Primary', key: 'primary' },
                          { label: 'Secondary', key: 'secondary' },
                          { label: 'Background', key: 'bg' },
                          { label: 'Text', key: 'text' }
                        ].map((item) => (
                          <div key={item.key} className="space-y-3">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{item.label} Color</label>
                            <div className="flex gap-3">
                              <div className="relative w-12 h-10 rounded-none overflow-hidden border border-zinc-200 dark:border-white/[0.1]">
                                <Input 
                                  type="color" 
                                  value={customTheme[item.key as keyof typeof customTheme]} 
                                  onChange={(e) => setCustomTheme({...customTheme, [item.key]: e.target.value})}
                                  className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer border-none p-0"
                                />
                              </div>
                              <Input 
                                type="text" 
                                value={customTheme[item.key as keyof typeof customTheme]} 
                                onChange={(e) => setCustomTheme({...customTheme, [item.key]: e.target.value})}
                                className="flex-1 h-10 text-xs rounded-none border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#1a1a1f] font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Typography</h4>
                      <div className={`space-y-6 transition-all duration-500 ${useCustomStyles ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        <div className="space-y-3">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Heading Font Family</label>
                          <Input 
                            type="text" 
                            value={customTypography.headingFont} 
                            onChange={(e) => setCustomTypography({...customTypography, headingFont: e.target.value})}
                            placeholder="e.g. Playfair Display, Inter"
                            className="h-10 text-xs rounded-none border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#1a1a1f]"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Body Font Family</label>
                          <Input 
                            type="text" 
                            value={customTypography.bodyFont} 
                            onChange={(e) => setCustomTypography({...customTypography, bodyFont: e.target.value})}
                            placeholder="e.g. Inter, Roboto"
                            className="h-10 text-xs rounded-none border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#1a1a1f]"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Base Font Size (px)</label>
                          <Input 
                            type="number" 
                            value={customTypography.baseSize} 
                            onChange={(e) => setCustomTypography({...customTypography, baseSize: parseInt(e.target.value)})}
                            className="h-10 text-xs rounded-none border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#1a1a1f]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        className="w-full rounded-none h-12 text-xs font-bold uppercase tracking-widest shadow-xl shadow-zinc-200 dark:shadow-none transition-all active:scale-95"
                        onClick={() => {
                          toast.success('Advanced configuration applied!');
                          setUseCustomStyles(true);
                        }}
                      >
                        Apply Configuration
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )}
  >
    <div className="flex-1 flex flex-col w-full h-full relative">
      <Toaster position="top-center" />
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="rounded-none border-none">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            <CommandItem onSelect={() => { setTool('select'); setIsCommandOpen(false); }}>
              <MousePointer2 className="mr-2 h-4 w-4" />
              <span>Select Tool</span>
              <kbd className="ml-auto text-xs">V</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('pen'); setIsCommandOpen(false); }}>
              <PenTool className="mr-2 h-4 w-4" />
              <span>Pen Tool</span>
              <kbd className="ml-auto text-xs">P</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('rect'); setIsCommandOpen(false); }}>
              <Square className="mr-2 h-4 w-4" />
              <span>Rectangle Tool</span>
              <kbd className="ml-auto text-xs">R</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('circle'); setIsCommandOpen(false); }}>
              <CircleIcon className="mr-2 h-4 w-4" />
              <span>Circle Tool</span>
              <kbd className="ml-auto text-xs">O</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('text'); setIsCommandOpen(false); }}>
              <Type className="mr-2 h-4 w-4" />
              <span>Text Tool</span>
              <kbd className="ml-auto text-xs">T</kbd>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { handleGenerate(); setIsCommandOpen(false); }}>
              <Play className="mr-2 h-4 w-4" />
              <span>Generate UI</span>
            </CommandItem>
            <CommandItem onSelect={() => { clearCanvas(); setIsCommandOpen(false); }}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Clear Canvas</span>
            </CommandItem>
            <CommandItem onSelect={() => { undo(); setIsCommandOpen(false); }}>
              <Undo className="mr-2 h-4 w-4" />
              <span>Undo</span>
              <kbd className="ml-auto text-xs">⌘Z</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { redo(); setIsCommandOpen(false); }}>
              <Redo className="mr-2 h-4 w-4" />
              <span>Redo</span>
              <kbd className="ml-auto text-xs">⌘⇧Z</kbd>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Canvas */}
        <div className={`flex flex-col border-r border-zinc-200 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#111113] transition-all duration-500 relative ${generated ? 'w-1/2' : 'w-full'}`}>
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />
          
          {/* Canvas Area */}
          <div ref={containerRef} className="flex-1 relative bg-zinc-50 dark:bg-[#111113] overflow-hidden cursor-crosshair">
            {/* Floating Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-none border border-zinc-200 dark:border-white/[0.08] shadow-lg">
              <div className="flex items-center gap-1">
                <ToolButton icon={MousePointer2} active={tool === 'select'} onClick={() => setTool('select')} tooltip="Select (V)" />
                <ToolButton icon={PenTool} active={tool === 'pen'} onClick={() => setTool('pen')} tooltip="Draw (P)" />
                <ToolButton icon={Square} active={tool === 'rect'} onClick={() => setTool('rect')} tooltip="Rectangle (R)" />
                <ToolButton icon={CircleIcon} active={tool === 'circle'} onClick={() => setTool('circle')} tooltip="Circle (O)" />
                <ToolButton icon={Type} active={tool === 'text'} onClick={() => setTool('text')} tooltip="Text (T)" />
                <div className="relative">
                  <ToolButton icon={ImageIcon} active={false} onClick={() => document.getElementById('image-upload')?.click()} tooltip="Image (I)" />
                  <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="w-px h-6 bg-zinc-200 dark:bg-[#222228] mx-1" />

              <div className="flex items-center gap-2">
                {(tool === 'text' || (selectedId && elements.find(el => el.id === selectedId)?.type === 'text')) && (
                  <div className="flex items-center gap-1.5 px-2 border-r border-zinc-200 dark:border-white/[0.1]">
                    <select 
                      value={fontSize}
                      onChange={(e) => {
                        const size = parseInt(e.target.value);
                        setFontSize(size);
                        if (selectedId) {
                          setElements(elements.map(el => el.id === selectedId ? { ...el, fontSize: size } : el));
                        }
                      }}
                      className="text-[10px] font-bold bg-transparent border border-zinc-200 dark:border-white/[0.1] rounded-none px-2 h-8 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    >
                      {[12, 14, 16, 18, 20, 24, 32, 48].map(s => <option key={s} value={s} className="bg-white dark:bg-zinc-900">{s}px</option>)}
                    </select>
                    <select 
                      value={fontFamily}
                      onChange={(e) => {
                        const family = e.target.value;
                        setFontFamily(family);
                        if (selectedId) {
                          setElements(elements.map(el => el.id === selectedId ? { ...el, fontFamily: family } : el));
                        }
                      }}
                      className="text-[10px] font-bold bg-transparent border border-zinc-200 dark:border-white/[0.1] rounded-none px-2 h-8 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                    >
                      <option value="sans-serif" className="bg-white dark:bg-zinc-900">Sans</option>
                      <option value="serif" className="bg-white dark:bg-zinc-900">Serif</option>
                      <option value="monospace" className="bg-white dark:bg-zinc-900">Mono</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-2 px-2">
                  <input 
                    type="color" 
                    value={fillColor === 'transparent' ? '#ffffff' : fillColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setFillColor(newColor);
                      if (selectedId) {
                        setElements(elements.map(el => 
                          el.id === selectedId && (el.type === 'rect' || el.type === 'circle') 
                            ? { ...el, fill: newColor } 
                            : el
                        ));
                      }
                    }}
                    className="w-6 h-6 rounded-none cursor-pointer border-0 p-0 bg-transparent overflow-hidden shadow-sm"
                    title="Fill Color"
                  />
                  <button 
                    onClick={() => {
                      setFillColor('transparent');
                      if (selectedId) {
                        setElements(elements.map(el => 
                          el.id === selectedId && (el.type === 'rect' || el.type === 'circle') 
                            ? { ...el, fill: 'transparent' } 
                            : el
                        ));
                      }
                    }}
                    className={`w-6 h-6 rounded-none border flex items-center justify-center transition-all ${fillColor === 'transparent' ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-zinc-200' : 'border-zinc-200 dark:border-white/[0.1] hover:bg-zinc-100 dark:hover:bg-white/[0.05]'}`}
                    title="Transparent Fill"
                  >
                    <div className="w-full h-full relative overflow-hidden rounded-none">
                      <div className={`absolute inset-0 ${fillColor === 'transparent' ? 'bg-zinc-900 dark:bg-zinc-200' : 'bg-white dark:bg-zinc-900'}`} />
                      <div className="absolute top-0 left-0 w-full h-full border-t border-red-500 transform rotate-45 origin-top-left" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="w-px h-6 bg-zinc-200 dark:bg-[#222228] mx-1" />

              <div className="flex items-center gap-1">
                <ToolButton icon={Undo} active={false} onClick={undo} tooltip="Undo (Ctrl+Z)" />
                <ToolButton icon={Redo} active={false} onClick={redo} tooltip="Redo (Ctrl+Y)" />
                <div className="w-px h-4 bg-zinc-200 dark:bg-[#222228] mx-1" />
                <ToolButton icon={Trash2} active={false} onClick={clearCanvas} tooltip="Clear Canvas" />
              </div>
            </div>
            {/* Dot Grid Background */}
            <div 
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />
            <div 
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none hidden dark:block"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />
            
            {stageSize.width > 0 && (
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                className="absolute inset-0 z-10"
              >
                <Layer>
                  {elements.map((el, i) => (
                    <RenderElement
                      key={el.id}
                      shape={el}
                      isSelected={el.id === selectedId}
                      isSelectTool={tool === 'select'}
                      onSelect={() => {
                        if (tool === 'select') {
                          setSelectedId(el.id);
                        }
                      }}
                      onChange={(newAttrs: any) => {
                        const newElements = elements.slice();
                        newElements[i] = newAttrs;
                        setElements(newElements);
                      }}
                    />
                  ))}
                </Layer>
              </Stage>
            )}

            {elements.length === 0 && !isDrawing && !generated && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
              >
                <div className="text-center max-w-xs">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-zinc-100 dark:bg-[#1e1e24] rounded-none rotate-6" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PenTool className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Start Sketching</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Draw your ideas directly on the canvas. Use the floating toolbar above to select shapes and tools.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-[#1e1e24] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">P</kbd> Pen</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-[#1e1e24] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">R</kbd> Rect</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-[#1e1e24] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">T</kbd> Text</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Panel: Result */}
        <div className={`flex flex-col bg-zinc-50 dark:bg-[#111113] border-l border-zinc-200 dark:border-white/[0.08] transition-all duration-700 ease-in-out relative ${generated ? 'w-1/2' : 'w-0 overflow-hidden'}`}>
          <AnimatePresence mode="wait">
            {generationState === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-white dark:bg-[#1a1a1f] rounded-none flex items-center justify-center mb-8 shadow-lg shadow-zinc-200 dark:shadow-none border border-zinc-100 dark:border-white/[0.08]">
                  <Wand2 className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Ready to Generate</h3>
                <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                  Sketch your interface on the left and click <span className="text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-[10px] bg-zinc-100 dark:bg-[#1e1e24] px-2 py-1 rounded-none mx-1">Generate UI</span> to see layout variants.
                </p>
              </motion.div>
            )}

            {(generationState === 'processing_variants' || generationState === 'processing_code') && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col p-10"
              >
                <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-zinc-400">{generationState === 'processing_variants' ? 'Generating Variants' : 'Generating Code'}</span>
                      <span className="text-zinc-900 dark:text-white">Processing...</span>
                    </div>
                    <Progress value={45} className="h-1.5 rounded-none bg-zinc-100 dark:bg-[#1e1e24]" />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="rounded-none border-dashed border-zinc-200 dark:border-white/[0.1] bg-transparent overflow-hidden">
                        <CardContent className="p-0 aspect-[16/10] flex items-center justify-center">
                          <Skeleton className="w-full h-full rounded-none" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Collapsible defaultOpen className="mt-10 border border-zinc-200 dark:border-white/[0.08] rounded-none p-6 bg-white dark:bg-[#1a1a1f] shadow-xl shadow-zinc-200/50 dark:shadow-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-none bg-green-500 animate-pulse" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Agent Activity Log</h4>
                    </div>
                    <CollapsibleTrigger
                      render={
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                  <CollapsibleContent className="mt-6 space-y-3">
                    {agentLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 text-[11px] font-medium font-mono">
                        <span className="text-zinc-300 dark:text-zinc-700 mt-0.5">0{i+1}</span>
                        <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{log}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 text-[11px] font-bold font-mono text-zinc-900 dark:text-white pt-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="uppercase tracking-wider">Processing next step...</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            )}

            {(generationState === 'wireframe_generated' || generationState === 'variant_selected') && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-10 overflow-auto scrollbar-hide"
              >
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Select a Layout Variant</h3>
                  <p className="text-sm text-zinc-500 font-medium">Choose the wireframe that best matches your vision.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 mb-10">
                  {variants.map(variant => (
                    <Card 
                      key={variant.id}
                      onClick={() => handleSelectVariant(variant.id)}
                      className={`cursor-pointer transition-all duration-500 overflow-hidden group relative rounded-none border-2 ${
                        selectedVariantId === variant.id 
                          ? 'border-zinc-900 dark:border-white shadow-lg shadow-zinc-300 dark:shadow-none scale-[1.02]' 
                          : 'border-transparent bg-white dark:bg-[#1a1a1f] hover:scale-[1.01] hover:shadow-xl'
                      }`}
                    >
                      <div className="aspect-[16/10] bg-zinc-100 dark:bg-[#1e1e24] relative overflow-hidden">
                        <img 
                          src={variant.thumbnail} 
                          alt={variant.label}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Wireframe Tags Overlay */}
                        <div className="absolute inset-0 pointer-events-none p-6">
                          {variant.tags.map((tag, idx) => (
                            <div 
                              key={idx}
                              className="absolute bg-white/90 dark:bg-black/90 text-zinc-900 dark:text-white text-[9px] px-2 py-1 font-bold uppercase tracking-widest rounded-none shadow-xl backdrop-blur-md border border-white/20 dark:border-white/10"
                              style={{
                                top: `${20 + idx * 18}%`,
                                left: `${10 + (idx % 2) * 45}%`,
                              }}
                            >
                              {tag}
                            </div>
                          ))}
                        </div>

                        {selectedVariantId === variant.id && (
                          <div className="absolute top-6 right-6 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 w-10 h-10 rounded-none flex items-center justify-center z-10 shadow-lg animate-in zoom-in duration-300">
                            <Check className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg font-bold tracking-tight">{variant.label}</CardTitle>
                          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-none">
                            {variant.complexity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {variant.componentCount} Components
                          </span>
                          <div className="flex gap-2">
                            {variant.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {/* Agent Tweak Input */}
                {selectedVariantId && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-8 rounded-none border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1a1f] shadow-lg shadow-zinc-200 dark:shadow-none"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-none bg-zinc-900 dark:bg-zinc-200 flex items-center justify-center shadow-lg">
                        <Wand2 className="w-5 h-5 text-white dark:text-black" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold uppercase tracking-widest">Tweak with AI Agent</h4>
                        <span className="text-[10px] text-zinc-500 font-medium">Refine your selected wireframe</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="e.g. 'Make the hero section larger' or 'Add a pricing table below features'..."
                        value={tweakPrompt}
                        onChange={(e) => setTweakPrompt(e.target.value)}
                        className="min-h-[100px] text-sm rounded-none border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-transparent resize-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white p-4"
                      />
                      <Button 
                        onClick={handleTweak}
                        disabled={!tweakPrompt.trim() || isTweaking}
                        className="w-full h-12 text-xs font-bold uppercase tracking-widest rounded-none shadow-lg transition-all active:scale-95"
                      >
                        {isTweaking ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2 fill-current" />
                        )}
                        Apply Tweak
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="mt-auto pt-10 sticky bottom-0 bg-zinc-50/80 dark:bg-[#111113]/80 backdrop-blur-md">
                  <Button 
                    onClick={handleConfirmVariant}
                    disabled={!selectedVariantId || isTweaking}
                    className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-widest shadow-lg shadow-zinc-300 dark:shadow-none"
                  >
                    Confirm Selection
                  </Button>
                </div>
              </motion.div>
            )}

            {generationState === 'reviewing_tags' && (
              <motion.div 
                key="tags"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-10 overflow-auto"
              >
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Review Component Tags</h3>
                  <p className="text-sm text-zinc-500 font-medium">Verify the detected components before code generation.</p>
                </div>

                <div className="space-y-4 mb-10">
                  {componentTags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between p-5 rounded-none border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1a1f] shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-[#1e1e24] rounded-none flex items-center justify-center text-xs font-bold group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-300 dark:group-hover:text-zinc-900 transition-colors">
                          {tag.id}
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight">{tag.label}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{tag.type}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-none px-3 py-1 font-bold uppercase tracking-widest text-[9px]">Detected</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-10">
                  <Button 
                    onClick={handleConfirmTags}
                    className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-widest shadow-lg shadow-zinc-300 dark:shadow-none"
                  >
                    Confirm Components
                  </Button>
                </div>
              </motion.div>
            )}

            {generationState === 'selecting_palettes' && (
              <motion.div 
                key="palettes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-10 overflow-auto"
              >
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Global Styles</h3>
                  <p className="text-sm text-zinc-500 font-medium">Choose the visual aesthetic for your project.</p>
                </div>

                <div className="space-y-12 mb-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Color Palette</h4>
                    <div className="grid grid-cols-2 gap-6">
                      {THEMES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t)}
                          className={`p-6 rounded-none border-2 text-left transition-all duration-500 ${
                            theme.id === t.id 
                              ? 'border-zinc-900 dark:border-white bg-white dark:bg-[#1e1e24] shadow-lg scale-[1.05]' 
                              : 'border-zinc-200 dark:border-white/[0.08] bg-transparent hover:border-zinc-400'
                          }`}
                        >
                          <p className="text-sm font-bold mb-4 tracking-tight">{t.name}</p>
                          <div className="flex gap-2">
                            <div className={`w-8 h-8 rounded-none ${t.primary} border border-black/10 shadow-sm`} />
                            <div className={`w-8 h-8 rounded-none ${t.secondary} border border-black/10 shadow-sm`} />
                            <div className={`w-8 h-8 rounded-none ${t.bg} border border-black/10 shadow-sm`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Typography</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {FONTS.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFont(f)}
                          className={`p-6 rounded-none border-2 text-left transition-all duration-500 ${
                            font.id === f.id 
                              ? 'border-zinc-900 dark:border-white bg-white dark:bg-[#1e1e24] shadow-lg scale-[1.02]' 
                              : 'border-zinc-200 dark:border-white/[0.08] bg-transparent hover:border-zinc-400'
                          }`}
                        >
                          <p className={`text-2xl ${f.class} tracking-tight`}>{f.name}</p>
                          <p className="text-[11px] text-zinc-500 mt-2 font-medium">The quick brown fox jumps over the lazy dog</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  <Button 
                    onClick={handleConfirmPalettes}
                    className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-widest shadow-lg shadow-zinc-300 dark:shadow-none"
                  >
                    Generate Final Code
                  </Button>
                </div>
              </motion.div>
            )}

            {generationState === 'completed' && (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Result Toolbar */}
                <div className="h-16 border-b border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#111113]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-zinc-100 dark:bg-[#1e1e24] p-1 rounded-none">
                      <button 
                        onClick={() => setViewMode('preview')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all duration-300 flex items-center gap-2 ${viewMode === 'preview' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                      >
                        <Monitor className="w-4 h-4" /> Preview
                      </button>
                      <button 
                        onClick={() => setViewMode('code')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all duration-300 flex items-center gap-2 ${viewMode === 'code' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                      >
                        <Code2 className="w-4 h-4" /> React Code
                      </button>
                    </div>

                    {viewMode === 'preview' && (
                      <div className="flex items-center bg-zinc-100 dark:bg-[#1e1e24] p-1 rounded-none ml-2">
                        <button 
                          onClick={() => setDeviceMode('desktop')}
                          className={`p-2 rounded-none transition-all ${deviceMode === 'desktop' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                        >
                          <Monitor className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeviceMode('tablet')}
                          className={`p-2 rounded-none transition-all ${deviceMode === 'tablet' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                        >
                          <Tablet className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeviceMode('mobile')}
                          className={`p-2 rounded-none transition-all ${deviceMode === 'mobile' ? 'bg-white dark:bg-[#222228] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
        
                  <div className="flex items-center gap-3">
                    {viewMode === 'preview' ? (
                      <div className="flex items-center gap-3 border-r border-zinc-200 dark:border-white/[0.1] pr-4 mr-1">
                        <div className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-zinc-500" />
                          <select 
                            value={theme.id}
                            onChange={(e) => setTheme(THEMES.find(t => t.id === e.target.value) || THEMES[0])}
                            className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-none text-zinc-700 dark:text-zinc-300 focus:ring-0 cursor-pointer p-0 pr-4"
                          >
                            {THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5 text-zinc-500" />
                          <select 
                            value={font.id}
                            onChange={(e) => setFont(FONTS.find(f => f.id === e.target.value) || FONTS[0])}
                            className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-none text-zinc-700 dark:text-zinc-300 focus:ring-0 cursor-pointer p-0 pr-4"
                          >
                            {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mr-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCopy}
                          className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-none border-zinc-200 dark:border-white/[0.1]"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                          {isCopied ? 'Copied' : 'Copy Code'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownload}
                          className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-none border-zinc-200 dark:border-white/[0.1]"
                        >
                          <Download className="w-3.5 h-3.5 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-none shadow-lg"
                      onClick={() => setGenerationState('idle')}
                    >
                      <HistoryIcon className="w-3.5 h-3.5 mr-2" />
                      New Design
                    </Button>
                  </div>
                </div>

                {/* Result Content */}
                <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-[#111113] p-8 flex items-center justify-center relative">
                  {viewMode === 'preview' ? (
                    <motion.div 
                      layout
                      className={`bg-white dark:bg-[#111113] border border-zinc-200 dark:border-white/[0.1] shadow-lg dark:shadow-none transition-all duration-500 overflow-hidden relative ${
                        deviceMode === 'desktop' ? 'w-full max-w-5xl aspect-[16/10] rounded-none' : 
                        deviceMode === 'tablet' ? 'w-[768px] aspect-[3/4] rounded-none' : 
                        'w-[375px] aspect-[9/19] rounded-none border-8 border-zinc-900 dark:border-zinc-800'
                      }`}
                    >
                      {deviceMode === 'mobile' && (
                        <>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 dark:bg-zinc-800 rounded-none z-30" />
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-none bg-zinc-700 z-30 ml-8" />
                        </>
                      )}

                      {/* Mock Generated UI */}
                      <div 
                        className={`h-full w-full flex flex-col overflow-auto scrollbar-hide ${!useCustomStyles ? theme.bg : ''} ${!useCustomStyles ? font.class : ''} transition-colors duration-300`}
                        style={{ ...activeStyles.bg, ...activeStyles.bodyFont }}
                      >
                        <header 
                          className={`h-16 border-b ${!useCustomStyles ? theme.border : ''} flex items-center justify-between px-8 transition-colors duration-300 sticky top-0 bg-inherit z-10`}
                          style={activeStyles.border}
                        >
                          <div 
                            className={`w-24 h-6 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                            style={activeStyles.secondary}
                          />
                          <div className="flex gap-6">
                            <div 
                              className={`w-16 h-3 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                              style={activeStyles.secondary}
                            />
                            <div 
                              className={`w-16 h-3 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                              style={activeStyles.secondary}
                            />
                          </div>
                        </header>
                        <div className="flex-1 p-10 space-y-12">
                          <div className="space-y-6 max-w-2xl">
                            <div 
                              className={`w-3/4 h-12 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                              style={activeStyles.secondary}
                            />
                            <div className="space-y-3">
                              <div 
                                className={`w-full h-4 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                                style={activeStyles.secondary}
                              />
                              <div 
                                className={`w-5/6 h-4 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                                style={activeStyles.secondary}
                              />
                            </div>
                            <div 
                              className={`w-40 h-12 ${!useCustomStyles ? theme.primary : ''} rounded-none animate-pulse mt-8`} 
                              style={activeStyles.primary}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="space-y-4">
                                <div 
                                  className={`aspect-video ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                                  style={activeStyles.secondary}
                                />
                                <div 
                                  className={`w-3/4 h-4 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse`} 
                                  style={activeStyles.secondary}
                                />
                                <div 
                                  className={`w-1/2 h-3 ${!useCustomStyles ? theme.secondary : ''} rounded-none animate-pulse opacity-50`} 
                                  style={activeStyles.secondary}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-5xl h-full bg-[#0D0D0D] rounded-none border border-white/[0.05] shadow-lg overflow-hidden flex flex-col"
                    >
                      <div className="h-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-none bg-red-500/20 border border-red-500/40" />
                          <div className="w-3 h-3 rounded-none bg-amber-500/20 border border-amber-500/40" />
                          <div className="w-3 h-3 rounded-none bg-emerald-500/20 border border-emerald-500/40" />
                        </div>
                        <div className="flex-1 text-center">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">GeneratedComponent.tsx</span>
                        </div>
                      </div>
                      <div className="flex-1 p-8 font-mono text-sm overflow-auto scrollbar-hide text-zinc-400">
                        <pre className="leading-relaxed">
                          <code>{`import React from 'react';

export default function GeneratedComponent() {
  return (
    <div 
      className="min-h-screen ${!useCustomStyles ? theme.bg.split(' ')[0] : ''}" 
      style={${useCustomStyles ? JSON.stringify({ backgroundColor: customTheme.bg, fontFamily: customTypography.bodyFont, fontSize: `${customTypography.baseSize}px` }) : '{}'}}
    >
      <header 
        className="flex items-center justify-between px-6 py-4 border-b ${!useCustomStyles ? theme.border.split(' ')[0] : ''}"
        style={${useCustomStyles ? JSON.stringify({ borderColor: customTheme.border }) : '{}'}}
      >
        <div 
          className="font-bold text-xl ${!useCustomStyles ? theme.text.split(' ')[0] : ''}"
          style={${useCustomStyles ? JSON.stringify({ color: customTheme.text, fontFamily: customTypography.headingFont }) : '{}'}}
        >
          Logo
        </div>
        <nav className="flex gap-6">
          <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Features</a>
          <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Pricing</a>
        </nav>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-24">
        <h1 
          className="text-6xl font-bold tracking-tight mb-8 ${!useCustomStyles ? theme.text.split(' ')[0] : ''}"
          style={${useCustomStyles ? JSON.stringify({ color: customTheme.text, fontFamily: customTypography.headingFont }) : '{}'}}
        >
          Build faster than ever.
        </h1>
        <p className="text-xl mb-12 max-w-2xl opacity-70 leading-relaxed">
          The new standard for modern web development. Experience the future of UI design today.
        </p>
        <button 
          className="${!useCustomStyles ? theme.primary.split(' ')[0] : ''} text-white px-8 py-4 font-bold rounded-none shadow-xl hover:scale-105 transition-transform"
          style={${useCustomStyles ? JSON.stringify({ backgroundColor: customTheme.primary }) : '{}'}}
        >
          Get Started
        </button>
        
        <div className="grid grid-cols-3 gap-12 mt-32">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div 
                className="aspect-video ${!useCustomStyles ? theme.secondary.split(' ')[0] : ''} rounded-none" 
                style={${useCustomStyles ? JSON.stringify({ backgroundColor: customTheme.secondary }) : '{}'}}
              />
              <div className="h-4 w-3/4 bg-white/10 rounded-none" />
              <div className="h-3 w-1/2 bg-white/5 rounded-none" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}`}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}

function ToolButton({ icon: Icon, active, onClick, tooltip }: { icon: any, active: boolean, onClick: () => void, tooltip: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={onClick}
      title={tooltip}
      className={`p-2.5 rounded-none transition-all duration-300 relative group ${
        active 
          ? 'bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-xl shadow-zinc-400/20 dark:shadow-none' 
          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-zinc-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {active && (
        <motion.div 
          layoutId="activeTool"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-none bg-current"
        />
      )}
    </motion.button>
  );
}

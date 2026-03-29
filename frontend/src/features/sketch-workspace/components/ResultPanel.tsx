import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wand2, ChevronDown, Loader2, Check, Play, CheckCircle2, 
  ListChecks, RefreshCcw, Code2, Palette, Search, LayoutGrid, 
  Settings2, Type, Wand, Smartphone, Laptop, Tablet, Download, Copy 
} from 'lucide-react';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  Tabs, TabsContent, TabsList, TabsTrigger, Progress, Badge, 
  Collapsible, CollapsibleContent, CollapsibleTrigger, 
  Input, Textarea 
} from '@/components/ui';

interface ResultPanelProps {
  genState: any; // The object returned by useGeneration()
  theme: any;
  nodeTitle?: string;
}

export function ResultPanel({ genState, theme, nodeTitle }: ResultPanelProps) {
  const {
    generationState, generated,
    variants, selectedVariantId, handleSelectVariant, handleConfirmVariant,
    tweakPrompt, setTweakPrompt, isTweaking, handleTweak,
    componentTags, setComponentTags, handleConfirmTags,
    handleConfirmPalettes, handleGenerateCode,
    agentLogs, isCopied, handleCopy, handleDownload,
    customTheme, customTypography, useCustomStyles
  } = genState;

  return (
    <div className={`flex flex-col glass shadow-2xl transition-all duration-700 ease-in-out relative hover:shadow-zinc-400/20 w-[640px] max-h-[85vh] overflow-hidden rounded-none border border-zinc-200 dark:border-white/[0.08]`}>
      {/* Premium Header/Handle for the Board */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent shrink-0" />
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/[0.05] flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-none bg-zinc-400 animate-pulse" />
          <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            {nodeTitle || 'Tactical Workbench'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest px-2 py-0 rounded-none bg-zinc-100 dark:bg-white/[0.05] text-zinc-500">Live Preview</Badge>
        </div>
      </div>
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
                      <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-none" />
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
                {agentLogs.map((log: string, i: number) => (
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
            <div className="mb-10 p-6 bg-zinc-100/50 dark:bg-white/[0.02] border-l-2 border-zinc-900 dark:border-zinc-200">
              <h3 className="text-2xl font-heading font-bold mb-2 tracking-tight">Select Layout</h3>
              <p className="text-sm text-zinc-500 font-medium">Choose a structural foundation for your interface.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-10">
              {variants.map((variant: any) => (
                <Card 
                  key={variant.id}
                  onClick={() => handleSelectVariant(variant.id)}
                  className={`cursor-pointer transition-all duration-500 overflow-hidden group relative rounded-none border-2 ${
                    selectedVariantId === variant.id 
                      ? 'border-zinc-900 dark:border-zinc-200 shadow-2xl bg-zinc-50 dark:bg-[#1a1a1f] scale-[1.02] z-10' 
                      : 'border-transparent bg-zinc-100/30 dark:bg-white/[0.02] hover:bg-zinc-100/50 dark:hover:bg-white/[0.04] opacity-80 hover:opacity-100'
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
                      {variant.tags.map((tag: string, idx: number) => (
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
                        {variant.tags.slice(0, 3).map((t: string) => (
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
                    <h4 className="text-xs font-heading font-bold uppercase tracking-[0.15em] text-zinc-900 dark:text-zinc-200">Agent Refinement</h4>
                    <span className="text-[10px] text-zinc-500 font-medium">Instruct the AI to tweak the selected layout</span>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-10 overflow-auto scrollbar-hide"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-[#1e1e24] text-[10px] font-bold uppercase tracking-widest mb-6">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>Variant Confirmed</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Review Components</h3>
              <p className="text-sm text-zinc-500 font-medium">Verify the AI-detected regions before generating code.</p>
            </div>

            <div className="space-y-4 mb-10">
              {componentTags.map((tag: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.15] transition-colors group">
                  <div className="w-8 h-8 rounded-none bg-zinc-100 dark:bg-[#1e1e24] flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    0{idx+1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <Input 
                      value={tag.label}
                      onChange={(e) => {
                        const newTags = [...componentTags];
                        newTags[idx].label = e.target.value;
                        setComponentTags(newTags);
                      }}
                      className="h-8 text-sm font-semibold border-none bg-transparent focus-visible:ring-0 px-0 rounded-none w-1/2"
                    />
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest rounded-none border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#111113]">
                      {tag.type}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest h-12 rounded-none border-dashed border-zinc-300 dark:border-zinc-700">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Re-Analyze Tags
              </Button>
            </div>

            <div className="mt-auto pt-10 sticky bottom-0 bg-zinc-50/80 dark:bg-[#111113]/80 backdrop-blur-md">
              <Button 
                onClick={handleConfirmTags}
                className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-widest shadow-lg shadow-zinc-300 dark:shadow-none"
              >
                <ListChecks className="w-4 h-4 mr-2" />
                Confirm Tags & Proceed
              </Button>
            </div>
          </motion.div>
        )}

        {generationState === 'selecting_palettes' && (
          <motion.div 
            key="palettes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-10 overflow-auto scrollbar-hide"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-[#1e1e24] text-[10px] font-bold uppercase tracking-widest mb-6">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>Tags Confirmed</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Design System</h3>
              <p className="text-sm text-zinc-500 font-medium">Fine-tune the typography and colors before compiling.</p>
            </div>

            <Tabs defaultValue="colors" className="flex-1 flex flex-col">
              <TabsList className="w-full h-12 bg-zinc-100 dark:bg-[#1e1e24] p-1 rounded-none mb-8">
                <TabsTrigger value="colors" className="flex-1 rounded-none text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <Palette className="w-3.5 h-3.5 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex-1 rounded-none text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                  <Type className="w-3.5 h-3.5 mr-2" />
                  Typography
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="flex-1 outline-none mt-0">
                <Card className="rounded-none border-zinc-200 dark:border-white/[0.08] shadow-none bg-white dark:bg-[#1a1a1f]">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" /> Current Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-zinc-50 dark:bg-[#111113] border border-zinc-100 dark:border-white/[0.05]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Preset Applied</span>
                        <Badge variant="secondary" className="text-[9px] uppercase font-bold">{theme.name}</Badge>
                      </div>
                      <div className="flex gap-2 h-16 w-full rounded-none overflow-hidden border border-zinc-200 dark:border-white/[0.1] shadow-inner">
                        <div className={`flex-1 ${!useCustomStyles ? theme.primary.split(' ')[0] : ''}`} style={useCustomStyles ? { backgroundColor: customTheme.primary } : {}} />
                        <div className={`flex-1 ${!useCustomStyles ? theme.secondary.split(' ')[0] : ''}`} style={useCustomStyles ? { backgroundColor: customTheme.secondary } : {}} />
                        <div className={`flex-1 ${!useCustomStyles ? theme.bg.split(' ')[0] : ''}`} style={useCustomStyles ? { backgroundColor: customTheme.bg } : {}} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="typography" className="flex-1 outline-none mt-0">
                <Card className="rounded-none border-zinc-200 dark:border-white/[0.08] shadow-none bg-white dark:bg-[#1a1a1f]">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" /> Active Fonts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-6 p-6 bg-zinc-50 dark:bg-[#111113] border border-zinc-100 dark:border-white/[0.05] relative overflow-hidden group">
                      <div className="absolute right-0 top-0 text-[120px] font-black opacity-[0.02] dark:opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700" style={{ fontFamily: customTypography.headingFont }}>
                        Aa
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Heading Font</div>
                        <div className="text-3xl font-black tracking-tight" style={{ fontFamily: customTypography.headingFont }}>{customTypography.headingFont}</div>
                      </div>
                      <div className="h-px bg-zinc-200 dark:bg-white/[0.1] w-1/3" />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Body Font</div>
                        <div className="text-base text-zinc-600 dark:text-zinc-400" style={{ fontFamily: customTypography.bodyFont }}>
                          The quick brown fox jumps over the lazy dog. A typographic specimen indicating the body readability.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-10 sticky bottom-0 bg-zinc-50/90 dark:bg-[#111113]/90 backdrop-blur-xl pt-4">
              <Button 
                onClick={handleConfirmPalettes}
                className="w-full rounded-none h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-zinc-300 dark:shadow-none hover:scale-[1.02] transition-transform"
              >
                <Code2 className="w-5 h-5 mr-3" />
                Generate React Code
              </Button>
            </div>
          </motion.div>
        )}

        {generationState === 'completed' && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col bg-[#1e1e24] overflow-hidden"
          >
            <div className="h-14 border-b border-white/[0.08] bg-[#111113] flex items-center justify-between px-6 shrink-0 z-10">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Compiler Ready</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCopy}
                  className="rounded-none text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDownload}
                  className="rounded-none text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 relative p-8">
              <div className="absolute inset-0 pattern-dots opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-[800px] h-[500px] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col relative scale-[0.8] origin-center -mt-10">
                  <div className={`min-h-screen ${!useCustomStyles ? theme.bg.split(' ')[0] : ''}`} style={useCustomStyles ? { backgroundColor: customTheme.bg, fontFamily: customTypography.bodyFont, fontSize: `${customTypography.baseSize}px` } : {}}>
                    <header className={`flex items-center justify-between px-6 py-4 border-b ${!useCustomStyles ? theme.border.split(' ')[0] : ''}`} style={useCustomStyles ? { borderColor: customTheme.border } : {}}>
                      <div className={`font-bold text-xl ${!useCustomStyles ? theme.text.split(' ')[0] : ''}`} style={useCustomStyles ? { color: customTheme.text, fontFamily: customTypography.headingFont } : {}}>Logo</div>
                      <nav className="flex gap-6">
                        <a href="#" className={`flex items-center gap-2 px-3 py-1 font-medium ${!useCustomStyles ? theme.text.split(' ')[0] : ''} opacity-70 hover:opacity-100 transition-opacity`} style={useCustomStyles ? { color: customTheme.text } : {}}>Features</a>
                        <a href="#" className={`flex items-center gap-2 px-3 py-1 font-medium ${!useCustomStyles ? theme.text.split(' ')[0] : ''} opacity-70 hover:opacity-100 transition-opacity`} style={useCustomStyles ? { color: customTheme.text } : {}}>Pricing</a>
                      </nav>
                    </header>
                    <main className="max-w-5xl mx-auto px-6 py-24">
                      <h1 className={`text-6xl font-bold tracking-tight mb-8 ${!useCustomStyles ? theme.text.split(' ')[0] : ''}`} style={useCustomStyles ? { color: customTheme.text, fontFamily: customTypography.headingFont } : {}}>
                        Build faster than ever.
                      </h1>
                      <p className={`text-xl mb-12 max-w-2xl opacity-70 leading-relaxed ${!useCustomStyles ? theme.text.split(' ')[0] : ''}`} style={useCustomStyles ? { color: customTheme.text } : {}}>
                        The new standard for modern web development. Experience the future of UI design today.
                      </p>
                      <button className={`${!useCustomStyles ? theme.primary.split(' ')[0] : ''} text-white px-8 py-4 font-bold rounded-none shadow-xl hover:scale-105 transition-transform`} style={useCustomStyles ? { backgroundColor: customTheme.primary } : {}}>
                        Get Started
                      </button>
                      <div className="grid grid-cols-3 gap-12 mt-32">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="space-y-4">
                            <div className={`aspect-video ${!useCustomStyles ? theme.secondary.split(' ')[0] : ''} rounded-none`} style={useCustomStyles ? { backgroundColor: customTheme.secondary } : {}} />
                            <div className={`h-4 w-3/4 opacity-20 rounded-none ${!useCustomStyles ? theme.text.split(' ')[0].replace('text-', 'bg-') : ''}`} style={useCustomStyles ? { backgroundColor: customTheme.text } : {}} />
                            <div className={`h-3 w-1/2 opacity-10 rounded-none ${!useCustomStyles ? theme.text.split(' ')[0].replace('text-', 'bg-') : ''}`} style={useCustomStyles ? { backgroundColor: customTheme.text } : {}} />
                          </div>
                        ))}
                      </div>
                    </main>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

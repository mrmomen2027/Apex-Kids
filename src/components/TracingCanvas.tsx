import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RotateCcw, CheckCircle, Undo2, Music2 } from 'lucide-react';
import { MissionWord } from '../types/curriculum';
import { speakEnglish, spellWordPhonics, playSoundEffect } from '../utils/audioUtils';

interface TracingCanvasProps {
  word: MissionWord;
  onCompleteTrace?: (wordId: string) => void;
  onClose?: () => void;
}

const MARKER_COLORS = [
  { name: 'Sky Blue', hex: '#0284c7', bg: 'bg-sky-500' },
  { name: 'Candy Pink', hex: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Magic Orange', hex: '#f97316', bg: 'bg-orange-500' },
  { name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Purple Star', hex: '#8b5cf6', bg: 'bg-purple-500' },
];

export const TracingCanvas: React.FC<TracingCanvasProps> = ({ word, onCompleteTrace, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(MARKER_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState(14);
  const [strokeCount, setStrokeCount] = useState(0);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI safely
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width || canvas.offsetWidth || 400, 280);
    const height = Math.max(rect.height || canvas.offsetHeight || 240, 200);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    drawKindergartenGuides(ctx, width, height);
    drawTraceWord(ctx, width, height, word.word);

    // Save initial state safely
    try {
      if (canvas.width > 0 && canvas.height > 0) {
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
      }
    } catch {
      // In case canvas is tainted or in unsupported sandbox
    }

    setStrokeCount(0);
    setHasCompleted(false);
  }, [word]);

  const drawKindergartenGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Line heights
    const top = height * 0.22;
    const mid = height * 0.48;
    const base = height * 0.74;

    // Top line (solid blue)
    ctx.beginPath();
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2.5;
    ctx.moveTo(20, top);
    ctx.lineTo(width - 20, top);
    ctx.stroke();

    // Middle line (dashed pink)
    ctx.beginPath();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2;
    ctx.moveTo(20, mid);
    ctx.lineTo(width - 20, mid);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Base line (solid red)
    ctx.beginPath();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 3;
    ctx.moveTo(20, base);
    ctx.lineTo(width - 20, base);
    ctx.stroke();
  };

  const drawTraceWord = (ctx: CanvasRenderingContext2D, width: number, height: number, text: string) => {
    ctx.save();
    // Huge kid-friendly dotted tracing font
    const fontSize = Math.min(width / (text.length * 0.7), height * 0.45);
    ctx.font = `bold ${fontSize}px 'Fredoka', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const y = height * 0.73; // Sit on the red baseline
    const x = width / 2;

    // Faint fill guide
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(text, x, y);

    // Dotted outline for tracing
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 6]);
    ctx.strokeText(text, x, y);

    // Guide arrows / start dots
    ctx.setLineDash([]);
    ctx.restore();
  };

  // Canvas drawing handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    playSoundEffect('pop');

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokeCount(prev => prev + 1);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (canvas.width > 0 && canvas.height > 0) {
        const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory(prev => [...prev.slice(-10), state]);
      }
    } catch {
      // ignore canvas context error
    }
  };

  const handleClear = () => {
    playSoundEffect('click');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width || canvas.offsetWidth || 400, 280);
    const height = Math.max(rect.height || canvas.offsetHeight || 240, 200);

    drawKindergartenGuides(ctx, width, height);
    drawTraceWord(ctx, width, height, word.word);
    setStrokeCount(0);
    setHasCompleted(false);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    playSoundEffect('click');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevState = newHistory[newHistory.length - 1];
      if (prevState) {
        ctx.putImageData(prevState, 0, 0);
        setHistory(newHistory);
        setStrokeCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      // ignore
    }
  };

  const handleFinish = () => {
    playSoundEffect('fanfare');
    playSoundEffect('star');
    setHasCompleted(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#f43f5e', '#eab308', '#10b981', '#a855f7'],
    });

    speakEnglish(`Great job tracing ${word.word}! Super star!`, {
      rate: 0.88,
      pitch: 1.2,
    });

    onCompleteTrace?.(word.id);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-300 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-amber-100">
        <div className="flex items-center gap-3">
          <span className="text-4xl drop-shadow-md">{word.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-wide font-sans">
                {word.word}
              </h3>
              <span className="bg-amber-100 text-amber-800 text-sm px-2.5 py-0.5 rounded-full font-bold">
                {word.arabic}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              ✏️ Trace on the lines with your finger or mouse!
            </p>
          </div>
        </div>

        {/* Audio buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSoundEffect('pop');
              speakEnglish(word.word);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
            title="Listen to word"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Say Word</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('pop');
              spellWordPhonics(word.phonics, word.word);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
            title="Spell letter by letter"
          >
            <Music2 className="w-4 h-4" />
            <span>Phonics</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border-3 border-dashed border-sky-300 shadow-inner bg-white touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Floating Success Overlay */}
        {hasCompleted && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 pointer-events-none animate-in fade-in zoom-in duration-300">
            <span className="text-6xl animate-bounce">🌟</span>
            <div className="bg-white/95 px-6 py-2 rounded-2xl shadow-xl border-2 border-emerald-400">
              <p className="text-emerald-700 font-extrabold text-xl sm:text-2xl text-center">
                Super Star! ممتاز يا بطل! 🎉
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Tools */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Colors */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <span className="text-xs text-slate-500 font-bold px-1 hidden sm:inline">Color:</span>
          {MARKER_COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => {
                setSelectedColor(c.hex);
                playSoundEffect('click');
              }}
              className={`w-8 h-8 rounded-full ${c.bg} transition-all transform hover:scale-110 flex items-center justify-center text-white ${
                selectedColor === c.hex ? 'ring-4 ring-offset-2 ring-sky-400 scale-110 shadow-lg' : 'opacity-80'
              }`}
              title={c.name}
            >
              {selectedColor === c.hex && '✓'}
            </button>
          ))}
        </div>

        {/* Thickness */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <span className="text-xs text-slate-500 font-bold px-1 hidden sm:inline">Size:</span>
          {[8, 14, 20].map(size => (
            <button
              key={size}
              onClick={() => {
                setBrushSize(size);
                playSoundEffect('click');
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                brushSize === size ? 'bg-sky-500 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }}
              />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-2xl font-bold transition-all"
            title="Undo stroke"
          >
            <Undo2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-2xl font-bold text-sm transition-all"
            title="Clear and redraw"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleFinish}
            disabled={strokeCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I'm Done! ⭐</span>
          </button>
        </div>
      </div>
    </div>
  );
};

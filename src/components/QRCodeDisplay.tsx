import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  batteryId: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  batteryId,
  size = 140,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          color: {
            dark: '#040914', // Deep contrast dark navy
            light: '#FFFFFF', // Crisp clean white
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (!error) {
            setQrGenerated(true);
          } else {
            console.error('QR code generation error:', error);
          }
        }
      );
    }
  }, [value, size]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center select-none" id="qr-code-container">
      {/* Visual scanning frame */}
      <div className="relative p-2.5 bg-white rounded-2xl shadow-xl shadow-black/40 border border-slate-300 group">
        
        {/* Frame corner highlights */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-500 rounded-br-sm pointer-events-none" />

        {/* The real rendered QR Canvas */}
        <canvas 
          ref={canvasRef} 
          width={size} 
          height={size}
          className="rounded-lg block"
          id="battery-passport-qr-canvas"
        />

        {/* Small center ReLife badge over canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-md bg-[#080E1E] border border-emerald-400/80 flex items-center justify-center shadow-md">
            <span className="text-[9px] font-black text-emerald-400 font-mono">RL</span>
          </div>
        </div>
      </div>

      {/* Target Battery Identifier & Quick Copy */}
      <div className="mt-3 flex items-center gap-1.5 text-center">
        <span className="text-[11px] font-mono text-slate-300 font-bold">
          {batteryId}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer rounded"
          title="Copy QR Payload"
          id="copy-qr-payload-btn"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
        Scan for Circular Provenance
      </span>
    </div>
  );
};

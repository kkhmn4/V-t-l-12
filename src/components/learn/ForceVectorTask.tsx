import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ForceVectorTaskProps {
  onComplete: (isCorrect: boolean) => void;
}

const ForceVectorTask: React.FC<ForceVectorTaskProps> = ({ onComplete }) => {
  const [isDropped, setIsDropped] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'force-vector');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data === 'force-vector') {
      setIsDropped(true);
      // In this simple simulation, dropping it in the zone is considered correct
      setIsCorrect(true);
      onComplete(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
        <h4 className="font-bold text-lg text-on-surface mb-4">Kéo thả vector lực</h4>
        <p className="text-sm text-on-surface-variant mb-6">
          Kéo vector lực tĩnh điện Coulomb và đặt vào vị trí hạt alpha khi tiến gần hạt nhân Vàng để thể hiện hướng của lực đẩy.
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Draggable Vector */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-secondary uppercase">Vector Lực</span>
            <div
              draggable={!isDropped}
              onDragStart={handleDragStart}
              className={`w-24 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity ${
                isDropped ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 30">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                  </marker>
                </defs>
                <line x1="10" y1="15" x2="80" y2="15" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead)" />
                <text x="45" y="10" fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="bold">F</text>
              </svg>
            </div>
          </div>

          {/* Simulation Area */}
          <div className="relative w-64 h-48 bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center overflow-hidden">
            {/* Gold Nucleus */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              <span className="text-white font-bold text-xs">+79e</span>
            </div>

            {/* Alpha Particle */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-[8px]">+2e</span>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-24 h-16 border-2 transition-colors ${
                isDropped ? 'border-transparent' : 'border-primary/50 border-dashed bg-primary/5'
              } rounded-lg flex items-center justify-center`}
            >
              {!isDropped && <span className="text-[10px] text-primary/70 font-medium text-center">Thả vector<br/>vào đây</span>}
              {isDropped && (
                <div className="w-full h-full flex items-center justify-center transform rotate-180">
                  <svg width="100%" height="100%" viewBox="0 0 100 30">
                    <defs>
                      <marker id="arrowhead-dropped" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                      </marker>
                    </defs>
                    <line x1="10" y1="15" x2="80" y2="15" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead-dropped)" />
                    <text x="45" y="25" fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="bold" transform="rotate(180 45 15)">F</text>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {isCorrect && (
          <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">Chính xác!</p>
              <p className="text-sm mt-1">Lực tĩnh điện Coulomb là lực đẩy (do cả hai đều mang điện dương), có hướng từ hạt nhân Vàng đẩy hạt alpha ra xa.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForceVectorTask;

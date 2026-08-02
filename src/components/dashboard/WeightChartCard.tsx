'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Scale, TrendingDown } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface WeightChartCardProps {
  profile: UserProfile;
}

export function WeightChartCard({ profile }: WeightChartCardProps) {
  const history = profile.weightHistory || [];

  if (history.length === 0) return null;

  const weights = history.map((h) => h.weight);
  const minW = Math.min(...weights, profile.targetWeight || weights[0]) - 1;
  const maxW = Math.max(...weights, profile.targetWeight || weights[0]) + 1;

  const svgWidth = 320;
  const svgHeight = 120;

  const points = history.map((h, idx) => {
    const x = history.length > 1 ? (idx / (history.length - 1)) * (svgWidth - 40) + 20 : svgWidth / 2;
    const y = svgHeight - 20 - ((h.weight - minW) / (maxW - minW)) * (svgHeight - 40);
    return { x, y, weight: h.weight, date: h.date };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
    : '';

  const targetY = profile.targetWeight
    ? svgHeight - 20 - ((profile.targetWeight - minW) / (maxW - minW)) * (svgHeight - 40)
    : null;

  return (
    <Card className="bg-zinc-900/90 border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">Gewichtsverlauf (Trend)</h3>
        </div>
        {profile.targetWeight && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            Ziel: {profile.targetWeight} kg
          </span>
        )}
      </div>

      <div className="relative w-full overflow-hidden flex justify-center">
        <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
          {/* Target line */}
          {targetY !== null && (
            <line
              x1="10"
              y1={targetY}
              x2={svgWidth - 10}
              y2={targetY}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
          )}

          {/* Trend line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Datapoints */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#06b6d4" stroke="#09090b" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y - 9}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#ffffff"
              >
                {p.weight}kg
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}

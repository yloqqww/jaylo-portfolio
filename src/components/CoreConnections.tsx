"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CoreConnectionsProps {
  formationProgress: number;
  activeMode: string;
  isTransitioningToWork: boolean;
}

export const CoreConnections: React.FC<CoreConnectionsProps> = ({
  formationProgress,
  activeMode,
  isTransitioningToWork,
}) => {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const maxConnections = 650; // Optimized segment capacity

  // Pre-seed architectural topological node pairs
  const [linePositions, nodePairs] = useMemo(() => {
    const pos = new Float32Array(maxConnections * 2 * 3);
    const pairs: Array<{
      u: number;
      v: number;
      r1: number;
      theta1: number;
      phi1: number;
      r2: number;
      theta2: number;
      phi2: number;
      pulseOffset: number;
    }> = [];

    for (let i = 0; i < maxConnections; i++) {
      // Create algorithmic connections between geometric vertices
      const layer = i % 3;
      const baseR = layer === 0 ? 2.8 : layer === 1 ? 3.6 : 2.0;

      const phi1 = Math.PI * (0.2 + 0.6 * Math.sin(i * 0.17));
      const theta1 = (i * 137.5 * Math.PI) / 180;
      const r1 = baseR + Math.sin(i * 0.3) * 0.3;

      // Adjacent connected node
      const dTheta = (0.25 + (i % 5) * 0.08) * (i % 2 === 0 ? 1 : -1);
      const dPhi = (0.12 + (i % 3) * 0.05) * (i % 4 === 0 ? -1 : 1);
      const phi2 = phi1 + dPhi;
      const theta2 = theta1 + dTheta;
      const r2 = baseR + Math.sin((i + 1) * 0.3) * 0.3;

      pairs.push({
        u: i * 2,
        v: i * 2 + 1,
        r1,
        theta1,
        phi1,
        r2,
        theta2,
        phi2,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    return [pos, pairs];
  }, [maxConnections]);

  useFrame(({ clock }) => {
    if (!lineSegmentsRef.current) return;

    const geo = lineSegmentsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = clock.getElapsedTime();

    // Mode-driven modifiers
    let activeLimit = Math.floor(maxConnections * 0.65);
    let scale = 1.0;

    if (activeMode === "STACK") {
      activeLimit = maxConnections; // More connections visible
      scale = 1.15;
    } else if (activeMode === "WORK") {
      scale = 1.1;
    } else if (activeMode === "CONTACT") {
      scale = 0.85;
    }

    if (isTransitioningToWork) {
      scale = 1.8;
    }

    const currentFormation = Math.max(0.01, formationProgress);

    for (let i = 0; i < maxConnections; i++) {
      const idx = i * 6;
      if (i >= activeLimit) {
        // Hide unused connections
        posArray[idx] = 0; posArray[idx + 1] = 0; posArray[idx + 2] = 0;
        posArray[idx + 3] = 0; posArray[idx + 4] = 0; posArray[idx + 5] = 0;
        continue;
      }

      const pair = nodePairs[i];

      // Subtle dynamic coordinate flutter
      const sway1 = Math.sin(time * 0.8 + pair.pulseOffset) * 0.08;
      const sway2 = Math.cos(time * 0.8 + pair.pulseOffset) * 0.08;

      const r1 = (pair.r1 + sway1) * scale * currentFormation;
      const r2 = (pair.r2 + sway2) * scale * currentFormation;

      const x1 = r1 * Math.sin(pair.phi1) * Math.cos(pair.theta1 + time * 0.05);
      const y1 = r1 * Math.sin(pair.phi1) * Math.sin(pair.theta1 + time * 0.05);
      const z1 = r1 * Math.cos(pair.phi1);

      const x2 = r2 * Math.sin(pair.phi2) * Math.cos(pair.theta2 + time * 0.05);
      const y2 = r2 * Math.sin(pair.phi2) * Math.sin(pair.theta2 + time * 0.05);
      const z2 = r2 * Math.cos(pair.phi2);

      posArray[idx] = x1;
      posArray[idx + 1] = y1;
      posArray[idx + 2] = z1;

      posArray[idx + 3] = x2;
      posArray[idx + 4] = y2;
      posArray[idx + 5] = z2;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineSegmentsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={maxConnections * 2}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#4DF2FF"
        transparent
        opacity={activeMode === "WORK" || activeMode === "STACK" ? 0.38 : 0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};

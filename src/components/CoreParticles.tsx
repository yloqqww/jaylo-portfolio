"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CoreParticlesProps {
  formationProgress: number; // 0 (scattered) to 1 (fully assembled)
  activeMode: string;        // "IDLE" | "WORK" | "ABOUT" | "STACK" | "LAB" | "CONTACT"
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isTransitioningToWork: boolean;
  isChargingIntro?: boolean;
  holdProgress?: number;
  isBurstingIntro?: boolean;
}

export const CoreParticles: React.FC<CoreParticlesProps> = ({
  formationProgress,
  activeMode,
  mouse,
  isTransitioningToWork,
  isChargingIntro = false,
  holdProgress = 0,
  isBurstingIntro = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1400; // Balanced for cinematic depth and 60fps performance

  // Generate target procedural digital core positions & initial scattered positions
  const [positions, targetPositions, scatterOffsets, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const targets = new Float32Array(particleCount * 3);
    const scatters = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);

    const cyan = new THREE.Color("#4DF2FF");
    const blue = new THREE.Color("#1C88FF");
    const white = new THREE.Color("#F0F8FF");
    const darkBlue = new THREE.Color("#0E3A66");

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 1. Procedural Data Architecture Manifold
      // Partition particles into 3 architectural layers:
      // Layer A (45%): Interconnected neural shell / data manifold
      // Layer B (35%): Concentric quantized orbit rings
      // Layer C (20%): Central dense computation nucleus
      let tx = 0, ty = 0, tz = 0;
      let particleColor = cyan;

      if (i < particleCount * 0.45) {
        // Layer A: Neural Shell with golden ratio phyllotaxis distribution
        const phi = Math.acos(1 - (2 * (i + 0.5)) / (particleCount * 0.45));
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const radius = 3.6 + Math.sin(theta * 3) * 0.4;

        tx = radius * Math.sin(phi) * Math.cos(theta);
        ty = radius * Math.sin(phi) * Math.sin(theta);
        tz = radius * Math.cos(phi);

        particleColor = Math.random() > 0.6 ? cyan : blue;
        sz[i] = Math.random() * 0.045 + 0.025;
      } else if (i < particleCount * 0.8) {
        // Layer B: Concentric Quantized Data Rings
        const ringIdx = i % 4;
        const ringRadius = 2.2 + ringIdx * 0.6;
        const angle = ((i * 137.5) * Math.PI) / 180;
        const tilt = ringIdx * 0.45;

        const rx = ringRadius * Math.cos(angle);
        const ry = ringRadius * Math.sin(angle);

        // Apply 3D coordinate tilt per ring
        tx = rx * Math.cos(tilt) - ry * Math.sin(tilt) * 0.3;
        ty = ry * Math.cos(tilt);
        tz = rx * Math.sin(tilt);

        particleColor = Math.random() > 0.7 ? white : cyan;
        sz[i] = Math.random() * 0.05 + 0.03;
      } else {
        // Layer C: Central High-Density Computation Core
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 1.4;

        tx = r * Math.sin(phi) * Math.cos(theta);
        ty = r * Math.sin(phi) * Math.sin(theta);
        tz = r * Math.cos(phi);

        particleColor = Math.random() > 0.5 ? white : darkBlue;
        sz[i] = Math.random() * 0.035 + 0.02;
      }

      targets[i3] = tx;
      targets[i3 + 1] = ty;
      targets[i3 + 2] = tz;

      // Initial scattered position (starts exploded outward in 3D space)
      const scatterDir = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16
      );
      scatters[i3] = scatterDir.x;
      scatters[i3 + 1] = scatterDir.y;
      scatters[i3 + 2] = scatterDir.z;

      // Initialize current position at scatter position
      pos[i3] = scatterDir.x;
      pos[i3 + 1] = scatterDir.y;
      pos[i3 + 2] = scatterDir.z;

      // Assign vertex colors
      cols[i3] = particleColor.r;
      cols[i3 + 1] = particleColor.g;
      cols[i3 + 2] = particleColor.b;
    }

    return [pos, targets, scatters, cols, sz];
  }, [particleCount]);

  // Texture for elegant circular points
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(77, 242, 255, 0.85)");
      gradient.addColorStop(0.6, "rgba(28, 136, 255, 0.25)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Frame Loop Animation
  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;

    // Direct Visible Particle Rotation (SUPERSONIC HYPER-SPEED!)
    const spinSpeed = isBurstingIntro
      ? 60.0
      : isChargingIntro
      ? 8.0 + Math.pow(holdProgress, 1.2) * 65.0
      : 0.35;

    pointsRef.current.rotation.y += delta * spinSpeed;
    pointsRef.current.rotation.x += delta * (spinSpeed * 0.4);
    pointsRef.current.rotation.z += delta * (spinSpeed * 0.25);

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const currentPos = posAttr.array as Float32Array;
    const time = clock.getElapsedTime();

    // Mode-specific kinetic factors
    let excitationSpeed = 1.0;
    let expansionFactor = 1.0;
    let waveIntensity = 0.08;

    if (activeMode === "WORK") {
      excitationSpeed = 2.4;
      expansionFactor = 1.15;
    } else if (activeMode === "ABOUT") {
      excitationSpeed = 0.4;
      waveIntensity = 0.03;
      expansionFactor = 0.95;
    } else if (activeMode === "STACK") {
      excitationSpeed = 1.2;
      expansionFactor = 1.25;
      waveIntensity = 0.12;
    } else if (activeMode === "LAB") {
      excitationSpeed = 2.8;
      waveIntensity = 0.18;
    } else if (activeMode === "CONTACT") {
      excitationSpeed = 0.6;
      expansionFactor = 0.85; // Gently contracts toward center
    }

    // Work transition acceleration
    if (isTransitioningToWork) {
      excitationSpeed = 4.5;
      expansionFactor = 2.2;
    }

    // Intro Long-Press Charging Acceleration (Super Fast Hyper-Vortex!)
    if (isChargingIntro) {
      excitationSpeed = 2.0 + holdProgress * 12.0;
      expansionFactor = 1.0 + holdProgress * 0.45;
      waveIntensity = 0.1 + holdProgress * 0.3;
    }

    // Intro Burst Explosion (Naghihiwalay-hiwalay / sumasabog ang particles palabas)
    if (isBurstingIntro) {
      excitationSpeed = 25.0;
      expansionFactor = 4.2;
      waveIntensity = 0.5;
    }

    // Mouse influence vector
    const mx = mouse.current.x * 0.8;
    const my = mouse.current.y * 0.8;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Base target position
      let tx = targetPositions[i3] * expansionFactor;
      let ty = targetPositions[i3 + 1] * expansionFactor;
      let tz = targetPositions[i3 + 2] * expansionFactor;

      // Subtle procedural breathing wave based on coordinate
      const wave = Math.sin(time * excitationSpeed + tx * 1.5 + ty * 1.2) * waveIntensity;
      tx += wave * 0.4;
      ty += wave * 0.4;
      tz += wave * 0.4;

      // Gentle interactive mouse displacement
      const dx = mx - tx * 0.15;
      const dy = my - ty * 0.15;
      const distSq = dx * dx + dy * dy;
      if (distSq < 4.0) {
        const factor = (4.0 - distSq) * 0.06;
        tx += dx * factor;
        ty += dy * factor;
      }

      // Transition toward target based on formation progress (0 -> 1)
      const targetX = THREE.MathUtils.lerp(scatterOffsets[i3], tx, formationProgress);
      const targetY = THREE.MathUtils.lerp(scatterOffsets[i3 + 1], ty, formationProgress);
      const targetZ = THREE.MathUtils.lerp(scatterOffsets[i3 + 2], tz, formationProgress);

      // Smooth dampening interpolation
      currentPos[i3] += (targetX - currentPos[i3]) * 0.08;
      currentPos[i3 + 1] += (targetY - currentPos[i3 + 1]) * 0.08;
      currentPos[i3 + 2] += (targetZ - currentPos[i3 + 2]) * 0.08;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        map={particleTexture}
        alphaTest={0.001}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

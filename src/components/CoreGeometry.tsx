"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CoreGeometryProps {
  formationProgress: number;
  activeMode: string;
  isTransitioningToWork: boolean;
  isChargingIntro?: boolean;
  holdProgress?: number;
  isBurstingIntro?: boolean;
}

export const CoreGeometry: React.FC<CoreGeometryProps> = ({
  formationProgress,
  activeMode,
  isTransitioningToWork,
  isChargingIntro = false,
  holdProgress = 0,
  isBurstingIntro = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const corePolyRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      // Scale with formation progress
      let targetScale = Math.max(0.01, formationProgress);
      if (isBurstingIntro) {
        targetScale *= 3.0; // Expand geometry during burst
      }
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }

    const speedMult = isBurstingIntro ? 70.0 : isChargingIntro ? 8.0 + Math.pow(holdProgress, 1.2) * 60.0 : 1.0;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4 * speedMult;
      ring1Ref.current.rotation.y += delta * 0.6 * speedMult;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.5 * speedMult;
      ring2Ref.current.rotation.z += delta * 0.4 * speedMult;
    }

    if (corePolyRef.current) {
      corePolyRef.current.rotation.x -= delta * 0.3 * speedMult;
      corePolyRef.current.rotation.y += delta * 0.5 * speedMult;

      // Subtle breathing scale
      const breathe = 1 + Math.sin(time * 1.5) * 0.04;
      corePolyRef.current.scale.set(breathe, breathe, breathe);
    }

    if (pointLightRef.current) {
      // Subtle pulse in energy core
      pointLightRef.current.intensity = 0.8 + Math.sin(time * 2.0) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Subtle Internal Energy Core Light */}
      <pointLight ref={pointLightRef} color="#4DF2FF" intensity={0.8} distance={10} />
      <pointLight color="#1C88FF" intensity={0.5} distance={14} position={[0, -2, -2]} />

      {/* Primary Procedural Wireframe Cage */}
      <mesh ref={corePolyRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial
          color="#1C88FF"
          wireframe
          transparent
          opacity={activeMode === "WORK" ? 0.35 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbit Ring 1 (Horizontal Inclination) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.018, 16, 100]} />
        <meshBasicMaterial
          color="#4DF2FF"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbit Ring 2 (Vertical Orthogonal Plane) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 90]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

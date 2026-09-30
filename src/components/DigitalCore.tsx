"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface DigitalCoreProps {
  formationProgress: number;
  activeMode: string;
  isTransitioningToWork: boolean;
  isChargingIntro?: boolean;
  holdProgress?: number;
  isBurstingIntro?: boolean;
}

export const DigitalCore: React.FC<DigitalCoreProps> = ({
  formationProgress,
  activeMode,
  isTransitioningToWork,
  isChargingIntro = false,
  holdProgress = 0,
  isBurstingIntro = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    formationProgress,
    activeMode,
    isTransitioningToWork,
    isChargingIntro,
    holdProgress,
    isBurstingIntro,
  });

  useEffect(() => {
    stateRef.current = {
      formationProgress,
      activeMode,
      isTransitioningToWork,
      isChargingIntro,
      holdProgress,
      isBurstingIntro,
    };
  }, [
    formationProgress,
    activeMode,
    isTransitioningToWork,
    isChargingIntro,
    holdProgress,
    isBurstingIntro,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11.5);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Main Rotating Matrix Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ==========================================
    // A. HOLOGRAPHIC BOUNDING CAGE & FLOATING 3D STARDUST
    // (Replaces the blurry 2D aura disc with sleek 3D architectural elements)
    // ==========================================
    const spacing = 0.34;
    const N = 12;
    const halfExtent = ((N - 1) * spacing) / 2;

    // 1. Sleek Holographic Cube Bounding Wireframe
    const boxGeo = new THREE.BoxGeometry(halfExtent * 2.05, halfExtent * 2.05, halfExtent * 2.05);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xdc2626),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cubeWireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    rootGroup.add(cubeWireframe);

    // 2. Floating 3D Ambient Dust Field (Gentle drifting cosmic sparks around the cube)
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustOffsets = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const radius = 2.2 + Math.random() * 4.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dx = radius * Math.sin(phi) * Math.cos(theta);
      const dy = radius * Math.sin(phi) * Math.sin(theta);
      const dz = radius * Math.cos(phi);

      dustPositions[i3] = dx;
      dustPositions[i3 + 1] = dy;
      dustPositions[i3 + 2] = dz;

      dustOffsets[i3] = dx;
      dustOffsets[i3 + 1] = dy;
      dustOffsets[i3 + 2] = dz;

      dustColors[i3] = 0.8;
      dustColors[i3 + 1] = 0.2;
      dustColors[i3 + 2] = 0.2;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Dynamic 3D Point Lights (Shift between Crimson Red and Emerald Teal)
    const pointLight1 = new THREE.PointLight(0xdc2626, 0.55, 14);
    pointLight1.position.set(0, 0, 3.0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x059669, 0.4, 16);
    pointLight2.position.set(0, 0, -2.5);
    scene.add(pointLight2);

    // ==========================================
    // B. 3D CUBIC MATRIX GRID (Lattice of Glowing Nodes)
    // ==========================================
    // Grid: 12 x 12 x 12 = 1,728 particles in a structured 3D Cube
    const particleCount = N * N * N;

    const basePositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const scatterOffsets = new Float32Array(particleCount * 3);
    const particlePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const radiusNormalized = new Float32Array(particleCount);

    const maxDist = Math.sqrt(3 * halfExtent * halfExtent);

    let idx = 0;
    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        for (let z = 0; z < N; z++) {
          const i3 = idx * 3;
          const px = x * spacing - halfExtent;
          const py = y * spacing - halfExtent;
          const pz = z * spacing - halfExtent;

          basePositions[i3] = px;
          basePositions[i3 + 1] = py;
          basePositions[i3 + 2] = pz;

          targetPositions[i3] = px;
          targetPositions[i3 + 1] = py;
          targetPositions[i3 + 2] = pz;

          // Scatter offsets for loading intro animation
          const spread = 20;
          scatterOffsets[i3] = (Math.random() - 0.5) * spread;
          scatterOffsets[i3 + 1] = (Math.random() - 0.5) * spread;
          scatterOffsets[i3 + 2] = (Math.random() - 0.5) * spread;

          particlePositions[i3] = scatterOffsets[i3];
          particlePositions[i3 + 1] = scatterOffsets[i3 + 1];
          particlePositions[i3 + 2] = scatterOffsets[i3 + 2];

          const d = Math.sqrt(px * px + py * py + pz * pz);
          radiusNormalized[idx] = d / maxDist;

          // Initial default color: Crimson Red
          colors[i3] = 0.8;
          colors[i3 + 1] = 0.15;
          colors[i3 + 2] = 0.15;

          idx++;
        }
      }
    }

    // Crisp Node Disc Texture with soft spherical falloff
    const discCanvas = document.createElement("canvas");
    discCanvas.width = 64;
    discCanvas.height = 64;
    const dCtx = discCanvas.getContext("2d");
    if (dCtx) {
      const g = dCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255, 255, 255, 1)");
      g.addColorStop(0.35, "rgba(255, 255, 255, 0.7)");
      g.addColorStop(0.7, "rgba(255, 255, 255, 0.18)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      dCtx.fillStyle = g;
      dCtx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(discCanvas);

    const particlesGeo = new THREE.BufferGeometry();
    const particlePosAttr = new THREE.BufferAttribute(particlePositions, 3);
    const particleColAttr = new THREE.BufferAttribute(colors, 3);
    particlesGeo.setAttribute("position", particlePosAttr);
    particlesGeo.setAttribute("color", particleColAttr);

    // Perfectly sized matrix nodes matching animation.mp4 reference
    const particlesMat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      map: particleTexture,
      alphaTest: 0.001,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const matrixPoints = new THREE.Points(particlesGeo, particlesMat);
    rootGroup.add(matrixPoints);

    // ==========================================
    // C. MOUSE TRACKING & ANIMATION LOOP
    // ==========================================
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.x = nx;
      mouse.y = ny;
      targetRotation.y = nx * 0.85;
      targetRotation.x = -ny * 0.65;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animId: number;

    // Pre-allocated color references for 60fps zero-garbage-collection lerps
    const redColor = new THREE.Color(0xdc2626);
    const tealColor = new THREE.Color(0x059669);
    const currentAuraColor = new THREE.Color();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const {
        formationProgress: currentForm,
        activeMode: currMode,
        isTransitioningToWork: currTrans,
        isChargingIntro: currCharge,
        holdProgress: currHold,
        isBurstingIntro: currBurst,
      } = stateRef.current;

      // 1. Continuous 3D Perspective Rotation & Interactive Tilt
      let idleSpeed = currMode === "ABOUT" ? 0.08 : 0.2;
      if (currCharge) {
        idleSpeed += 5.0 + Math.pow(currHold, 1.2) * 40.0;
      }
      if (currBurst) {
        idleSpeed = 45.0;
      }
      rootGroup.rotation.y += delta * idleSpeed;
      rootGroup.rotation.x += delta * (idleSpeed * 0.35);

      rootGroup.rotation.y = THREE.MathUtils.lerp(
        rootGroup.rotation.y,
        rootGroup.rotation.y + targetRotation.y * 0.05,
        0.05
      );
      rootGroup.rotation.x = THREE.MathUtils.lerp(
        rootGroup.rotation.x,
        targetRotation.x,
        0.05
      );

      // Camera Parallax
      const camTargetX = mouse.x * 0.85;
      const camTargetY = mouse.y * 0.55;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, camTargetY, 0.04);
      camera.lookAt(0, 0, 0);

      // 2. DYNAMIC COLOR TRANSITION (Between Crimson Red and Emerald Teal)
      const colorMix = (Math.sin(time * 0.45 + mouse.x * 1.6 - mouse.y * 1.0) + 1) * 0.5;

      // Update dynamic color reference
      currentAuraColor.lerpColors(redColor, tealColor, colorMix);

      // A. Update Holographic Cube Bounding Wireframe (Dynamic color + subtle breath)
      edgesMat.color.copy(currentAuraColor);
      edgesMat.opacity = 0.20 + Math.sin(time * 1.6) * 0.06;

      // B. Point Lights stay balanced near the core without creating huge side-blobs
      pointLight1.color.copy(currentAuraColor);
      pointLight1.position.set(mouse.x * 1.4, mouse.y * 1.1, 2.8);
      pointLight1.intensity = 0.48;

      pointLight2.color.lerpColors(tealColor, redColor, colorMix);
      pointLight2.position.set(-mouse.x * 1.1, -mouse.y * 1.0, -2.4);
      pointLight2.intensity = 0.32;

      // C. Floating 3D Ambient Dust Field (Drifting cosmic embers in true 3D depth)
      const dPos = dustGeo.attributes.position.array as Float32Array;
      const dCol = dustGeo.attributes.color.array as Float32Array;
      const dR = THREE.MathUtils.lerp(0.82, 0.1, colorMix);
      const dG = THREE.MathUtils.lerp(0.15, 0.75, colorMix);
      const dB = THREE.MathUtils.lerp(0.18, 0.55, colorMix);

      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        dPos[i3] = dustOffsets[i3] + Math.sin(time * 0.4 + i) * 0.12;
        dPos[i3 + 1] = dustOffsets[i3 + 1] + Math.cos(time * 0.35 + i * 1.2) * 0.12;
        dPos[i3 + 2] = dustOffsets[i3 + 2] + Math.sin(time * 0.5 + i * 0.7) * 0.1;

        dCol[i3] = dR * 0.65;
        dCol[i3 + 1] = dG * 0.65;
        dCol[i3 + 2] = dB * 0.65;
      }
      dustGeo.attributes.position.needsUpdate = true;
      dustGeo.attributes.color.needsUpdate = true;
      dustPoints.rotation.y = time * 0.025;

      // 3. Matrix Particles Position & Dynamic Color Blending
      const pPos = particlePosAttr.array as Float32Array;
      const colArr = particleColAttr.array as Float32Array;

      // Virtual Light Source direction
      const lightDirX = mouse.x * 1.5;
      const lightDirY = mouse.y * 1.5;
      const lightDirZ = 1.2;
      const lLen = Math.sqrt(lightDirX * lightDirX + lightDirY * lightDirY + lightDirZ * lightDirZ);
      const lx = lightDirX / lLen;
      const ly = lightDirY / lLen;
      const lz = lightDirZ / lLen;

      const baseScale = currBurst ? 3.0 : currTrans ? 1.4 : 1.0;

      // Target color channel values based on active mix
      // Crimson state: R is dominant, G is low, B is subtle violet/coral
      // Emerald state: G is dominant, R is subtle, B is crisp cyan/teal
      const targetR = THREE.MathUtils.lerp(0.85, 0.08, colorMix);
      const targetG = THREE.MathUtils.lerp(0.12, 0.72, colorMix);
      const targetB = THREE.MathUtils.lerp(0.18, 0.58, colorMix);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3] * baseScale;
        const by = basePositions[i3 + 1] * baseScale;
        const bz = basePositions[i3 + 2] * baseScale;

        const normR = radiusNormalized[i];

        // Wave harmonics rippling through the cube
        const wave = Math.sin(time * 2.2 + normR * 4.0 - (bx * mouse.x + by * mouse.y) * 0.8) * 0.04;
        const tx = bx * (1 + wave);
        const ty = by * (1 + wave);
        const tz = bz * (1 + wave);

        // Assembly lerp from scattered state to assembled cube
        const targetX = THREE.MathUtils.lerp(scatterOffsets[i3], tx, currentForm);
        const targetY = THREE.MathUtils.lerp(scatterOffsets[i3 + 1], ty, currentForm);
        const targetZ = THREE.MathUtils.lerp(scatterOffsets[i3 + 2], tz, currentForm);

        pPos[i3] += (targetX - pPos[i3]) * 0.08;
        pPos[i3 + 1] += (targetY - pPos[i3 + 1]) * 0.08;
        pPos[i3 + 2] += (targetZ - pPos[i3 + 2]) * 0.08;

        // Specular dot calculation
        const pLen = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        const nx = bx / pLen;
        const ny = by / pLen;
        const nz = bz / pLen;
        const dot = Math.max(0, nx * lx + ly * ny + nz * lz);

        const centerHeat = Math.max(0, 1.0 - normR * 1.5);
        const illumination = dot * 0.45 + centerHeat * 0.35 + 0.15;

        // Dynamic fluid colors across each particle
        colArr[i3] = THREE.MathUtils.clamp(targetR * illumination + centerHeat * 0.15, 0, 0.95);
        colArr[i3 + 1] = THREE.MathUtils.clamp(targetG * illumination + centerHeat * 0.15, 0, 0.95);
        colArr[i3 + 2] = THREE.MathUtils.clamp(targetB * illumination + centerHeat * 0.15, 0, 0.95);
      }

      particlePosAttr.needsUpdate = true;
      particleColAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      particleTexture.dispose();
      boxGeo.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

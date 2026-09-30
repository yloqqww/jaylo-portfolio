"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { useBackground } from "./BackgroundContext";

export const GlobalBackground3D: React.FC = () => {
  const pathname = usePathname();
  const { isCharging, holdProgress, isBursting } = useBackground();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store active state in refs for 60fps render loop access
  const stateRef = useRef({
    pathname,
    isCharging,
    holdProgress,
    isBursting,
  });

  useEffect(() => {
    stateRef.current = {
      pathname,
      isCharging,
      holdProgress,
      isBursting,
    };
  }, [pathname, isCharging, holdProgress, isBursting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11.5);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Main Rotating Matrix Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ==========================================
    // A. HOLOGRAPHIC BOUNDING CAGE & DUST
    // ==========================================
    const spacing = 0.34;
    const N = 12;
    const halfExtent = ((N - 1) * spacing) / 2;

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

    // Floating 3D Ambient Dust Field (Two counter-rotating cosmic starfields)
    const dustCount = 420;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustOffsets = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const radius = 2.2 + Math.random() * 6.5;
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

      dustVelocities[i] = 0.5 + Math.random() * 1.5;

      dustColors[i3] = 0.8;
      dustColors[i3 + 1] = 0.2;
      dustColors[i3 + 2] = 0.2;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    // Circular soft particle sprite texture with high-definition glow
    const createCircleTexture = () => {
      const canvasEl = document.createElement("canvas");
      canvasEl.width = 128;
      canvasEl.height = 128;
      const ctx = canvasEl.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
        gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.35)");
        gradient.addColorStop(0.85, "rgba(255, 255, 255, 0.08)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(canvasEl);
    };

    const particleTexture = createCircleTexture();

    const dustMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      map: particleTexture,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Outer Celestial Dust Ring for Cinematic Parallax Depth
    const outerDustCount = 200;
    const outerDustGeo = new THREE.BufferGeometry();
    const outerDustPositions = new Float32Array(outerDustCount * 3);
    for (let i = 0; i < outerDustCount; i++) {
      const i3 = i * 3;
      const r = 7.0 + Math.random() * 8.0;
      const th = Math.random() * Math.PI * 2;
      outerDustPositions[i3] = r * Math.cos(th);
      outerDustPositions[i3 + 1] = (Math.random() - 0.5) * 8.0;
      outerDustPositions[i3 + 2] = r * Math.sin(th);
    }
    outerDustGeo.setAttribute("position", new THREE.BufferAttribute(outerDustPositions, 3));
    const outerDustMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0x4df2ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      map: particleTexture,
      depthWrite: false,
    });
    const outerDustPoints = new THREE.Points(outerDustGeo, outerDustMat);
    scene.add(outerDustPoints);

    // ==========================================
    // B. MATRIX CORE PARTICLES
    // ==========================================
    const particleCount = N * N * N;
    const particlesGeo = new THREE.BufferGeometry();
    const basePositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const radiusNormalized = new Float32Array(particleCount);

    let idx = 0;
    const maxRadius = Math.sqrt(3 * Math.pow(halfExtent, 2));

    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        for (let z = 0; z < N; z++) {
          const px = x * spacing - halfExtent;
          const py = y * spacing - halfExtent;
          const pz = z * spacing - halfExtent;

          const i3 = idx * 3;
          basePositions[i3] = px;
          basePositions[i3 + 1] = py;
          basePositions[i3 + 2] = pz;

          currentPositions[i3] = px;
          currentPositions[i3 + 1] = py;
          currentPositions[i3 + 2] = pz;

          const r = Math.sqrt(px * px + py * py + pz * pz);
          radiusNormalized[idx] = r / maxRadius;

          particleColors[i3] = 0.8;
          particleColors[i3 + 1] = 0.15;
          particleColors[i3 + 2] = 0.2;

          idx++;
        }
      }
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particlesGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      map: particleTexture,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    rootGroup.add(particleSystem);

    // ==========================================
    // C. SCENE LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4df2ff, 0.7, 25);
    pointLight1.position.set(2, 2, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xdc2626, 0.5, 25);
    pointLight2.position.set(-2, -2, -3);
    scene.add(pointLight2);

    // Mouse Tracking for Interactive Drift & Quantum Lens
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 0, lastX: 0, lastY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      const dx = e.clientX - mouse.lastX;
      const dy = e.clientY - mouse.lastY;
      mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.05, 3.0);
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener("resize", handleResize);

    // Color Palettes for each route
    // HOME: Crimson & Core Cyan
    const homeColorA = new THREE.Color(0xdc2626);
    const homeColorB = new THREE.Color(0x4df2ff);

    // WORK: Warm Amber/Gold & Sky Cyan
    const workColorA = new THREE.Color(0xf59e0b);
    const workColorB = new THREE.Color(0x38bdf8);

    // WEBSITES: Emerald Matrix & Electric Cyan
    const websitesColorA = new THREE.Color(0x10b981);
    const websitesColorB = new THREE.Color(0x06b6d4);

    // INFO: Deep Indigo/Violet & Soft Cyan
    const infoColorA = new THREE.Color(0x8b5cf6);
    const infoColorB = new THREE.Color(0x38bdf8);

    // Active Interpolated Colors
    const activeColorA = new THREE.Color(0xdc2626);
    const activeColorB = new THREE.Color(0x4df2ff);
    const currentAuraColor = new THREE.Color();

    // Target Camera Transforms for each route (Cinematic multi-angle vantage points)
    const targetCam = new THREE.Vector3(0, 0, 11.5);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    let targetScale = 1.0;
    let currentScale = 1.0;
    let baseFov = 45;

    const clock = new THREE.Clock();
    let animId: number;
    let prevPath = stateRef.current.pathname;
    let transitionImpulse = 0;

    // Render Animation Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      const { pathname: currentPath, isCharging: currCharge, holdProgress: currHold, isBursting: currBurst } = stateRef.current;

      // Detect route change and trigger buttery cinematic hyperspace glide
      if (currentPath !== prevPath) {
        prevPath = currentPath;
        transitionImpulse = 1.0;
      }

      if (transitionImpulse > 0) {
        transitionImpulse = Math.max(0, transitionImpulse - delta * 1.25);
      }

      // Route transition warp curve: peaks smoothly at 0.5s
      const warpFactor = Math.sin(transitionImpulse * Math.PI);

      // Determine Target Theme & Dynamic Camera Choreography
      let routeColorA = homeColorA;
      let routeColorB = homeColorB;

      if (currentPath === "/work") {
        // Dramatic low-angle isometric perspective looking upward through the golden core
        routeColorA = workColorA;
        routeColorB = workColorB;
        targetCam.set(-1.8, -1.0, 13.8);
        targetLookAt.set(-0.3, -0.2, 0);
        targetScale = 1.35;
      } else if (currentPath === "/websites") {
        // High-angle cyber overview looking downward over emerald matrix
        routeColorA = websitesColorA;
        routeColorB = websitesColorB;
        targetCam.set(1.5, 1.4, 14.2);
        targetLookAt.set(0.2, 0.2, 0);
        targetScale = 1.38;
      } else if (currentPath === "/info") {
        // Lateral celestial view framing content cleanly on the left
        routeColorA = infoColorA;
        routeColorB = infoColorB;
        targetCam.set(2.4, -0.3, 13.0);
        targetLookAt.set(0.4, 0, 0);
        targetScale = 1.25;
      } else {
        // HOME ("/") - Heroic centered alignment (punchy on mobile, untouched on desktop)
        routeColorA = homeColorA;
        routeColorB = homeColorB;
        const isMobile = window.innerWidth < 768;
        targetCam.set(0, 0, isMobile ? 9.6 : 11.5);
        targetLookAt.set(0, 0, 0);
        targetScale = isMobile ? 1.25 : 1.0;
      }

      // High-End Exponential Spring Damping (Butter-smooth, zero jitter)
      const dampFactor = 1 - Math.exp(-3.5 * delta);

      activeColorA.lerp(routeColorA, dampFactor * 0.95);
      activeColorB.lerp(routeColorB, dampFactor * 0.95);

      currentScale += (targetScale - currentScale) * dampFactor;

      // Dynamic FOV breathing during warp transition (cinematic dolly-zoom effect)
      const targetFov = baseFov + warpFactor * 8.5;
      camera.fov += (targetFov - camera.fov) * dampFactor;
      camera.updateProjectionMatrix();

      // Smooth mouse follow with velocity dampening
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      mouse.speed *= 0.92;

      // 1. Perspective Rotation & Dynamic Momentum
      let idleSpeed = currentPath === "/" ? 0.22 : 0.14;
      if (currCharge) {
        idleSpeed += 5.0 + Math.pow(currHold, 1.2) * 40.0;
      }
      if (currBurst) {
        idleSpeed = 45.0;
      }

      // Add slight hyperspace spin burst during navigation
      idleSpeed += warpFactor * 0.9;

      rootGroup.rotation.y += delta * idleSpeed;
      rootGroup.rotation.x += delta * (idleSpeed * 0.32);

      // Smooth Camera Physics with gentle route transition warp streak
      const warpZPush = warpFactor * 1.8;
      const finalCamX = targetCam.x + mouse.x * 0.75;
      const finalCamY = targetCam.y + mouse.y * 0.5;
      const finalCamZ = targetCam.z - warpZPush;

      camera.position.x += (finalCamX - camera.position.x) * (dampFactor * 0.85);
      camera.position.y += (finalCamY - camera.position.y) * (dampFactor * 0.85);
      camera.position.z += (finalCamZ - camera.position.z) * (dampFactor * 0.85);

      currentLookAt.x += (targetLookAt.x - currentLookAt.x) * (dampFactor * 0.85);
      currentLookAt.y += (targetLookAt.y - currentLookAt.y) * (dampFactor * 0.85);
      currentLookAt.z += (targetLookAt.z - currentLookAt.z) * (dampFactor * 0.85);
      camera.lookAt(currentLookAt);

      // 2. Harmonic Color Wave & Aura Pulse
      const colorMix = (Math.sin(time * 0.5 + mouse.x * 1.4 - mouse.y * 0.8) + 1) * 0.5;
      currentAuraColor.lerpColors(activeColorA, activeColorB, colorMix);

      // Update Bounding Wireframe (Dynamic color, breath, and warp flash)
      edgesMat.color.copy(currentAuraColor);
      edgesMat.opacity = Math.min(
        0.8,
        (currentPath === "/" ? 0.22 + Math.sin(time * 1.6) * 0.05 : 0.12) + warpFactor * 0.3
      );

      // Lights tracking mouse aura
      pointLight1.color.copy(currentAuraColor);
      pointLight1.position.set(mouse.x * 2.2, mouse.y * 1.8, 3.2);
      pointLight2.color.lerpColors(activeColorB, activeColorA, colorMix);

      // Cosmic Dust (Hyperdrive streak effect on transition)
      const dPos = dustGeo.attributes.position.array as Float32Array;
      const dCol = dustGeo.attributes.color.array as Float32Array;
      const warpSpeedBoost = warpFactor * 6.0;

      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const vel = dustVelocities[i];
        dPos[i3] = dustOffsets[i3] + Math.sin(time * 0.35 + i) * 0.15;
        dPos[i3 + 1] = dustOffsets[i3 + 1] + Math.cos(time * 0.3 + i * 1.1) * 0.15;

        // Z-axis hyperspace drift
        dPos[i3 + 2] = dustOffsets[i3 + 2] + Math.sin(time * 0.45 + i * 0.7) * 0.12 + Math.sin(time * vel * 0.5) * warpSpeedBoost;

        dCol[i3] = currentAuraColor.r * (0.6 + warpFactor * 0.4);
        dCol[i3 + 1] = currentAuraColor.g * (0.6 + warpFactor * 0.4);
        dCol[i3 + 2] = currentAuraColor.b * (0.6 + warpFactor * 0.4);
      }
      dustGeo.attributes.position.needsUpdate = true;
      dustGeo.attributes.color.needsUpdate = true;
      dustPoints.rotation.y = time * 0.025;

      // Outer Dust Parallax counter-rotation
      outerDustPoints.rotation.y = -time * 0.015;
      outerDustPoints.rotation.x = Math.sin(time * 0.1) * 0.05;

      // 3. Matrix Core Particles: Quantum Gravitational Lens & Warp Shockwaves
      const pPos = particlesGeo.attributes.position.array as Float32Array;
      const colArr = particlesGeo.attributes.color.array as Float32Array;

      const dynamicScale = currBurst
        ? 3.4
        : currCharge
          ? currentScale + Math.pow(currHold, 1.2) * 0.4
          : currentScale;

      // Mouse 3D repulsion center
      const mouseWorldX = mouse.x * 2.8;
      const mouseWorldY = mouse.y * 2.2;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3] * dynamicScale;
        const by = basePositions[i3 + 1] * dynamicScale;
        const bz = basePositions[i3 + 2] * dynamicScale;

        const normR = radiusNormalized[i];

        // Quantum Gravitational Lens: particles gently displace when cursor gets close
        const dx = bx - mouseWorldX;
        const dy = by - mouseWorldY;
        const distSq = dx * dx + dy * dy;
        const mouseRepel = Math.exp(-distSq / 3.8) * 0.35 * (1.0 + mouse.speed * 0.5);

        // Fluid Harmonic Wave + Warp Distortion Pulse
        const harmonicWave = Math.sin(time * 2.2 + normR * 4.2 - (bx * mouse.x + by * mouse.y) * 0.5) * 0.04;
        const warpPulse = Math.sin(time * 6.0 - normR * 10.0) * warpFactor * 0.28;

        const totalDistort = 1.0 + harmonicWave + warpPulse + mouseRepel;

        // Hyperspace Z-streak stretching on page navigation
        const zStreak = warpFactor * (bz * 0.5);

        pPos[i3] = bx * totalDistort + (dx / (Math.sqrt(distSq) + 0.1)) * mouseRepel * 0.2;
        pPos[i3 + 1] = by * totalDistort + (dy / (Math.sqrt(distSq) + 0.1)) * mouseRepel * 0.2;
        pPos[i3 + 2] = bz * totalDistort + zStreak;

        // Radial Color Lerp with High-Intensity Core Flare
        const radialMix = Math.min(1, Math.max(0, normR * 1.1 + (colorMix - 0.5) * 0.6 + warpFactor * 0.3));
        const flare = mouseRepel * 0.5 + warpFactor * 0.25;

        colArr[i3] = THREE.MathUtils.clamp(THREE.MathUtils.lerp(activeColorA.r, activeColorB.r, radialMix) + flare, 0, 1);
        colArr[i3 + 1] = THREE.MathUtils.clamp(THREE.MathUtils.lerp(activeColorA.g, activeColorB.g, radialMix) + flare, 0, 1);
        colArr[i3 + 2] = THREE.MathUtils.clamp(THREE.MathUtils.lerp(activeColorA.b, activeColorB.b, radialMix) + flare, 0, 1);
      }

      particlesGeo.attributes.position.needsUpdate = true;
      particlesGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
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
      outerDustGeo.dispose();
      outerDustMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

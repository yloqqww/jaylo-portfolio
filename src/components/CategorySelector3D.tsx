"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { ArrowUpRight, Sparkles, Briefcase } from "lucide-react";
import { useSound } from "./SoundController";

interface CategorySelector3DProps {
  activeCategory?: "PERSONAL" | "INDUSTRY" | null;
  onSelectCategory: (cat: "PERSONAL" | "INDUSTRY") => void;
}

interface GeometryCardProps {
  id: "PERSONAL" | "INDUSTRY";
  index: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  ctaText: string;
  geometryType: "sphere" | "octahedron";
  colorHex: number;
  theme: {
    accentColor: string;
    borderColor: string;
    borderHoverColor: string;
    bgHoverColor: string;
    glowShadow: string;
    textColor: string;
    tagBg: string;
  };
  isActive: boolean;
  onSelect: () => void;
}

const GeometryCard: React.FC<GeometryCardProps> = ({
  id,
  index,
  badge,
  title,
  tagline,
  description,
  ctaText,
  geometryType,
  colorHex,
  theme,
  isActive,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { playHoverSound, playSelectSound } = useSound();

  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    let mainGeo: THREE.BufferGeometry;
    let innerGeo: THREE.BufferGeometry | null = null;

    if (geometryType === "sphere") {
      // High-tech Geodesic Wireframe Sphere (PERSONAL)
      mainGeo = new THREE.IcosahedronGeometry(1.25, 3);
      innerGeo = new THREE.IcosahedronGeometry(0.75, 1);
    } else {
      // Precision Octahedral / Crystalline Wireframe (INDUSTRY)
      mainGeo = new THREE.OctahedronGeometry(1.35, 1);
      innerGeo = new THREE.OctahedronGeometry(0.8, 0);
    }

    const wireGeo = new THREE.WireframeGeometry(mainGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const lineMesh = new THREE.LineSegments(wireGeo, wireMat);
    mainGroup.add(lineMesh);

    // Inner concentric wireframe for layered holographic depth
    let innerLineMesh: THREE.LineSegments | null = null;
    let innerWireGeo: THREE.WireframeGeometry | null = null;
    let innerWireMat: THREE.LineBasicMaterial | null = null;

    if (innerGeo) {
      innerWireGeo = new THREE.WireframeGeometry(innerGeo);
      innerWireMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.35,
      });
      innerLineMesh = new THREE.LineSegments(innerWireGeo, innerWireMat);
      mainGroup.add(innerLineMesh);
    }

    // Pointer interactivity
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("resize", onResize);

    // Render loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const speed = isHovered || isActive ? 1.15 : 0.45;
      mainGroup.rotation.y += delta * speed;
      mainGroup.rotation.x += delta * (speed * 0.4);

      if (innerLineMesh) {
        innerLineMesh.rotation.y -= delta * (speed * 0.8);
        innerLineMesh.rotation.z += delta * (speed * 0.5);
      }

      // Smoothly tilt toward mouse/touch target
      const targetTiltX = -mouseRef.current.y * 0.35;
      const targetTiltY = mouseRef.current.x * 0.35;
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, targetTiltX, 0.06);
      mainGroup.rotation.z = THREE.MathUtils.lerp(mainGroup.rotation.z, -targetTiltY * 0.5, 0.06);

      // Lerp opacity & scale on hover
      const targetOpacity = isHovered || isActive ? 1.0 : 0.75;
      wireMat.opacity = THREE.MathUtils.lerp(wireMat.opacity, targetOpacity, 0.1);

      const targetScale = isHovered || isActive ? 1.08 : 1.0;
      mainGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mainGeo.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      if (innerGeo) innerGeo.dispose();
      if (innerWireGeo) innerWireGeo.dispose();
      if (innerWireMat) innerWireMat.dispose();
    };
  }, [geometryType, colorHex, isHovered, isActive]);

  const handleCardClick = () => {
    playSelectSound();
    onSelect();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={`group relative w-full rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden border backdrop-blur-2xl text-left ${
        isActive || isHovered
          ? `${theme.borderHoverColor} ${theme.glowShadow} -translate-y-1 bg-[#090b12]/95`
          : `${theme.borderColor} bg-[#06080d]/85 hover:${theme.borderHoverColor} hover:-translate-y-1 hover:${theme.glowShadow}`
      }`}
    >
      {/* Top Ambient Glow Gradient */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 ${
          isHovered || isActive ? "opacity-100" : "opacity-30"
        } ${theme.tagBg}`}
      />

      {/* Cyber Corner Decals */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/60 pointer-events-none transition-colors" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-white/20 group-hover:border-white/60 pointer-events-none transition-colors" />
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-white/20 group-hover:border-white/60 pointer-events-none transition-colors" />
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/60 pointer-events-none transition-colors" />

      {/* Card Header: System Index + Geometry Badge */}
      <div className="flex items-center justify-between gap-3 w-full border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs sm:text-sm font-bold tracking-widest ${theme.textColor}`}>
            SYS // {index}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition-colors" />
          <span className="font-mono text-[10px] sm:text-xs text-white/50 tracking-wider uppercase">
            {badge}
          </span>
        </div>
        <div className="p-1 rounded-lg border border-white/10 bg-white/[0.04] text-white/70 group-hover:text-white transition-colors">
          {geometryType === "sphere" ? (
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          ) : (
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
          )}
        </div>
      </div>

      {/* 3D Geometry Canvas Container - Fully responsive & non-overlapping */}
      <div
        ref={containerRef}
        className="relative w-full h-[140px] xs:h-[160px] sm:h-[170px] md:h-[180px] lg:h-[195px] my-1 sm:my-2 flex items-center justify-center pointer-events-none select-none"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Subtle radial glow under the 3D object */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity duration-300 ${
            geometryType === "sphere" ? "bg-yellow-500/30" : "bg-sky-500/30"
          } ${isHovered || isActive ? "opacity-35" : "opacity-15"}`}
        />
      </div>

      {/* Card Body & CTA */}
      <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-white/10">
        <div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase block">
            {tagline}
          </span>
          <h3 className="font-grotesk text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-zinc-400 text-xs sm:text-[13px] font-sans line-clamp-1 leading-normal">
          {description}
        </p>

        {/* High-Tech CTA Button */}
        <div className="pt-1.5 flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-2 py-1.5 sm:py-2 px-3.5 sm:px-4 rounded-full font-mono text-xs sm:text-[13px] tracking-wider font-semibold uppercase transition-all duration-300 border ${
              isHovered || isActive
                ? `${theme.textColor} border-current ${theme.bgHoverColor} shadow-md`
                : "border-white/20 bg-black/60 text-white/80 group-hover:border-white/50"
            }`}
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest hidden sm:inline">
            SELECT NODE //
          </span>
        </div>
      </div>
    </div>
  );
};

export const CategorySelector3D: React.FC<CategorySelector3DProps> = ({
  activeCategory = null,
  onSelectCategory,
}) => {
  return (
    <div className="relative w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Grid: 1 column on mobile (stacked), 2 columns on desktop (zero scroll) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Sector 01: PERSONAL PROJECTS (Geodesic Wireframe Sphere) */}
        <GeometryCard
          id="PERSONAL"
          index="01"
          badge="GEODESIC SPHERE"
          title="PERSONAL PROJECTS"
          tagline="INDEPENDENT SYSTEMS & RESEARCH"
          description="High-converting SaaS applications, AI neural CRMs, and web experiments."
          ctaText="EXPLORE PERSONAL"
          geometryType="sphere"
          colorHex={0xfacc15}
          theme={{
            accentColor: "yellow-400",
            borderColor: "border-yellow-500/25",
            borderHoverColor: "border-yellow-400",
            bgHoverColor: "bg-yellow-400/20",
            glowShadow: "shadow-[0_0_30px_rgba(250,204,21,0.25)]",
            textColor: "text-yellow-300",
            tagBg: "bg-gradient-to-r from-transparent via-yellow-400 to-transparent",
          }}
          isActive={activeCategory === "PERSONAL"}
          onSelect={() => onSelectCategory("PERSONAL")}
        />

        {/* Sector 02: INDUSTRY (Octahedral Wireframe Crystal) */}
        <GeometryCard
          id="INDUSTRY"
          index="02"
          badge="OCTAHEDRAL CRYSTAL"
          title="INDUSTRY & CLIENTS"
          tagline="COMMERCIAL TRACK RECORD"
          description="Verified enterprise roles, offshore consulting portals, and deliverables."
          ctaText="VIEW EXPERIENCE"
          geometryType="octahedron"
          colorHex={0x38bdf8}
          theme={{
            accentColor: "sky-400",
            borderColor: "border-sky-500/25",
            borderHoverColor: "border-sky-400",
            bgHoverColor: "bg-sky-400/20",
            glowShadow: "shadow-[0_0_30px_rgba(56,189,248,0.25)]",
            textColor: "text-sky-300",
            tagBg: "bg-gradient-to-r from-transparent via-sky-400 to-transparent",
          }}
          isActive={activeCategory === "INDUSTRY"}
          onSelect={() => onSelectCategory("INDUSTRY")}
        />

      </div>
    </div>
  );
};

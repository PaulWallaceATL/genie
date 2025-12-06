"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function GenieScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.06);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 60);
    camera.position.set(0, 0.6, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.classList.add("three-canvas");
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xb8c7ff, 0.75);
    const keyLight = new THREE.PointLight(0x5dd8ff, 2.2, 0, 2);
    keyLight.position.set(3, 2, 4);
    const fillLight = new THREE.PointLight(0xa78bfa, 1.6, 0, 2);
    fillLight.position.set(-2.5, 1.5, 3);
    scene.add(ambient, keyLight, fillLight);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#6fd9ff"),
      emissive: new THREE.Color("#5dd8ff").multiplyScalar(0.35),
      roughness: 0.22,
      metalness: 0.72,
      transparent: true,
      opacity: 0.96,
    });

    const vessel = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.38, 180, 24), material);
    scene.add(vessel);

    const auraGeo = new THREE.RingGeometry(1.2, 1.8, 60, 1);
    const auraMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f8d477"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = Math.PI / 2;
    aura.position.y = -0.6;
    scene.add(aura);

    const particles = new THREE.BufferGeometry();
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 5 - 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.04,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const points = new THREE.Points(particles, particleMaterial);
    scene.add(points);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      vessel.rotation.x = Math.sin(t * 0.32) * 0.25;
      vessel.rotation.y = t * 0.32;
      vessel.rotation.z = Math.cos(t * 0.18) * 0.2;
      vessel.position.y = Math.sin(t * 0.8) * 0.12;

      aura.scale.setScalar(1 + Math.sin(t * 1.1) * 0.04);
      aura.material.opacity = 0.18 + Math.sin(t * 2) * 0.02;

      points.rotation.y = t * 0.05;
      points.position.y = Math.sin(t * 0.6) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || width;
      const newHeight = container.clientHeight || height;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      scene.clear();
      renderer.dispose();
      material.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      particleMaterial.dispose();
      particles.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5"
    >
      <div className="absolute inset-0 grid-dots" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1228]/80 via-transparent to-[#0b1228]/40" />
    </div>
  );
}


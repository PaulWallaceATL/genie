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
    scene.fog = new THREE.FogExp2(0x0a0616, 0.08);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 70);
    camera.position.set(0, 0.8, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.classList.add("three-canvas");
    container.appendChild(renderer.domElement);

    const purple = new THREE.Color("#8c52ff");
    const gold = new THREE.Color("#f7c552");
    const mist = new THREE.Color("#c49bff");

    const ambient = new THREE.AmbientLight(0xe9ddff, 0.6);
    const keyLight = new THREE.PointLight(gold, 2.3, 0, 2);
    keyLight.position.set(3, 2.6, 4);
    const fillLight = new THREE.PointLight(purple, 1.8, 0, 2);
    fillLight.position.set(-2.8, 1.8, 3.4);
    const rimLight = new THREE.PointLight(0xffffff, 0.4);
    rimLight.position.set(0, 4, -4);
    scene.add(ambient, keyLight, fillLight, rimLight);

    const lampProfile = new THREE.Shape();
    lampProfile.moveTo(0, 0);
    lampProfile.bezierCurveTo(0.2, 0.05, 0.5, 0.08, 0.8, 0.08);
    lampProfile.bezierCurveTo(1.4, 0.1, 1.6, 0.4, 1.7, 0.8);
    lampProfile.bezierCurveTo(1.8, 1.3, 1.4, 1.6, 1, 1.7);
    lampProfile.bezierCurveTo(0.6, 1.8, 0.35, 1.8, 0, 1.78);

    const lathePoints: THREE.Vector2[] = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const x = lampProfile.getPoint(t).x;
      const y = lampProfile.getPoint(t).y;
      lathePoints.push(new THREE.Vector2(x, y));
    }
    const lampGeo = new THREE.LatheGeometry(lathePoints, 48, 0, Math.PI * 2);
    const lampMat = new THREE.MeshStandardMaterial({
      color: gold,
      emissive: gold.clone().multiplyScalar(0.35),
      roughness: 0.25,
      metalness: 0.85,
    });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.scale.set(1.3, 1.3, 1.3);
    lamp.position.set(0, -1.6, 0);
    scene.add(lamp);

    const geniePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.4, 0),
      new THREE.Vector3(0.2, -0.9, 0.1),
      new THREE.Vector3(-0.25, -0.2, -0.1),
      new THREE.Vector3(0.15, 0.5, 0.2),
      new THREE.Vector3(-0.1, 1.2, -0.2),
      new THREE.Vector3(0.05, 2, 0.1),
    ]);
    const genieGeo = new THREE.TubeGeometry(geniePath, 180, 0.22, 30, false);
    const genieMat = new THREE.MeshStandardMaterial({
      color: purple,
      emissive: mist.clone().multiplyScalar(0.35),
      transparent: true,
      opacity: 0.9,
      roughness: 0.18,
      metalness: 0.45,
      side: THREE.DoubleSide,
    });
    const genie = new THREE.Mesh(genieGeo, genieMat);
    genie.position.y = -0.2;
    scene.add(genie);

    const haloGeo = new THREE.RingGeometry(0.5, 1.2, 48, 1);
    const haloMat = new THREE.MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -1.1;
    scene.add(halo);

    const particleCount = 360;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random();
      const pos = geniePath.getPoint(t * 0.98 + 0.02);
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.5,
      );
      pos.add(offset);
      particlePositions[i * 3] = pos.x;
      particlePositions[i * 3 + 1] = pos.y;
      particlePositions[i * 3 + 2] = pos.z;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf7c552,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      genie.rotation.y = Math.sin(t * 0.32) * 0.25;
      genie.rotation.z = Math.cos(t * 0.2) * 0.12;
      genie.position.x = Math.sin(t * 0.4) * 0.05;

      lamp.rotation.y = t * 0.1;

      halo.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
      halo.material.opacity = 0.3 + Math.sin(t * 1.7) * 0.05;

      particles.rotation.y = t * 0.15;
      particles.position.y = Math.sin(t * 0.8) * 0.06;

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
      lampGeo.dispose();
      lampMat.dispose();
      genieGeo.dispose();
      genieMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      particleMaterial.dispose();
      particleGeo.dispose();
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


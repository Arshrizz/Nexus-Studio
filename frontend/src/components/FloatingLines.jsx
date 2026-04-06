import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import './FloatingLines.css';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uAnimationSpeed;
  uniform float uBendRadius;
  uniform float uBendStrength;
  uniform vec2 uMouse;
  uniform float uParallaxStrength;

  void main() {
    vec2 uv = vUv;
    
    // Parallax & Mouse influence
    vec2 mouseOffset = (uMouse / uResolution.xy - 0.5) * uParallaxStrength;
    uv += mouseOffset;

    // Apply Bending
    float distToCenter = length(uv - 0.5);
    float bend = uBendStrength * exp(-distToCenter / uBendRadius);
    uv.y += bend;

    vec3 col = vec3(0.0);
    float t = uTime * uAnimationSpeed * 0.5;

    // Line generation logic
    for(float i = 0.0; i < 5.0; i++) {
        float wave = sin(uv.x * (3.0 + i) + t + i * 1.5) * 0.15;
        wave += sin(uv.x * (2.0 + i * 0.5) - t * 0.8) * 0.1;
        
        float dist = abs(uv.y - (0.3 + i * 0.12 + wave));
        float glow = 0.002 / (dist + 0.015);
        
        vec3 lineCol = uColor1;
        if(i == 1.0) lineCol = uColor2;
        if(i == 2.0) lineCol = uColor3;
        if(i >= 3.0) lineCol = uColor4;
        
        col += lineCol * glow * (1.0 - dist * 2.0);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new THREE.Vector3(r, g, b);
};

const FloatingLines = ({
  linesGradient = ["#E945F5", "#2fc175", "#47f5d8", "#ffffff"],
  animationSpeed = 1.5,
  interactive = true,
  bendRadius = 0.5,
  bendStrength = -0.4,
  parallax = true,
  parallaxStrength = 0.15
}) => {
  const containerRef = useRef();
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector3() },
    uColor1: { value: hexToRgb(linesGradient[0]) },
    uColor2: { value: hexToRgb(linesGradient[1]) },
    uColor3: { value: hexToRgb(linesGradient[2]) },
    uColor4: { value: hexToRgb(linesGradient[3] || "#ffffff") },
    uAnimationSpeed: { value: animationSpeed },
    uBendRadius: { value: bendRadius },
    uBendStrength: { value: bendStrength },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uParallaxStrength: { value: parallax ? parallaxStrength : 0 }
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera(); // Full screen quad setup
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
      uniformsRef.current.uResolution.value.set(clientWidth, clientHeight, 1);
    };

    const handleMouseMove = (e) => {
      if (interactive) {
        uniformsRef.current.uMouse.value.set(e.clientX, window.innerHeight - e.clientY);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      uniformsRef.current.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []); // Only run once on mount

  // Update uniforms when props change without resetting the clock
  useEffect(() => {
    uniformsRef.current.uColor1.value = hexToRgb(linesGradient[0]);
    uniformsRef.current.uColor2.value = hexToRgb(linesGradient[1]);
    uniformsRef.current.uColor3.value = hexToRgb(linesGradient[2]);
    uniformsRef.current.uColor4.value = hexToRgb(linesGradient[3] || "#ffffff");
    uniformsRef.current.uAnimationSpeed.value = animationSpeed;
    uniformsRef.current.uBendRadius.value = bendRadius;
    uniformsRef.current.uBendStrength.value = bendStrength;
    uniformsRef.current.uParallaxStrength.value = parallax ? parallaxStrength : 0;
  }, [linesGradient, animationSpeed, bendRadius, bendStrength, parallax, parallaxStrength]);

  return <div ref={containerRef} className="floating-lines-container" style={{ width: '100%', height: '100vh' }} />;
};

export default FloatingLines;

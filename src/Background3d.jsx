import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three'; // 🔥 Smooth animation

function GblElement() {
  const { scene } = useGLTF('/cob.glb'); // ✅ Attach glb Element
  const gblElementRef = useRef();
  const rotationY = useRef(0);

  // 🌟 Smooth rotation effect with easing
  const [{ rotation }, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { tension: 120, friction: 14 },
  }));

  // 🔄 Handle scroll input with limits and smooth transitions
  const handleScroll = useCallback(
    (event) => {
      if (gblElementRef.current) {
        const delta = event.deltaY * 0.0005;
        rotationY.current = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, rotationY.current + delta));

        api.start({ rotation: [0, rotationY.current, 0] });
      }
    },
    [api],
  );

  // ✅ Attach scroll event listener efficiently
  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);

  return <a.primitive ref={gblElementRef} object={scene} scale={0.3} position={[0, -5, 0]} rotation={rotation} />;
}

export default function Background3d() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <GblElement />
    </Canvas>
  );
}

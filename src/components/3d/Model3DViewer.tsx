"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Model3DViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "#111827" }}
      shadows
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#c9a84c" />
      <Center>
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      </Center>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={6}
        autoRotate={true}
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}

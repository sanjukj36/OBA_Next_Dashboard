"use client";

import { Suspense, useRef } from "react";
import { OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { twMerge } from "tailwind-merge";
import * as THREE from "three";
import { DirectionalLightHelper, PointLightHelper } from "three";
import { PropellerModel } from "./propeller-model";

export function PropellerView({ label, className }: { label: string; className?: string }) {
  const debug = new URLSearchParams(location.search).get("debug") === "true";
  return (
    <div className={twMerge("flex-1", className)}>
      <Canvas
        className="flex !h-full !w-full"
        shadows
        gl={{ toneMappingExposure: 1.2 }}
      >
        <Lights />
        <Suspense fallback={null}>
          <PropellerModel label={label} />
        </Suspense>
        {debug && <OrbitControls enableDamping dampingFactor={0.1} />}
      </Canvas>
    </div>
  );
}

function Lights() {
  const dirLightRef1 = useRef<THREE.DirectionalLight>(null!);
  const dirLightRef2 = useRef<THREE.DirectionalLight>(null!);
  const dirLightRef3 = useRef<THREE.DirectionalLight>(null!);
  const pointLightRef = useRef<THREE.PointLight>(null!);

  const debug = new URLSearchParams(location.search).get("debug") === "true";

  useHelper(debug ? dirLightRef1 : null, DirectionalLightHelper, 1, "red");
  useHelper(debug ? dirLightRef2 : null, DirectionalLightHelper, 1, "blue");
  useHelper(debug ? dirLightRef3 : null, DirectionalLightHelper, 1, "green");
  useHelper(debug ? pointLightRef : null, PointLightHelper, 0.2, "yellow");

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight
        ref={pointLightRef}
        intensity={2}
        position={[2, 2, 2]}
        castShadow
        distance={10}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        ref={dirLightRef1}
        intensity={1}
        position={[-3, 3, 3]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        ref={dirLightRef2}
        intensity={2.2}
        position={[5, 0, 0]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight
        ref={dirLightRef3}
        intensity={1}
        position={[-2, -2, 2]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}
